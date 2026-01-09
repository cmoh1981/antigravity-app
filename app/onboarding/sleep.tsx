import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Switch } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const BEDTIMES = [
  "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", 
  "00:00", "00:30", "01:00", "01:30", "02:00"
];

const WAKEUPS = [
  "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
  "08:00", "08:30", "09:00", "09:30", "10:00"
];

export default function SleepScreen() {
  const colors = useColors();
  const [bedtime, setBedtime] = useState<string | null>(null);
  const [wakeup, setWakeup] = useState<string | null>(null);
  const [isShiftWorker, setIsShiftWorker] = useState(false);

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    useAppStore.getState().updateSleepProfile({
      usualBedtime: bedtime || undefined,
      usualWakeup: wakeup || undefined,
      isShiftWorker,
    });
    
    router.push("/onboarding/medication");
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/onboarding/medication");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
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
            <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
            <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
            <View className="flex-1 h-1 bg-border rounded-full mr-1" />
            <View className="flex-1 h-1 bg-border rounded-full" />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-foreground mb-2">
            수면 패턴을 알려주세요
          </Text>
          <Text className="text-base text-muted mb-8">
            맞춤 수면 추천을 위해 필요해요 (선택)
          </Text>

          {/* Bedtime Selection */}
          <Text className="text-base font-semibold text-foreground mb-3">
            보통 몇 시에 주무시나요?
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            <View className="flex-row gap-2">
              {BEDTIMES.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setBedtime(time === bedtime ? null : time);
                  }}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: bedtime === time ? colors.primary : colors.surface,
                      borderColor: bedtime === time ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text 
                    className="text-sm"
                    style={{ color: bedtime === time ? "#fff" : colors.foreground }}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Wakeup Selection */}
          <Text className="text-base font-semibold text-foreground mb-3">
            보통 몇 시에 일어나시나요?
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            <View className="flex-row gap-2">
              {WAKEUPS.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => {
                    if (Platform.OS !== "web") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setWakeup(time === wakeup ? null : time);
                  }}
                  style={[
                    styles.timeChip,
                    {
                      backgroundColor: wakeup === time ? colors.primary : colors.surface,
                      borderColor: wakeup === time ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text 
                    className="text-sm"
                    style={{ color: wakeup === time ? "#fff" : colors.foreground }}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Shift Worker Toggle */}
          <View 
            className="flex-row items-center justify-between p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-1 mr-4">
              <Text className="text-base font-medium text-foreground">
                교대 근무를 하시나요?
              </Text>
              <Text className="text-sm text-muted mt-1">
                불규칙한 수면 패턴을 고려해 추천해드려요
              </Text>
            </View>
            <Switch
              value={isShiftWorker}
              onValueChange={(value) => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setIsShiftWorker(value);
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          {/* Info Box */}
          <View 
            className="mt-6 p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm text-muted leading-relaxed">
              😴 수면 정보는 적절한 취침 시간과 수면 시간을 추천하는 데 사용됩니다.
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
            다음
          </Text>
        </Pressable>
        <Pressable
          onPress={handleSkip}
          className="mt-3"
          style={({ pressed }) => [
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text className="text-base text-muted text-center">
            나중에 설정할게요
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
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
