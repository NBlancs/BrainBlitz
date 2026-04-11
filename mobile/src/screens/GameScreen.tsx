import { useMutation, useQuery } from "@apollo/client";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { GET_QUESTIONS, SUBMIT_SCORE } from "../lib/queries";
import { useGameStore } from "../store/useGameStore";
import { useSessionStore } from "../store/useSessionStore";
import { Answer, Question, RootStackParamList } from "../types";

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
  };
};

const QUESTION_TIME_MS = 15000;

export function GameScreen({ route, navigation }: Props) {
  const { category } = route.params;
  const user = useSessionStore((state) => state.user);

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

  const [submitError, setSubmitError] = useState<string | null>(null);
  const questionStartRef = useRef<number>(Date.now());
  const answeredQuestionIdRef = useRef<string | null>(null);

  const { data, loading, error, refetch } = useQuery<QuestionsResponse>(GET_QUESTIONS, {
    variables: {
      categoryId: category.id,
      limit: 10,
    },
    fetchPolicy: "network-only",
  });

  const [submitScore, { loading: submitLoading }] = useMutation<SubmitScoreResponse>(SUBMIT_SCORE);

  useEffect(() => {
    resetRound();
  }, [category.id, resetRound]);

  useEffect(() => {
    const payload = data?.getQuestions ?? [];
    if (status === "idle" && payload.length > 0) {
      startRound(payload);
    }
  }, [data, status, startRound]);

  const currentQuestion = questions[currentIndex];

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

      if (isLastQuestion) {
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

  const onSelectAnswer = (answer: Answer) => {
    if (status !== "active" || !currentQuestion) {
      return;
    }

    const questionId = currentQuestion.id;
    if (answeredQuestionIdRef.current === questionId) {
      return;
    }

    answeredQuestionIdRef.current = questionId;

    const elapsed = Math.min(Date.now() - questionStartRef.current, QUESTION_TIME_MS);
    submitAnswer({
      questionId,
      answerId: answer.id,
      responseTimeMs: elapsed,
      isCorrect: answer.isCorrect,
    });

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
      resetRound();
      navigation.replace("Leaderboard", {
        category,
        latestScore,
      });
    } catch (mutationError) {
      setSubmitError(mutationError instanceof Error ? mutationError.message : "Could not submit score.");
    }
  };

  const onQuitRound = () => {
    resetRound();
    navigation.goBack();
  };

  if (loading || (status === "idle" && !data?.getQuestions?.length)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.metaText}>Loading questions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Could not load questions</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <Pressable style={styles.primaryButton} onPress={() => refetch()}>
          <Text style={styles.primaryButtonText}>Retry</Text>
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
        <Text style={styles.title}>Round Complete</Text>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Correct Answers</Text>
          <Text style={styles.summaryValue}>
            {correctAnswers} / {submissions.length}
          </Text>
          <Text style={styles.summaryLabel}>Projected Total</Text>
          <Text style={styles.summaryValue}>{projectedPoints} pts</Text>
        </View>

        {submitError ? <Text style={styles.errorMessage}>{submitError}</Text> : null}

        <Pressable style={styles.primaryButton} onPress={onSubmitRound} disabled={submitLoading}>
          {submitLoading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.primaryButtonText}>Submit Score</Text>}
        </Pressable>

        <Pressable style={styles.ghostButton} onPress={onQuitRound}>
          <Text style={styles.ghostButtonText}>Back to Categories</Text>
        </Pressable>
      </View>
    );
  }

  const questionNumber = currentIndex + 1;
  const timerSeconds = Math.ceil(currentRemainingMs / 1000);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.progress}>Question {questionNumber} / {questions.length}</Text>
        <Text style={styles.timer}>{timerSeconds}s</Text>
      </View>

      <Text style={styles.pointsText}>Current points: {currentPoints}</Text>

      <ScrollView contentContainerStyle={styles.questionArea}>
        <Text style={styles.questionText}>{currentQuestion?.text}</Text>

        <View style={styles.answersList}>
          {currentQuestion?.answers.map((answer) => (
            <Pressable key={answer.id} style={styles.answerButton} onPress={() => onSelectAnswer(answer)}>
              <Text style={styles.answerText}>{answer.text}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable style={styles.ghostButton} onPress={onQuitRound}>
        <Text style={styles.ghostButtonText}>Quit Round</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progress: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "600",
  },
  timer: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  pointsText: {
    marginTop: 8,
    color: "#0f172a",
    fontWeight: "600",
  },
  questionArea: {
    marginTop: 16,
    gap: 14,
  },
  questionText: {
    fontSize: 22,
    lineHeight: 31,
    color: "#0f172a",
    fontWeight: "700",
  },
  answersList: {
    gap: 10,
    marginTop: 8,
  },
  answerButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  answerText: {
    fontSize: 16,
    color: "#0f172a",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e2e8f0",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 4,
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 6,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  ghostButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 10,
  },
  ghostButtonText: {
    color: "#334155",
    fontWeight: "600",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    textAlign: "center",
  },
  errorMessage: {
    color: "#b91c1c",
    textAlign: "center",
    marginTop: 4,
  },
  metaText: {
    color: "#475569",
  },
});
