import { useMutation, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { AnimatedReveal } from "../components/AnimatedReveal";
import { HeartsDisplay } from "../components/HeartsDisplay";
import { HeartsGoneModal } from "../components/HeartsGoneModal";
import { BadgeCelebrationModal } from "../components/BadgeCelebrationModal";
import { GET_QUESTIONS, SUBMIT_SCORE } from "../lib/queries";
import { playClickSound, playCorrectSound, playWinnerSound, playWrongSound } from "../lib/soundManager";
import { useGameStore } from "../store/useGameStore";
import { useSessionStore } from "../store/useSessionStore";
import { arcadeShadow, pixelBorder, pressedShadow, theme } from "../theme";
import { Answer, Question, RootStackParamList, User } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "Game">;

type QuestionsResponse = {
  getQuestions: Question[];
};

type SubmitScoreResponse = {
  submitScore: {
    id: string;
    points: number;
    correctAnswers: number;
    totalQuestions: number;
    speedBonus: number;
    user: User;
  };
};

const QUESTION_TIME_MS = 15000;
const TIMER_BLOCK_COUNT = 10;
const ANSWER_COLORS = ["#4CAF50", "#FFC107", "#F44336", "#0055FF"];

export function GameScreen({ route, navigation }: Props) {
  const { category } = route.params;
  const user = useSessionStore((state) => state.user);
  const setUser = useSessionStore((state) => state.setUser);

  const status = useGameStore((state) => state.status);
  const questions = useGameStore((state) => state.questions);
  const currentIndex = useGameStore((state) => state.currentIndex);
  const currentRemainingMs = useGameStore((state) => state.currentRemainingMs);
  const submissions = useGameStore((state) => state.submissions);
  const startRound = useGameStore((state) => state.startRound);
  const setRemainingMs = useGameStore((state) => state.setRemainingMs);
  const submitAnswer = useGameStore((state) => state.submitAnswer);
  const advanceQuestion = useGameStore((state) => state.advanceQuestion);
  const completeRound = useGameStore((state) => state.completeRound);
  const resetRound = useGameStore((state) => state.resetRound);

  const hearts = useGameStore((state) => state.hearts);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"correct" | "wrong" | null>(null);
  const questionStartRef = useRef<number>(Date.now());
  const answeredQuestionIdRef = useRef<string | null>(null);
  const correctFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const winnerPlayedRef = useRef(false);
  const currentQuestion = questions[currentIndex];

  const [showHeartsGone, setShowHeartsGone] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeBadge, setUpgradeBadge] = useState<"BRONZE" | "SILVER" | "GOLD" | "SCHOLAR">("BRONZE");
  const latestScoreRef = useRef(0);

  const difficulty = useGameStore((state) => state.difficulty) || "EASY";
  const country = useGameStore((state) => state.country) || "PHILIPPINES";
  const { data, loading, error, refetch } = useQuery<QuestionsResponse>(GET_QUESTIONS, {
    variables: {
      categoryId: category.id,
      difficulty,
      country,
    },
    fetchPolicy: "network-only",
  });

  const [submitScore, { loading: submitLoading }] = useMutation<SubmitScoreResponse>(SUBMIT_SCORE);

  useEffect(() => {
    resetRound();
  }, [category.id, resetRound]);

  useEffect(() => {
    if (status === "idle") {
      winnerPlayedRef.current = false;
      setFeedbackType(null);
    }
  }, [status]);

  useEffect(() => {
    if (hearts === 0 && status === "active") {
      setShowHeartsGone(true);
    }
  }, [hearts, status]);

  useEffect(() => {
    return () => {
      if (correctFeedbackTimeoutRef.current) {
        clearTimeout(correctFeedbackTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const payload = data?.getQuestions ?? [];
    if (status === "idle" && payload.length > 0) {
      startRound(payload);
    }
  }, [data, status, startRound]);

  useEffect(() => {
    if (status !== "active" || !currentQuestion) {
      return;
    }

    const questionId = currentQuestion.id;
    const isLastQuestion = currentIndex >= questions.length - 1;

    answeredQuestionIdRef.current = null;
    questionStartRef.current = Date.now();
    setRemainingMs(QUESTION_TIME_MS);

    const timer = setInterval(() => {
      if (answeredQuestionIdRef.current === questionId) {
        return;
      }

      const elapsed = Date.now() - questionStartRef.current;
      const next = Math.max(QUESTION_TIME_MS - elapsed, 0);
      setRemainingMs(next);

      if (next > 0) {
        return;
      }

      answeredQuestionIdRef.current = questionId;
      submitAnswer({
        questionId,
        answerId: null,
        responseTimeMs: QUESTION_TIME_MS,
        isCorrect: false,
      });

      const currentHearts = useGameStore.getState().hearts;
      if (currentHearts === 0) {
        completeRound();
      } else if (isLastQuestion) {
        completeRound();
      } else {
        advanceQuestion();
      }
    }, 150);

    return () => {
      clearInterval(timer);
    };
  }, [
    status,
    currentQuestion?.id,
    currentIndex,
    questions.length,
    setRemainingMs,
    submitAnswer,
    completeRound,
    advanceQuestion,
  ]);

  useEffect(() => {
    if (status !== "complete" || winnerPlayedRef.current) {
      return;
    }

    winnerPlayedRef.current = true;
    void playWinnerSound();
  }, [status]);

  const currentPoints = useMemo(
    () => submissions.reduce((total, item) => total + (item.isCorrect ? 100 : 0), 0),
    [submissions]
  );

  const estimatedSpeedBonus = useMemo(() => {
    const totalPossibleMs = submissions.length * QUESTION_TIME_MS;
    const usedMs = submissions.reduce((total, item) => total + item.responseTimeMs, 0);
    const unusedMs = Math.max(totalPossibleMs - usedMs, 0);
    return Math.floor(unusedMs / 1000) * 10;
  }, [submissions]);

  const currentScore = currentPoints + estimatedSpeedBonus;

  const onSelectAnswer = (answer: Answer) => {
    if (status !== "active" || !currentQuestion) {
      return;
    }

    const questionId = currentQuestion.id;
    if (answeredQuestionIdRef.current === questionId) {
      return;
    }

    answeredQuestionIdRef.current = questionId;

    void playClickSound();

    if (answer.isCorrect) {
      void playCorrectSound();
      setFeedbackType("correct");
    } else {
      void playWrongSound();
      setFeedbackType("wrong");
    }

    if (correctFeedbackTimeoutRef.current) {
      clearTimeout(correctFeedbackTimeoutRef.current);
    }

    correctFeedbackTimeoutRef.current = setTimeout(() => {
      setFeedbackType(null);
      correctFeedbackTimeoutRef.current = null;
    }, 600);

    const elapsed = Math.min(Date.now() - questionStartRef.current, QUESTION_TIME_MS);
    submitAnswer({
      questionId,
      answerId: answer.id,
      responseTimeMs: elapsed,
      isCorrect: answer.isCorrect,
    });

    const currentHearts = useGameStore.getState().hearts;
    if (currentHearts === 0) {
      completeRound();
      return;
    }

    const isLastQuestion = currentIndex >= questions.length - 1;
    if (isLastQuestion) {
      completeRound();
    } else {
      advanceQuestion();
    }
  };

  const onSubmitRound = async () => {
    if (!user || submissions.length === 0) {
      return;
    }

    try {
      void playClickSound();
      setSubmitError(null);

      const result = await submitScore({
        variables: {
          userId: user.id,
          categoryId: category.id,
          answers: submissions.map((submission) => ({
            questionId: submission.questionId,
            answerId: submission.answerId,
            responseTimeMs: submission.responseTimeMs,
          })),
        },
      });

      const latestScore = result.data?.submitScore.points ?? currentPoints + estimatedSpeedBonus;
      latestScoreRef.current = latestScore;

      const updatedUser = result.data?.submitScore.user;
      if (user && updatedUser && user.badge !== updatedUser.badge) {
        setUpgradeBadge(updatedUser.badge);
        setUser(updatedUser);
        setShowUpgrade(true);
      } else {
        if (updatedUser) {
          setUser(updatedUser);
        }
        resetRound();
        navigation.replace("Leaderboard", {
          category,
          latestScore,
        });
      }
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Could not submit score.");
    }
  };

  const onDismissHeartsGone = () => {
    setShowHeartsGone(false);
    resetRound();
    navigation.goBack();
  };

  const onDismissUpgrade = () => {
    setShowUpgrade(false);
    resetRound();
    navigation.replace("Leaderboard", {
      category,
      latestScore: latestScoreRef.current,
    });
  };

  const onQuitRound = () => {
    void playClickSound();
    resetRound();
    navigation.goBack();
  };

  if (loading || (status === "idle" && !data?.getQuestions?.length)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.metaText}>SYNCING QUESTIONS...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load questions</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]} onPress={() => { void playClickSound(); void refetch(); }}>
          <Text style={styles.primaryButtonText}>RETRY</Text>
        </Pressable>
      </View>
    );
  }

  if (!currentQuestion && status !== "complete") {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>No questions found for this category.</Text>
      </View>
    );
  }

  if (status === "complete") {
    const correctAnswers = submissions.filter((entry) => entry.isCorrect).length;
    const projectedPoints = currentPoints + estimatedSpeedBonus;

    return (
      <View style={styles.container}>
        <AnimatedReveal resetKey={`${status}-${currentQuestion?.id ?? "none"}`} duration={220} fromY={12}>
          <Text style={styles.title}>MISSION COMPLETE</Text>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>CORRECT ANSWERS</Text>
            <Text style={styles.summaryValue}>
              {correctAnswers} / {submissions.length}
            </Text>
            <Text style={styles.summaryLabel}>PROJECTED TOTAL</Text>
            <Text style={styles.summaryValue}>{projectedPoints} pts</Text>
          </View>

          {submitError ? <Text style={styles.errorMessage}>{submitError}</Text> : null}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              submitLoading && styles.primaryButtonDisabled,
            ]}
            onPress={onSubmitRound}
            disabled={submitLoading}
          >
            {submitLoading ? <ActivityIndicator color={theme.colors.white} /> : <Text style={styles.primaryButtonText}>SUBMIT SCORE</Text>}
          </Pressable>

          <Pressable style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]} onPress={onQuitRound}>
            <Text style={styles.ghostButtonText}>BACK TO MISSIONS</Text>
          </Pressable>
        </AnimatedReveal>

        <BadgeCelebrationModal
          visible={showUpgrade}
          badge={upgradeBadge}
          onClose={onDismissUpgrade}
        />
      </View>
    );
  }

  const questionNumber = currentIndex + 1;
  const timerSeconds = Math.ceil(currentRemainingMs / 1000);
  const timerBlocksFilled = Math.max(
    0,
    Math.min(TIMER_BLOCK_COUNT, Math.ceil((currentRemainingMs / QUESTION_TIME_MS) * TIMER_BLOCK_COUNT))
  );
  const timerVisual =
    "■".repeat(timerBlocksFilled) + "□".repeat(Math.max(TIMER_BLOCK_COUNT - timerBlocksFilled, 0));

  return (
    <View style={styles.container}>
      <Modal transparent visible={feedbackType !== null} animationType="fade" statusBarTranslucent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {feedbackType === "correct" ? (
              <Image source={require("../assets/check.png")} style={styles.checkImage} resizeMode="contain" />
            ) : (
              <Image source={require("../assets/wrong.png")} style={styles.checkImage} resizeMode="contain" />
            )}
          </View>
        </View>
      </Modal>

      <AnimatedReveal
        style={styles.roundWrap}
        resetKey={`${status}-${currentQuestion?.id ?? "none"}`}
        duration={220}
        fromY={12}
      >
        <View style={styles.hudCard}>
          <View style={styles.hudLeft}>
            <Text style={styles.progressTitle}>ROUND STATUS</Text>
            <Text style={styles.progress}>Q{questionNumber} / {questions.length}</Text>
          </View>
          <View style={styles.hudCenter}>
            <HeartsDisplay hearts={hearts} />
          </View>
          <View style={[styles.timerWrap, styles.hudRight]}>
            <Text style={styles.timerVisual} numberOfLines={1} ellipsizeMode="clip">{timerVisual}</Text>
            <Text style={styles.timer}>{timerSeconds}s</Text>
          </View>
        </View>

        <Text style={styles.pointsText}>CURRENT SCORE: {currentScore}</Text>

        <ScrollView contentContainerStyle={styles.questionArea}>
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>QUESTION</Text>
            <Text style={styles.questionText}>{currentQuestion?.text}</Text>
          </View>

          <View style={styles.answersList}>
            {currentQuestion?.answers.map((answer, index) => (
              <Pressable
                key={answer.id}
                style={({ pressed }) => [
                  styles.answerButton,
                  { backgroundColor: ANSWER_COLORS[index % ANSWER_COLORS.length] },
                  pressed && styles.answerButtonPressed,
                ]}
                onPress={() => onSelectAnswer(answer)}
              >
                <Text style={styles.answerText}>{answer.text.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Pressable style={({ pressed }) => [styles.ghostButton, pressed && styles.ghostButtonPressed]} onPress={onQuitRound}>
          <Text style={styles.ghostButtonText}>QUIT ROUND</Text>
        </Pressable>
      </AnimatedReveal>

      <HeartsGoneModal
        visible={showHeartsGone}
        onClose={onDismissHeartsGone}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  roundWrap: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 27,
    fontWeight: "700",
    color: theme.colors.primary,
    letterSpacing: 1,
    marginBottom: 10,
  },
  hudCard: {
    ...pixelBorder(4),
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: theme.colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hudLeft: {
    flex: 1.1,
    alignItems: "flex-start",
  },
  hudCenter: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  hudRight: {
    flex: 1.3,
    alignItems: "flex-end",
  },
  progressTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    color: theme.colors.border,
    letterSpacing: 0.8,
  },
  progress: {
    fontFamily: theme.fonts.mono,
    fontSize: 16,
    color: theme.colors.border,
    fontWeight: "700",
    marginTop: 3,
  },
  timerWrap: {
    alignItems: "flex-end",
  },
  timerVisual: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
    letterSpacing: 0.5,
  },
  timer: {
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
    marginTop: 2,
  },
  pointsText: {
    marginTop: 10,
    color: theme.colors.border,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    fontWeight: "600",
  },
  questionArea: {
    marginTop: 16,
    gap: 12,
    paddingBottom: 8,
  },
  questionCard: {
    ...pixelBorder(4),
    padding: 14,
    backgroundColor: theme.colors.background,
  },
  questionLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.border,
    letterSpacing: 1,
    marginBottom: 6,
  },
  questionText: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    lineHeight: 30,
    color: theme.colors.border,
    fontWeight: "700",
  },
  answersList: {
    gap: 11,
    marginTop: 2,
  },
  answerButton: {
    ...pixelBorder(3),
    paddingVertical: 13,
    paddingHorizontal: 12,
    ...arcadeShadow(4),
  },
  answerButtonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  answerText: {
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    color: theme.colors.border,
    fontWeight: "700",
  },
  summaryCard: {
    backgroundColor: theme.colors.background,
    ...pixelBorder(4),
    padding: 16,
    gap: 4,
    marginBottom: 14,
  },
  summaryLabel: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    color: theme.colors.border,
    letterSpacing: 1,
  },
  summaryValue: {
    fontFamily: theme.fonts.mono,
    fontSize: 23,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    ...pixelBorder(3),
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 6,
    ...arcadeShadow(4),
  },
  primaryButtonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    letterSpacing: 1,
    fontWeight: "700",
    fontSize: 15,
  },
  ghostButton: {
    backgroundColor: theme.colors.danger,
    ...pixelBorder(3),
    alignItems: "center",
    paddingVertical: 13,
    marginTop: 10,
    ...arcadeShadow(4),
  },
  ghostButtonPressed: {
    transform: [{ translateY: 4 }],
    ...pressedShadow,
  },
  ghostButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "600",
  },
  errorTitle: {
    fontFamily: theme.fonts.mono,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.border,
    textAlign: "center",
  },
  errorMessage: {
    color: theme.colors.danger,
    fontFamily: theme.fonts.mono,
    fontSize: 13,
    textAlign: "center",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  modalContent: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  checkImage: {
    width: 130,
    height: 130,
  },
  metaText: {
    color: theme.colors.border,
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    letterSpacing: 1,
  },
});
