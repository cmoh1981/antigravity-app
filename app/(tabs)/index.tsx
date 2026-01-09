import { useEffect, useMemo, useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, RefreshControl, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate } from "@/store";
import { generatePlanOfDay } from "@/lib/rules-engine";
import { createLLMProvider, NoLLMProvider } from "@/lib/llm-adapter";
import { CATEGORY_LABELS, GOAL_LABELS, CoachFacts } from "@/types";
import * as Haptics from "expo-haptics";

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

  // Check if check-in is for today
  const hasCheckedInToday = todayCheckIn?.date === getTodayDate();

  // Generate plan when check-in is complete
  useEffect(() => {
    if (hasCheckedInToday && userProfile && todayCheckIn && !todayPlan) {
      const todayMeals = mealLogs.filter(m => m.date === getTodayDate());
      const plan = generatePlanOfDay(userProfile, todayCheckIn, medications, todayMeals);
      useAppStore.getState().setTodayPlan(plan);
    }
  }, [hasCheckedInToday, userProfile, todayCheckIn, todayPlan, medications, mealLogs]);

  // Generate coach text
  useEffect(() => {
    if (todayPlan && userProfile && todayCheckIn) {
      const provider = settings.enableLLMCoach 
        ? createLLMProvider(true) 
        : new NoLLMProvider();
      
      const facts: CoachFacts = {
        userName: undefined, // Could be added to profile
        goal: userProfile.goal,
        todayMood: todayCheckIn.mood,
        todayStress: todayCheckIn.stress,
        exerciseCategory: todayPlan.exercisePlan.category,
        exerciseRoutineName: todayPlan.exercisePlan.routine.name,
        mealSuggestion: todayPlan.mealPlan[0]?.suggestion || '',
        sleepDuration: todayPlan.sleepRecommendation.duration,
      };
      
      provider.generateCoachText(facts).then(setCoachText);
    }
  }, [todayPlan, userProfile, todayCheckIn, settings.enableLLMCoach]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Regenerate plan
    if (hasCheckedInToday && userProfile && todayCheckIn) {
      const todayMeals = mealLogs.filter(m => m.date === getTodayDate());
      const plan = generatePlanOfDay(userProfile, todayCheckIn, medications, todayMeals);
      useAppStore.getState().setTodayPlan(plan);
    }
    setRefreshing(false);
  };

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
    // Navigate to exercise tab
    // router.push("/(tabs)/exercise");
  };

  const handleMealPress = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to meal tab
    // router.push("/(tabs)/meal");
  };

  // Show check-in prompt if not checked in today
  if (!hasCheckedInToday) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 justify-center items-center">
          <View 
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <Text className="text-5xl">☀️</Text>
          </View>
          
          <Text className="text-sm text-primary font-medium text-center mb-1">
            오늘건강
          </Text>
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            오늘 하루, 건강하게
          </Text>
          <Text className="text-base text-muted text-center mb-8">
            컨디션을 체크하면{"\n"}맞춤 계획을 만들어드릴게요
          </Text>
          
          <Pressable
            onPress={handleCheckIn}
            style={({ pressed }) => [
              styles.checkInButton,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text className="text-lg font-semibold text-white">
              오늘의 컨디션 체크하기
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  // Show loading if plan is not ready
  if (!todayPlan) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-muted">계획을 생성하고 있어요...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const { exercisePlan, mealPlan, sleepRecommendation, nextMealCorrection } = todayPlan;

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="px-6 pt-4">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-sm text-primary font-medium">
                오늘건강
              </Text>
              <Text className="text-2xl font-bold text-foreground">
                {new Date().toLocaleDateString('ko-KR', { 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'short'
                })}
              </Text>
            </View>
            <Pressable
              onPress={handleCheckIn}
              style={({ pressed }) => [
                styles.moodBadge,
                { backgroundColor: colors.surface },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text className="text-2xl">{todayCheckIn?.mood}</Text>
            </Pressable>
          </View>

          {/* Coach Greeting */}
          {coachText && (
            <View 
              className="p-4 rounded-2xl mb-6"
              style={{ backgroundColor: `${colors.primary}10` }}
            >
              <Text className="text-base text-foreground leading-relaxed">
                {coachText.greeting}
              </Text>
            </View>
          )}

          {/* Exercise Card */}
          <Pressable
            onPress={handleExercisePress}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface },
              pressed && { opacity: 0.9 },
            ]}
          >
            <View className="flex-row items-center mb-3">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: getCategoryColor(exercisePlan.category, colors) }}
              >
                <Text className="text-xl">🏃</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted">
                  {CATEGORY_LABELS[exercisePlan.category]}
                </Text>
                <Text className="text-lg font-semibold text-foreground">
                  {exercisePlan.routine.name}
                </Text>
              </View>
              <Text className="text-sm text-muted">
                {exercisePlan.routine.totalDuration}분
              </Text>
            </View>
            
            <Text className="text-sm text-muted mb-3">
              {exercisePlan.categoryReason}
            </Text>

            {/* Safety Notes */}
            {exercisePlan.safetyNotes.length > 0 && (
              <View 
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${colors.warning}15` }}
              >
                <Text className="text-xs font-medium mb-1" style={{ color: colors.warning }}>
                  ⚠️ 주의사항
                </Text>
                {exercisePlan.safetyNotes.map((note, i) => (
                  <Text key={i} className="text-xs text-foreground">
                    • {note}
                  </Text>
                ))}
              </View>
            )}

            {coachText && (
              <Text className="text-sm text-primary mt-3">
                {coachText.exerciseMotivation}
              </Text>
            )}
          </Pressable>

          {/* Meal Plan Card */}
          <Pressable
            onPress={handleMealPress}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.surface },
              pressed && { opacity: 0.9 },
            ]}
          >
            <View className="flex-row items-center mb-3">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.success}20` }}
              >
                <Text className="text-xl">🥗</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted">오늘의 식단</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {userProfile ? GOAL_LABELS[userProfile.goal] : '건강한'} 식단
                </Text>
              </View>
            </View>

            {/* Meal Summary */}
            <View className="gap-2">
              {mealPlan.map((meal, i) => (
                <View key={i} className="flex-row items-center">
                  <Text className="text-sm text-muted w-12">
                    {meal.mealType === 'breakfast' ? '아침' : 
                     meal.mealType === 'lunch' ? '점심' : '저녁'}
                  </Text>
                  <Text className="text-sm text-foreground flex-1" numberOfLines={1}>
                    {meal.suggestion}
                  </Text>
                </View>
              ))}
            </View>

            {/* Next Meal Correction */}
            {nextMealCorrection && (
              <View 
                className="mt-3 p-3 rounded-xl"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                <Text className="text-xs font-medium text-primary mb-1">
                  💡 다음 식사 팁
                </Text>
                <Text className="text-xs text-foreground">
                  {nextMealCorrection.suggestion}
                </Text>
              </View>
            )}

            {coachText && (
              <Text className="text-sm text-primary mt-3">
                {coachText.mealTip}
              </Text>
            )}
          </Pressable>

          {/* Sleep Card */}
          <View 
            style={[styles.card, { backgroundColor: colors.surface }]}
          >
            <View className="flex-row items-center mb-3">
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${colors.primary}20` }}
              >
                <Text className="text-xl">😴</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted">수면 권장</Text>
                <Text className="text-lg font-semibold text-foreground">
                  {sleepRecommendation.duration}시간
                </Text>
              </View>
              {sleepRecommendation.bedtimeWindow && (
                <Text className="text-sm text-muted">
                  {sleepRecommendation.bedtimeWindow.start} ~ {sleepRecommendation.bedtimeWindow.end}
                </Text>
              )}
            </View>
            
            <Text className="text-sm text-muted">
              {sleepRecommendation.reason}
            </Text>

            {coachText && (
              <Text className="text-sm text-primary mt-3">
                {coachText.sleepAdvice}
              </Text>
            )}
          </View>

          {/* Coach Closing */}
          {coachText && (
            <View 
              className="p-4 rounded-2xl mt-2"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-base text-foreground text-center">
                {coachText.closing}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

function getCategoryColor(category: string, colors: ReturnType<typeof useColors>): string {
  const categoryColors: Record<string, string> = {
    'PH': '#9B59B6',
    'SO': '#F39C12',
    'MB': '#3498DB',
    'TF': '#1ABC9C',
  };
  return `${categoryColors[category] || colors.primary}30`;
}

const styles = StyleSheet.create({
  checkInButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  moodBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
});
