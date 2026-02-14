import { useEffect, useMemo, useState, useCallback } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, RefreshControl, Platform, Dimensions } from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate } from "@/store";
import { generatePlanOfDay } from "@/lib/rules-engine";
import { createLLMProvider, NoLLMProvider } from "@/lib/llm-adapter";
import { CATEGORY_LABELS, GOAL_LABELS, CoachFacts } from "@/types";
import * as Haptics from "expo-haptics";
import { AnimatedEntry } from "@/components/animated-entry";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CATEGORY_ICONS: Record<string, string> = {
  PH: "🏠",
  SO: "☀️",
  MB: "🧠",
  TF: "🌡️",
};

const MEAL_TYPE_ICONS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
};

const MEAL_TYPE_LABELS: Record<string, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
};

export default function HomeScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);
  const [coachText, setCoachText] = useState<{
    greeting: string;
    exerciseMotivation: string;
    mealTip: string;
    sleepAdvice: string;
    closing: string;
  } | null>(null);

  const userProfile = useAppStore((state) => state.userProfile);
  const todayCheckIn = useAppStore((state) => state.todayCheckIn);
  const todayPlan = useAppStore((state) => state.todayPlan);
  const medications = useAppStore((state) => state.medications);
  const mealLogs = useAppStore((state) => state.mealLogs);
  const settings = useAppStore((state) => state.settings);

  const hasCheckedInToday = todayCheckIn?.date === getTodayDate();

  useEffect(() => {
    if (hasCheckedInToday && userProfile && todayCheckIn && !todayPlan) {
      const todayMeals = mealLogs.filter((m) => m.date === getTodayDate());
      const plan = generatePlanOfDay(userProfile, todayCheckIn, medications, todayMeals);
      useAppStore.getState().setTodayPlan(plan);
    }
  }, [hasCheckedInToday, userProfile, todayCheckIn, todayPlan, medications, mealLogs]);

  useEffect(() => {
    if (todayPlan && userProfile && todayCheckIn) {
      const provider = settings.enableLLMCoach ? createLLMProvider(true) : new NoLLMProvider();
      const facts: CoachFacts = {
        userName: undefined,
        goal: userProfile.goal,
        todayMood: todayCheckIn.mood,
        todayStress: todayCheckIn.stress,
        exerciseCategory: todayPlan.exercisePlan.category,
        exerciseRoutineName: todayPlan.exercisePlan.routine.name,
        mealSuggestion: todayPlan.mealPlan[0]?.suggestion || "",
        sleepDuration: todayPlan.sleepRecommendation.duration,
      };
      provider.generateCoachText(facts).then(setCoachText);
    }
  }, [todayPlan, userProfile, todayCheckIn, settings.enableLLMCoach]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (hasCheckedInToday && userProfile && todayCheckIn) {
      const todayMeals = mealLogs.filter((m) => m.date === getTodayDate());
      const plan = generatePlanOfDay(userProfile, todayCheckIn, medications, todayMeals);
      useAppStore.getState().setTodayPlan(plan);
    }
    setRefreshing(false);
  }, [hasCheckedInToday, userProfile, todayCheckIn, medications, mealLogs]);

  const handleCheckIn = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/checkin");
  };

  const handleExercisePress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMealPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 6) return "새벽이에요";
    if (hour < 12) return "좋은 아침이에요";
    if (hour < 18) return "좋은 오후예요";
    return "좋은 저녁이에요";
  }, []);

  // ===== CHECK-IN PROMPT =====
  if (!hasCheckedInToday) {
    return (
      <ScreenContainer>
        <View className="flex-1 justify-center items-center px-6">
          <View
            className="absolute top-0 left-0 right-0 h-72 rounded-b-3xl"
            style={{ backgroundColor: `${colors.primary}08` }}
          />

          <AnimatedEntry delay={100} duration={500} className="items-center">
            <View
              className="w-28 h-28 rounded-3xl overflow-hidden mb-6"
              style={styles.logoShadow}
            >
              <Image
                source={require("@/assets/images/icon.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>

            <Text className="text-sm text-primary font-semibold tracking-wide mb-1">
              오늘건강
            </Text>
            <Text className="text-3xl font-bold text-foreground text-center mb-2">
              {timeGreeting} 👋
            </Text>
            <Text className="text-base text-muted text-center mb-10 leading-relaxed">
              오늘의 컨디션을 알려주시면{"\n"}맞춤 건강 계획을 만들어드릴게요
            </Text>
          </AnimatedEntry>

          <AnimatedEntry direction="up" delay={300} duration={500} className="w-full items-center">
            <View className="flex-row gap-3 mb-8 w-full max-w-sm">
              <InfoChip icon="🏃" label="운동" desc="맞춤 루틴" colors={colors} />
              <InfoChip icon="🥗" label="식단" desc="건강 추천" colors={colors} />
              <InfoChip icon="😴" label="수면" desc="최적 가이드" colors={colors} />
            </View>

            <Pressable
              onPress={handleCheckIn}
              style={({ pressed }) => [
                styles.ctaButton,
                { backgroundColor: colors.primary },
                pressed && styles.ctaPressed,
              ]}
            >
              <Text className="text-white text-lg font-bold">오늘의 컨디션 체크하기</Text>
              <Text className="text-white text-xs opacity-80 mt-1">약 15초면 완료돼요</Text>
            </Pressable>
          </AnimatedEntry>
        </View>
      </ScreenContainer>
    );
  }

  // ===== LOADING =====
  if (!todayPlan) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 justify-center items-center">
          <AnimatedEntry duration={400}>
            <Text className="text-5xl mb-4">✨</Text>
            <Text className="text-lg font-semibold text-foreground text-center mb-2">
              맞춤 계획 생성 중
            </Text>
            <Text className="text-sm text-muted text-center">잠시만 기다려주세요...</Text>
          </AnimatedEntry>
        </View>
      </ScreenContainer>
    );
  }

  const { exercisePlan, mealPlan, sleepRecommendation, nextMealCorrection } = todayPlan;

  // ===== MAIN DASHBOARD =====
  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-semibold text-primary tracking-wide">오늘건강</Text>
              <Text className="text-2xl font-bold text-foreground">
                {new Date().toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </Text>
            </View>
            <Pressable
              onPress={handleCheckIn}
              style={({ pressed }) => [
                styles.moodBadge,
                { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text className="text-2xl">{todayCheckIn?.mood}</Text>
            </Pressable>
          </View>
        </View>

        {/* Coach Greeting Banner */}
        {coachText && (
          <AnimatedEntry delay={100} duration={400}>
            <View
              className="mx-5 p-4 rounded-2xl mb-4"
              style={{ backgroundColor: `${colors.primary}12` }}
            >
              <Text className="text-base text-foreground leading-relaxed">
                {coachText.greeting}
              </Text>
            </View>
          </AnimatedEntry>
        )}

        {/* Today's Summary Strip */}
        <AnimatedEntry delay={200} duration={400}>
          <View className="flex-row mx-5 mb-4 gap-2">
            <SummaryPill
              icon="🏃"
              value={`${exercisePlan.routine.totalDuration}분`}
              label="운동"
              colors={colors}
            />
            <SummaryPill
              icon="🍽️"
              value={`${mealPlan.length}끼`}
              label="식단"
              colors={colors}
            />
            <SummaryPill
              icon="😴"
              value={`${sleepRecommendation.duration}h`}
              label="수면"
              colors={colors}
            />
          </View>
        </AnimatedEntry>

        {/* Exercise Card */}
        <AnimatedEntry delay={300} duration={400}>
          <Pressable
            onPress={handleExercisePress}
            style={({ pressed }) => [pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] }]}
          >
            <View className="mx-5 mb-4 rounded-2xl overflow-hidden" style={[styles.cardShadow, { backgroundColor: colors.surface }]}>
              <View
                className="h-1.5"
                style={{ backgroundColor: getCategoryColor(exercisePlan.category) }}
              />
              <View className="p-4">
                <View className="flex-row items-center mb-3">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${getCategoryColor(exercisePlan.category)}18` }}
                  >
                    <Text className="text-2xl">{CATEGORY_ICONS[exercisePlan.category] || "🏃"}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted font-medium">
                      {CATEGORY_LABELS[exercisePlan.category]} · {exercisePlan.routine.totalDuration}분
                    </Text>
                    <Text className="text-lg font-bold text-foreground">
                      {exercisePlan.routine.name}
                    </Text>
                  </View>
                  <View
                    className="px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: `${colors.primary}15` }}
                  >
                    <Text className="text-xs font-semibold text-primary">시작 →</Text>
                  </View>
                </View>

                <Text className="text-sm text-muted leading-relaxed mb-3">
                  {exercisePlan.categoryReason}
                </Text>

                {exercisePlan.safetyNotes.length > 0 && (
                  <View
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: `${colors.warning}10` }}
                  >
                    <Text className="text-xs font-semibold mb-1" style={{ color: colors.warning }}>
                      ⚠️ 주의사항
                    </Text>
                    {exercisePlan.safetyNotes.map((note, i) => (
                      <Text key={i} className="text-xs text-foreground leading-relaxed">
                        • {note}
                      </Text>
                    ))}
                  </View>
                )}

                {coachText && (
                  <Text className="text-sm text-primary mt-3 font-medium">
                    💪 {coachText.exerciseMotivation}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        </AnimatedEntry>

        {/* Meal Plan Card */}
        <AnimatedEntry delay={400} duration={400}>
          <Pressable
            onPress={handleMealPress}
            style={({ pressed }) => [pressed && { opacity: 0.95, transform: [{ scale: 0.99 }] }]}
          >
            <View className="mx-5 mb-4 rounded-2xl overflow-hidden" style={[styles.cardShadow, { backgroundColor: colors.surface }]}>
              <View
                className="h-1.5"
                style={{ backgroundColor: colors.success }}
              />
              <View className="p-4">
                <View className="flex-row items-center mb-4">
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                    style={{ backgroundColor: `${colors.success}15` }}
                  >
                    <Text className="text-2xl">🥗</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-muted font-medium">오늘의 식단</Text>
                    <Text className="text-lg font-bold text-foreground">
                      {userProfile ? GOAL_LABELS[userProfile.goal] : "건강한"} 식단
                    </Text>
                  </View>
                </View>

                <View className="gap-2">
                  {mealPlan.map((meal, i) => (
                    <View
                      key={i}
                      className="flex-row items-center p-3 rounded-xl"
                      style={{ backgroundColor: `${colors.background}` }}
                    >
                      <Text className="text-lg mr-3">{MEAL_TYPE_ICONS[meal.mealType] || "🍽️"}</Text>
                      <View className="flex-1">
                        <Text className="text-xs text-muted">{MEAL_TYPE_LABELS[meal.mealType] || meal.mealType}</Text>
                        <Text className="text-sm font-medium text-foreground" numberOfLines={1}>
                          {meal.suggestion}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {nextMealCorrection && (
                  <View
                    className="mt-3 p-3 rounded-xl"
                    style={{ backgroundColor: `${colors.primary}08` }}
                  >
                    <Text className="text-xs font-semibold text-primary mb-1">💡 다음 식사 팁</Text>
                    <Text className="text-xs text-foreground leading-relaxed">
                      {nextMealCorrection.reason}
                    </Text>
                  </View>
                )}

                {coachText && (
                  <Text className="text-sm text-primary mt-3 font-medium">
                    🥗 {coachText.mealTip}
                  </Text>
                )}
              </View>
            </View>
          </Pressable>
        </AnimatedEntry>

        {/* Sleep Card */}
        <AnimatedEntry delay={500} duration={400}>
          <View className="mx-5 mb-4 rounded-2xl overflow-hidden" style={[styles.cardShadow, { backgroundColor: colors.surface }]}>
            <View
              className="h-1.5"
              style={{ backgroundColor: "#7C3AED" }}
            />
            <View className="p-4">
              <View className="flex-row items-center mb-3">
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
                  style={{ backgroundColor: "#7C3AED18" }}
                >
                  <Text className="text-2xl">🌙</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted font-medium">수면 권장</Text>
                  <Text className="text-lg font-bold text-foreground">
                    {sleepRecommendation.duration}시간 수면
                  </Text>
                </View>
                {sleepRecommendation.bedtimeWindow && (
                  <View
                    className="px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "#7C3AED12" }}
                  >
                    <Text className="text-xs font-semibold" style={{ color: "#7C3AED" }}>
                      {sleepRecommendation.bedtimeWindow.start} ~ {sleepRecommendation.bedtimeWindow.end}
                    </Text>
                  </View>
                )}
              </View>

              <Text className="text-sm text-muted leading-relaxed">
                {sleepRecommendation.reason}
              </Text>

              {coachText && (
                <Text className="text-sm mt-3 font-medium" style={{ color: "#7C3AED" }}>
                  🌙 {coachText.sleepAdvice}
                </Text>
              )}
            </View>
          </View>
        </AnimatedEntry>

        {/* Coach Closing */}
        {coachText && (
          <AnimatedEntry delay={600} duration={400}>
            <View
              className="mx-5 p-5 rounded-2xl mb-4"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-base text-foreground text-center leading-relaxed font-medium">
                {coachText.closing}
              </Text>
            </View>
          </AnimatedEntry>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

// ===== Sub Components =====

function InfoChip({
  icon,
  label,
  desc,
  colors,
}: {
  icon: string;
  label: string;
  desc: string;
  colors: { surface: string; border: string };
}) {
  return (
    <View
      className="flex-1 items-center py-4 rounded-2xl"
      style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 0.5 }}
    >
      <Text className="text-2xl mb-1">{icon}</Text>
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
      <Text className="text-xs text-muted">{desc}</Text>
    </View>
  );
}

function SummaryPill({
  icon,
  value,
  label,
  colors,
}: {
  icon: string;
  value: string;
  label: string;
  colors: { surface: string; border: string };
}) {
  return (
    <View
      className="flex-1 flex-row items-center justify-center py-3 rounded-xl gap-1.5"
      style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 0.5 }}
    >
      <Text className="text-base">{icon}</Text>
      <Text className="text-sm font-bold text-foreground">{value}</Text>
      <Text className="text-xs text-muted">{label}</Text>
    </View>
  );
}

function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    PH: "#8B5CF6",
    SO: "#F59E0B",
    MB: "#3B82F6",
    TF: "#10B981",
  };
  return map[category] || "#E8853D";
}

const styles = StyleSheet.create({
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
    shadowColor: "#E8853D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  moodBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  logoShadow: {
    shadowColor: "#E8853D",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
});
