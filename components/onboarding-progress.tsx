import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import { ONBOARDING_STEPS } from "@/types";

interface OnboardingProgressProps {
  currentStepId: string;
}

export function OnboardingProgress({ currentStepId }: OnboardingProgressProps) {
  const colors = useColors();
  const onboardingProgress = useAppStore((state) => state.onboardingProgress);
  
  const currentIndex = ONBOARDING_STEPS.findIndex(s => s.id === currentStepId);
  const totalSteps = ONBOARDING_STEPS.length;
  const completedCount = onboardingProgress?.completedSteps.length || 0;
  
  // Calculate progress percentage based on current step
  const progressPercentage = ((currentIndex + 1) / totalSteps) * 100;
  
  return (
    <View className="w-full px-4 pt-2 pb-4">
      {/* Step indicator text */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-muted">
          {currentIndex + 1} / {totalSteps}
        </Text>
        <Text className="text-sm text-muted">
          {Math.round(progressPercentage)}%
        </Text>
      </View>
      
      {/* Progress bar */}
      <View 
        className="h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: colors.border }}
      >
        <View 
          className="h-full rounded-full"
          style={[
            styles.progressFill,
            { 
              backgroundColor: colors.primary,
              width: `${progressPercentage}%`,
            }
          ]}
        />
      </View>
      
      {/* Step dots */}
      <View className="flex-row justify-between mt-3 px-1">
        {ONBOARDING_STEPS.map((step, index) => {
          const isCompleted = onboardingProgress?.completedSteps.includes(step.id);
          const isCurrent = step.id === currentStepId;
          
          return (
            <View 
              key={step.id}
              className="items-center"
            >
              <View 
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isCompleted 
                    ? colors.primary 
                    : isCurrent 
                      ? colors.primary 
                      : colors.border,
                  opacity: isCurrent ? 1 : isCompleted ? 0.8 : 0.4,
                }}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressFill: {
    // Animation handled by React Native Reanimated if needed
  },
});
