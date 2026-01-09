import { Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { Image } from "expo-image";
import { useEffect } from "react";
import { OnboardingProgress } from "@/components/onboarding-progress";

export default function WelcomeScreen() {
  const colors = useColors();
  const startOnboarding = useAppStore((state) => state.startOnboarding);
  const completeOnboardingStep = useAppStore((state) => state.completeOnboardingStep);

  // Start onboarding tracking when this screen mounts
  useEffect(() => {
    startOnboarding();
  }, [startOnboarding]);

  const handleStart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    completeOnboardingStep('welcome');
    router.push("/onboarding/goal");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      {/* Progress Bar */}
      <OnboardingProgress currentStepId="welcome" />
      
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <View className="w-28 h-28 rounded-3xl overflow-hidden mb-6 shadow-lg">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>

        {/* App Name */}
        <Text className="text-4xl font-bold text-foreground text-center mb-2">
          오늘건강
        </Text>
        
        {/* Slogan */}
        <Text className="text-lg text-primary font-medium text-center mb-1">
          오늘 하루, 건강하게
        </Text>
        <Text className="text-base text-muted text-center mb-6">
          당신만을 위한 맞춤 건강 코치
        </Text>

        {/* Description Card */}
        <View className="bg-surface rounded-2xl p-5 mb-6 w-full max-w-sm border border-border">
          <Text className="text-base text-foreground leading-relaxed text-center">
            날씨, 컨디션, 목표에 맞춰{"\n"}
            <Text className="font-semibold text-primary">운동</Text>,{" "}
            <Text className="font-semibold text-primary">식단</Text>,{" "}
            <Text className="font-semibold text-primary">수면</Text>을{"\n"}
            매일 맞춤 추천해드려요.
          </Text>
        </View>

        {/* Features */}
        <View className="w-full max-w-sm mb-6">
          <FeatureItem emoji="🏃" text="맞춤형 운동 루틴" colors={colors} />
          <FeatureItem emoji="🥗" text="건강한 식단 추천" colors={colors} />
          <FeatureItem emoji="😴" text="수면 가이드" colors={colors} />
          <FeatureItem emoji="💊" text="복용약 안전 관리" colors={colors} />
        </View>

        {/* Start Button */}
        <Pressable
          onPress={handleStart}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text className="text-white text-lg font-semibold">시작하기</Text>
        </Pressable>

        {/* Disclaimer */}
        <Text className="text-xs text-muted text-center mt-5 px-4 leading-relaxed">
          이 앱은 의료 기기가 아니며, 진단이나 치료를 제공하지 않습니다.{"\n"}
          건강 문제는 전문 의료진과 상담하세요.
        </Text>
      </View>
    </ScreenContainer>
  );
}

function FeatureItem({ 
  emoji, 
  text, 
  colors 
}: { 
  emoji: string; 
  text: string;
  colors: { surface: string; border: string };
}) {
  return (
    <View 
      className="flex-row items-center py-2.5 px-4 mb-2 rounded-xl"
      style={{ backgroundColor: colors.surface }}
    >
      <Text className="text-xl mr-3">{emoji}</Text>
      <Text className="text-base text-foreground">{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    maxWidth: 320,
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
