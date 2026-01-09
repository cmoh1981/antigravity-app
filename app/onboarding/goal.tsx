import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import { UserGoal, GOAL_LABELS } from "@/types";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { OnboardingProgress } from "@/components/onboarding-progress";

const GOALS: { value: UserGoal; emoji: string; description: string }[] = [
  { value: "weight_management", emoji: "⚖️", description: "건강한 체중을 유지하고 싶어요" },
  { value: "diet", emoji: "🥗", description: "체중을 줄이고 싶어요" },
  { value: "muscle_gain", emoji: "💪", description: "근육을 키우고 싶어요" },
  { value: "weight_gain", emoji: "🍖", description: "건강하게 체중을 늘리고 싶어요" },
  { value: "stress_relief", emoji: "🧘", description: "스트레스를 해소하고 싶어요" },
];

export default function GoalScreen() {
  const colors = useColors();
  const [selectedGoal, setSelectedGoal] = useState<UserGoal | null>(null);
  const completeOnboardingStep = useAppStore((state) => state.completeOnboardingStep);

  const handleSelect = (goal: UserGoal) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedGoal(goal);
  };

  const handleNext = () => {
    if (!selectedGoal) return;
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Store the selected goal temporarily
    useAppStore.setState((state) => ({
      userProfile: {
        id: `user-${Date.now()}`,
        goal: selectedGoal,
        inBody: { height: 0, weight: 0 },
        diseases: [],
        sleepProfile: { isShiftWorker: false },
        onboardingCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }));
    
    completeOnboardingStep('goal');
    router.push("/onboarding/body");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      {/* Progress Bar */}
      <OnboardingProgress currentStepId="goal" />
      
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4">
          {/* Title */}
          <Text className="text-2xl font-bold text-foreground mb-2">
            목표를 선택해주세요
          </Text>
          <Text className="text-base text-muted mb-8">
            당신의 목표에 맞춰 맞춤 추천을 해드릴게요
          </Text>

          {/* Goal Options */}
          <View className="gap-3">
            {GOALS.map((goal) => (
              <Pressable
                key={goal.value}
                onPress={() => handleSelect(goal.value)}
                style={({ pressed }) => [
                  styles.goalCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: selectedGoal === goal.value ? colors.primary : colors.border,
                    borderWidth: selectedGoal === goal.value ? 2 : 1,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text className="text-3xl mr-4">{goal.emoji}</Text>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {GOAL_LABELS[goal.value]}
                  </Text>
                  <Text className="text-sm text-muted mt-1">
                    {goal.description}
                  </Text>
                </View>
                {selectedGoal === goal.value && (
                  <View 
                    className="w-6 h-6 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white text-sm">✓</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background">
        <Pressable
          onPress={handleNext}
          disabled={!selectedGoal}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: selectedGoal ? colors.primary : colors.border,
            },
            pressed && selectedGoal && styles.buttonPressed,
          ]}
        >
          <Text 
            className="text-lg font-semibold"
            style={{ color: selectedGoal ? "#fff" : colors.muted }}
          >
            다음
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  goalCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
