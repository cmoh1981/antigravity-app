import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { OnboardingProgress } from "@/components/onboarding-progress";

export default function MedicationScreen() {
  const colors = useColors();
  const completeOnboardingStep = useAppStore((state) => state.completeOnboardingStep);

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    completeOnboardingStep('medication');
    router.push("/onboarding/premium");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      {/* Progress Bar */}
      <OnboardingProgress currentStepId="medication" />
      
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-4">
          {/* Back Button */}
          <Pressable onPress={handleBack} className="mb-4">
            <Text className="text-primary text-base">← 이전</Text>
          </Pressable>

          {/* Title */}
          <Text className="text-2xl font-bold text-foreground mb-2">
            복용 중인 약이 있나요?
          </Text>
          <Text className="text-base text-muted mb-8">
            운동 추천 시 약물 주의사항을 반영해드려요
          </Text>

          {/* Illustration */}
          <View className="items-center mb-8">
            <View 
              className="w-32 h-32 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-6xl">💊</Text>
            </View>
          </View>

          {/* Info Cards */}
          <View 
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-2">🔍</Text>
              <Text className="text-base font-semibold text-foreground">
                약 이름으로 검색
              </Text>
            </View>
            <Text className="text-sm text-muted">
              복용 중인 약 이름을 검색해서 추가할 수 있어요
            </Text>
          </View>

          <View 
            className="p-4 rounded-xl mb-4"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center mb-2">
              <Text className="text-xl mr-2">📷</Text>
              <Text className="text-base font-semibold text-foreground">
                카메라로 촬영
              </Text>
            </View>
            <Text className="text-sm text-muted">
              약 라벨을 촬영하면 자동으로 인식해요 (추후 지원)
            </Text>
          </View>

          {/* Safety Notice */}
          <View 
            className="p-4 rounded-xl"
            style={{ backgroundColor: `${colors.warning}15` }}
          >
            <Text className="text-sm text-foreground leading-relaxed">
              ⚠️ <Text className="font-semibold">중요 안내</Text>{"\n\n"}
              이 앱은 약 복용에 대한 조언을 제공하지 않습니다.{"\n"}
              약 복용의 시작, 중단, 변경은 반드시 담당 의사나 약사와 상담하세요.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background">
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text className="text-lg font-semibold text-white">
            나중에 추가할게요
          </Text>
        </Pressable>
        <Text className="text-xs text-muted text-center mt-3">
          설정에서 언제든 약을 추가할 수 있어요
        </Text>
      </View>
    </ScreenContainer>
  );
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
