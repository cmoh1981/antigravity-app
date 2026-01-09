import { useEffect } from "react";
import { Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Image } from "expo-image";
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
        {/* Logo with Success Animation */}
        <Animated.View style={animatedIconStyle}>
          <View className="w-24 h-24 rounded-2xl overflow-hidden mb-4 shadow-lg">
            <Image
              source={require("@/assets/images/icon.png")}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        </Animated.View>

        {/* Success Badge */}
        <Animated.View style={animatedIconStyle}>
          <View 
            className="px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: `${colors.success}20` }}
          >
            <Text className="text-success font-semibold">✓ 설정 완료</Text>
          </View>
        </Animated.View>

        {/* Title */}
        <Animated.View style={animatedTextStyle}>
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            오늘건강과 함께할 준비 완료!
          </Text>
          <Text className="text-base text-muted text-center mb-6 leading-relaxed">
            오늘 하루, 건강하게 시작해볼까요?{"\n"}
            매일 컨디션 체크로 맞춤 추천을 받아보세요.
          </Text>
        </Animated.View>

        {/* Summary Card */}
        <Animated.View 
          style={[animatedTextStyle, { width: "100%", maxWidth: 320 }]}
        >
          <View 
            className="p-5 rounded-2xl border border-border"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-base font-semibold text-foreground mb-4">
              나의 건강 프로필
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
                  value={userProfile.diseases.length > 0 ? `${userProfile.diseases.length}개 관리 중` : "해당 없음"} 
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
          style={[animatedTextStyle, { width: "100%", maxWidth: 320, marginTop: 24 }]}
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
              오늘건강 시작하기
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
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
