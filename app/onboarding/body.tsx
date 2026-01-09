import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";

export default function BodyScreen() {
  const colors = useColors();
  const userProfile = useAppStore((state) => state.userProfile);
  
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [muscleMass, setMuscleMass] = useState("");
  const [fatMass, setFatMass] = useState("");
  const [bodyFatPercent, setBodyFatPercent] = useState("");
  const [waist, setWaist] = useState("");

  const isValid = height.length > 0 && weight.length > 0;

  const handleNext = () => {
    if (!isValid) return;
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    useAppStore.getState().updateInBody({
      height: parseFloat(height) || 0,
      weight: parseFloat(weight) || 0,
      muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
      fatMass: fatMass ? parseFloat(fatMass) : undefined,
      bodyFatPercent: bodyFatPercent ? parseFloat(bodyFatPercent) : undefined,
      waist: waist ? parseFloat(waist) : undefined,
    });
    
    router.push("/onboarding/diseases");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-12">
            {/* Back Button */}
            <Pressable onPress={handleBack} className="mb-4">
              <Text className="text-primary text-base">← 이전</Text>
            </Pressable>

            {/* Progress */}
            <View className="flex-row mb-8">
              <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
              <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
              <View className="flex-1 h-1 bg-border rounded-full mr-1" />
              <View className="flex-1 h-1 bg-border rounded-full mr-1" />
              <View className="flex-1 h-1 bg-border rounded-full mr-1" />
              <View className="flex-1 h-1 bg-border rounded-full" />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-foreground mb-2">
              신체 정보를 입력해주세요
            </Text>
            <Text className="text-base text-muted mb-8">
              맞춤 추천을 위해 필요해요
            </Text>

            {/* Required Fields */}
            <Text className="text-sm font-semibold text-foreground mb-3">
              필수 정보
            </Text>
            
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">키 (cm)</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="170"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }]}
                  placeholderTextColor={colors.muted}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">체중 (kg)</Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="65"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }]}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            {/* Optional Fields */}
            <Text className="text-sm font-semibold text-foreground mb-1">
              선택 정보
            </Text>
            <Text className="text-xs text-muted mb-3">
              인바디 결과가 있다면 입력해주세요
            </Text>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">근육량 (kg)</Text>
                <TextInput
                  value={muscleMass}
                  onChangeText={setMuscleMass}
                  placeholder="선택"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }]}
                  placeholderTextColor={colors.muted}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">지방량 (kg)</Text>
                <TextInput
                  value={fatMass}
                  onChangeText={setFatMass}
                  placeholder="선택"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }]}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">체지방률 (%)</Text>
                <TextInput
                  value={bodyFatPercent}
                  onChangeText={setBodyFatPercent}
                  placeholder="선택"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }]}
                  placeholderTextColor={colors.muted}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-muted mb-2">허리둘레 (cm)</Text>
                <TextInput
                  value={waist}
                  onChangeText={setWaist}
                  placeholder="선택"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  style={[styles.input, { 
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.foreground,
                  }]}
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>

            {/* Info Box */}
            <View 
              className="mt-6 p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted leading-relaxed">
                💡 선택 정보는 나중에 설정에서 추가하거나 수정할 수 있어요.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-background">
          <Pressable
            onPress={handleNext}
            disabled={!isValid}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: isValid ? colors.primary : colors.border,
              },
              pressed && isValid && styles.buttonPressed,
            ]}
          >
            <Text 
              className="text-lg font-semibold"
              style={{ color: isValid ? "#fff" : colors.muted }}
            >
              다음
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
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
