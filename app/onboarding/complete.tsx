import { useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withDelay,
} from "react-native-reanimated";

export default function CompleteScreen() {
  const colors = useColors();
  const userProfile = useAppStore((state) => state.userProfile);
  
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12 });
    opacity.value = withDelay(300, withSpring(1));
    
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleStart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    // Mark onboarding as complete
    useAppStore.getState().setOnboarded(true);
    if (userProfile) {
      useAppStore.getState().updateUserProfile({ onboardingCompleted: true });
    }
    
    // Navigate to main app
    router.replace("/(tabs)");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 justify-center items-center px-6">
        {/* Success Icon */}
        <Animated.View style={animatedIconStyle}>
          <View 
            className="w-32 h-32 rounded-full items-center justify-center mb-8"
            style={{ backgroundColor: `${colors.success}20` }}
          >
            <Text className="text-6xl">🎉</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={animatedTextStyle}>
          <Text className="text-2xl font-bold text-foreground text-center mb-3">
            준비가 완료되었어요!
          </Text>
          <Text className="text-base text-muted text-center mb-8 leading-relaxed">
            이제 매일 맞춤 건강 추천을 받아보세요.{"\n"}
            오늘의 컨디션을 체크하면 시작됩니다!
          </Text>
        </Animated.View>

        {/* Summary Card */}
        <Animated.View 
          style={[animatedTextStyle, { width: "100%", maxWidth: 320 }]}
        >
          <View 
            className="p-5 rounded-2xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-base font-semibold text-foreground mb-4">
              설정된 정보
            </Text>
            
            {userProfile && (
              <View className="gap-3">
                <SummaryItem 
                  label="목표" 
                  value={getGoalLabel(userProfile.goal)} 
                  colors={colors}
                />
                <SummaryItem 
                  label="키/체중" 
                  value={`${userProfile.inBody.height}cm / ${userProfile.inBody.weight}kg`} 
                  colors={colors}
                />
                <SummaryItem 
                  label="건강 상태" 
                  value={userProfile.diseases.length > 0 ? `${userProfile.diseases.length}개 선택` : "해당 없음"} 
                  colors={colors}
                />
                <SummaryItem 
                  label="수면 패턴" 
                  value={userProfile.sleepProfile.usualBedtime ? "설정됨" : "미설정"} 
                  colors={colors}
                />
              </View>
            )}
          </View>
        </Animated.View>

        {/* Start Button */}
        <Animated.View 
          style={[animatedTextStyle, { width: "100%", maxWidth: 320, marginTop: 32 }]}
        >
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary },
              pressed && styles.buttonPressed,
            ]}
          >
            <Text className="text-lg font-semibold text-white">
              시작하기
            </Text>
          </Pressable>
        </Animated.View>

        {/* Edit Note */}
        <Animated.View style={animatedTextStyle}>
          <Text className="text-xs text-muted text-center mt-4">
            설정은 언제든 변경할 수 있어요
          </Text>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}

function SummaryItem({ 
  label, 
  value, 
  colors 
}: { 
  label: string; 
  value: string; 
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-sm text-muted">{label}</Text>
      <Text className="text-sm font-medium text-foreground">{value}</Text>
    </View>
  );
}

function getGoalLabel(goal: string): string {
  const labels: Record<string, string> = {
    weight_management: "체중 관리",
    diet: "다이어트",
    muscle_gain: "근육 증가",
    weight_gain: "체중 증가",
    stress_relief: "스트레스 해소",
  };
  return labels[goal] || goal;
}

const styles = StyleSheet.create({
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
