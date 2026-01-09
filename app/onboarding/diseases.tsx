import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import { Disease, DISEASE_LABELS } from "@/types";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { OnboardingProgress } from "@/components/onboarding-progress";

const DISEASES: { value: Disease; emoji: string }[] = [
  { value: "diabetes", emoji: "🩸" },
  { value: "obesity", emoji: "⚖️" },
  { value: "hypertension", emoji: "❤️" },
  { value: "hyperlipidemia", emoji: "🫀" },
  { value: "heart_failure", emoji: "💔" },
  { value: "osteoporosis", emoji: "🦴" },
  { value: "hyperthyroidism", emoji: "🔥" },
  { value: "hypothyroidism", emoji: "❄️" },
];

export default function DiseasesScreen() {
  const colors = useColors();
  const userProfile = useAppStore((state) => state.userProfile);
  const completeOnboardingStep = useAppStore((state) => state.completeOnboardingStep);
  const [selectedDiseases, setSelectedDiseases] = useState<Disease[]>([]);

  const handleToggle = (disease: Disease) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedDiseases((prev) =>
      prev.includes(disease)
        ? prev.filter((d) => d !== disease)
        : [...prev, disease]
    );
  };

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    useAppStore.getState().updateDiseases(selectedDiseases);
    completeOnboardingStep('diseases');
    router.push("/onboarding/sleep");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      {/* Progress Bar */}
      <OnboardingProgress currentStepId="diseases" />
      
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
            건강 상태를 알려주세요
          </Text>
          <Text className="text-base text-muted mb-2">
            해당되는 항목을 모두 선택해주세요
          </Text>
          <Text className="text-sm text-muted mb-8">
            선택하지 않아도 괜찮아요
          </Text>

          {/* Disease Options */}
          <View className="flex-row flex-wrap gap-3">
            {DISEASES.map((disease) => {
              const isSelected = selectedDiseases.includes(disease.value);
              return (
                <Pressable
                  key={disease.value}
                  onPress={() => handleToggle(disease.value)}
                  style={({ pressed }) => [
                    styles.diseaseCard,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text className="text-xl mb-1">{disease.emoji}</Text>
                  <Text 
                    className="text-sm font-medium"
                    style={{ color: isSelected ? "#fff" : colors.foreground }}
                  >
                    {DISEASE_LABELS[disease.value]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Info Box */}
          <View 
            className="mt-8 p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm text-muted leading-relaxed">
              ⚠️ 이 정보는 운동 추천 시 안전을 위해 사용됩니다.{"\n"}
              의료 진단이나 치료 목적으로 사용되지 않습니다.
            </Text>
          </View>

          {/* Selected Count */}
          {selectedDiseases.length > 0 && (
            <Text className="text-sm text-primary mt-4">
              {selectedDiseases.length}개 선택됨
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
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
            {selectedDiseases.length === 0 ? "해당 없음" : "다음"}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  diseaseCard: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
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
