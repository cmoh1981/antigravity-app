import { Text, View, Pressable, StyleSheet, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useEffect } from "react";
import { OnboardingProgress } from "@/components/onboarding-progress";
import { AnimatedEntry } from "@/components/animated-entry";

const FEATURES = [
  { emoji: "🏃", title: "맞춤형 운동", desc: "36가지 루틴 중 최적 추천" },
  { emoji: "🥗", title: "건강한 식단", desc: "목표와 환경에 맞는 식단" },
  { emoji: "😴", title: "수면 가이드", desc: "최적의 취침 시간 안내" },
  { emoji: "💊", title: "약물 안전", desc: "복용약 고려한 운동 조절" },
];

export default function WelcomeScreen() {
  const colors = useColors();
  const startOnboarding = useAppStore((state) => state.startOnboarding);
  const completeOnboardingStep = useAppStore((state) => state.completeOnboardingStep);

  useEffect(() => { startOnboarding(); }, [startOnboarding]);

  const handleStart = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    completeOnboardingStep("welcome");
    router.push("/onboarding/goal");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <OnboardingProgress currentStepId="welcome" />

      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <AnimatedEntry delay={100} duration={500} style={styles.logoShadow}>
          <View className="w-24 h-24 rounded-3xl overflow-hidden">
            <Image source={require("@/assets/images/icon.png")} style={{ width: "100%", height: "100%" }} contentFit="cover" />
          </View>
        </AnimatedEntry>

        {/* Title */}
        <AnimatedEntry delay={250} duration={400} className="items-center mt-5 mb-6">
          <Text className="text-3xl font-bold text-foreground text-center">오늘건강</Text>
          <Text className="text-base text-primary font-semibold text-center mt-1">오늘 하루, 건강하게</Text>
          <Text className="text-sm text-muted text-center mt-1">당신만을 위한 맞춤 건강 코치</Text>
        </AnimatedEntry>

        {/* Feature Grid */}
        <AnimatedEntry delay={400} duration={400} className="w-full max-w-sm">
          <View className="flex-row flex-wrap gap-3">
            {FEATURES.map((f, i) => (
              <AnimatedEntry delay={0} duration={350}
                key={f.title}
                className="rounded-2xl p-4"
                style={[styles.featureCard, { backgroundColor: colors.surface, width: "47.5%" }]}
              >
                <Text className="text-2xl mb-2">{f.emoji}</Text>
                <Text className="text-sm font-bold text-foreground">{f.title}</Text>
                <Text className="text-xs text-muted mt-0.5">{f.desc}</Text>
              </AnimatedEntry>
            ))}
          </View>
        </AnimatedEntry>

        {/* CTA */}
        <AnimatedEntry direction="up" delay={800} duration={400} className="w-full max-w-sm mt-8">
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.92, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text className="text-white text-lg font-bold">시작하기</Text>
          </Pressable>
          <Text className="text-xs text-muted text-center mt-4 leading-relaxed">
            이 앱은 의료 기기가 아니며, 진단이나 치료를 제공하지 않습니다.
          </Text>
        </AnimatedEntry>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  logoShadow: { shadowColor: "#F5A623", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 },
  featureCard: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  button: {
    paddingVertical: 16, borderRadius: 16, alignItems: "center",
    shadowColor: "#F5A623", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
});
