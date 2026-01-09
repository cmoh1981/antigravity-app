import { Text, View, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function WelcomeScreen() {
  const colors = useColors();

  const handleStart = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/onboarding/goal");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo Area */}
        <View className="w-32 h-32 rounded-full bg-primary items-center justify-center mb-8">
          <Text className="text-6xl">🌟</Text>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-foreground text-center mb-3">
          Antigravity
        </Text>
        <Text className="text-lg text-muted text-center mb-2">
          당신만을 위한 건강 코치
        </Text>

        {/* Description */}
        <View className="bg-surface rounded-2xl p-6 mb-8 w-full max-w-sm">
          <Text className="text-base text-foreground leading-relaxed text-center">
            날씨, 컨디션, 목표에 맞춰{"\n"}
            <Text className="font-semibold text-primary">운동</Text>,{" "}
            <Text className="font-semibold text-primary">식단</Text>,{" "}
            <Text className="font-semibold text-primary">수면</Text>을{"\n"}
            매일 맞춤 추천해드려요.
          </Text>
        </View>

        {/* Features */}
        <View className="w-full max-w-sm mb-8">
          <FeatureItem emoji="🏃" text="맞춤형 운동 루틴" />
          <FeatureItem emoji="🥗" text="건강한 식단 추천" />
          <FeatureItem emoji="😴" text="수면 가이드" />
          <FeatureItem emoji="💊" text="복용약 관리" />
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
        <Text className="text-xs text-muted text-center mt-6 px-4">
          이 앱은 의료 기기가 아니며, 진단이나 치료를 제공하지 않습니다.{"\n"}
          건강 문제는 전문 의료진과 상담하세요.
        </Text>
      </View>
    </ScreenContainer>
  );
}

function FeatureItem({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View className="flex-row items-center py-2">
      <Text className="text-2xl mr-3">{emoji}</Text>
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
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
