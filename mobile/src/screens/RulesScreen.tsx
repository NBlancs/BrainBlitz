import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BadgeIcon } from "../components/BadgeIcon";
import { arcadeShadow, pixelBorder, theme } from "../theme";

export function RulesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Overview Card */}
      <View style={styles.card}>
        <Text style={styles.kicker}>MISSION BRIEFING</Text>
        <Text style={styles.title}>HOW TO PLAY</Text>
        <Text style={styles.paragraph}>
          BrainBlitz is a retro tactical trivia training simulator. Select a mission/category, customize your difficulty and country targets, and complete a 10-question round to earn points and claim rank badges!
        </Text>
      </View>

      {/* Rules Grid / Category Lockouts */}
      <View style={styles.card}>
        <Text style={styles.kicker}>HEARTS & LIFE SYSTEMS</Text>
        <Text style={styles.cardHeader}>❤️ CATEGORY LIVES</Text>
        <Text style={styles.paragraph}>
          Each category tracks its own health separately. You start with 3 lives (hearts) in every category.
        </Text>

        <Text style={styles.cardSubHeader}>❌ INCORRECT ANSWERS</Text>
        <Text style={styles.paragraph}>
          Answering a question wrong or running out of time (15s limit) costs 1 heart.
        </Text>

        <Text style={styles.cardSubHeader}>🔒 CATEGORY LOCKOUT</Text>
        <Text style={styles.paragraph}>
          If you lose all 3 hearts in a category, that category becomes locked for 5 minutes. You can still play other categories while it recharges!
        </Text>

        <Text style={styles.cardSubHeader}>⚡ HEART REGENERATION</Text>
        <Text style={styles.paragraph}>
          Answer 3 consecutive questions correctly during a round to regain 1 heart (capped at 3 maximum).
        </Text>
      </View>

      {/* Timing & Scoring */}
      <View style={styles.card}>
        <Text style={styles.kicker}>SCORING & SPEED</Text>
        <Text style={styles.cardHeader}>⏱️ TIME IS POINTS</Text>
        <Text style={styles.paragraph}>
          You have exactly 15 seconds per question. Correct answers grant 100 base points.
        </Text>
        <Text style={styles.paragraph}>
          You also earn a speed bonus based on how fast you answer. Speed is crucial to dominating the leaderboards!
        </Text>
      </View>

      {/* Badge Thresholds */}
      <View style={styles.card}>
        <Text style={styles.kicker}>RANK THRESHOLDS</Text>
        <Text style={styles.cardHeader}>🏆 EARN BADGES</Text>
        <Text style={styles.paragraph}>
          Earn badges based on your overall cumulative score history across all trivia missions:
        </Text>

        <View style={styles.badgeRow}>
          <BadgeIcon badge="BRONZE" size={32} />
          <View style={styles.badgeMeta}>
            <Text style={[styles.badgeName, { color: "#CD7F32" }]}>BRONZE BADGE</Text>
            <Text style={styles.badgeRule}>0 - 10,000 TOTAL POINTS</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <BadgeIcon badge="SILVER" size={32} />
          <View style={styles.badgeMeta}>
            <Text style={[styles.badgeName, { color: "#C0C0C0" }]}>SILVER BADGE</Text>
            <Text style={styles.badgeRule}>10,001 - 20,000 TOTAL POINTS</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <BadgeIcon badge="GOLD" size={32} />
          <View style={styles.badgeMeta}>
            <Text style={[styles.badgeName, { color: "#FFD700" }]}>GOLD BADGE</Text>
            <Text style={styles.badgeRule}>20,001 - 30,000 TOTAL POINTS</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <BadgeIcon badge="SCHOLAR" size={32} />
          <View style={styles.badgeMeta}>
            <Text style={[styles.badgeName, { color: "#9B5DE5" }]}>SCHOLAR BADGE</Text>
            <Text style={styles.badgeRule}>30,001+ TOTAL POINTS</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  card: {
    ...pixelBorder(4),
    backgroundColor: theme.colors.background,
    padding: 16,
    gap: 8,
  },
  kicker: {
    fontFamily: theme.fonts.mono,
    fontSize: 10,
    color: theme.colors.primary,
    letterSpacing: 1.5,
    fontWeight: "700",
  },
  title: {
    fontFamily: theme.fonts.mono,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.border,
    marginBottom: 4,
  },
  cardHeader: {
    fontFamily: theme.fonts.mono,
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.border,
    marginTop: 4,
  },
  cardSubHeader: {
    fontFamily: theme.fonts.mono,
    fontSize: 12,
    fontWeight: "700",
    color: theme.colors.border,
    marginTop: 8,
  },
  paragraph: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    color: theme.colors.border,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    padding: 8,
    ...pixelBorder(2),
    backgroundColor: theme.colors.background,
  },
  badgeMeta: {
    flex: 1,
    gap: 2,
  },
  badgeName: {
    fontFamily: theme.fonts.mono,
    fontSize: 11,
    fontWeight: "700",
  },
  badgeRule: {
    fontFamily: theme.fonts.mono,
    fontSize: 9,
    color: theme.colors.border,
  },
});
