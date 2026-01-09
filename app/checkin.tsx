import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Switch } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate, generateId } from "@/store";
import { 
  MoodEmoji, 
  SleepQuality, 
  StressLevel, 
  DigestionStatus,
  PerceivedWeather,
  TemperatureFeel,
  AirQualityPerception,
  ActivityLocation,
} from "@/types";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const MOODS: { value: MoodEmoji; label: string }[] = [
  { value: "😄", label: "아주 좋아요" },
  { value: "🙂", label: "좋아요" },
  { value: "😐", label: "보통이에요" },
  { value: "😣", label: "힘들어요" },
  { value: "😤", label: "스트레스" },
];

const SLEEP_QUALITIES: { value: SleepQuality; label: string }[] = [
  { value: "good", label: "잘 잤어요" },
  { value: "fair", label: "보통이에요" },
  { value: "poor", label: "못 잤어요" },
];

const STRESS_LEVELS: { value: StressLevel; label: string }[] = [
  { value: "low", label: "낮음" },
  { value: "medium", label: "보통" },
  { value: "high", label: "높음" },
];

const DIGESTION_STATUS: { value: DigestionStatus; label: string }[] = [
  { value: "normal", label: "정상" },
  { value: "bloated", label: "더부룩" },
  { value: "constipation", label: "변비" },
  { value: "diarrhea", label: "설사" },
];

const WEATHER_OPTIONS: { value: PerceivedWeather; emoji: string; label: string }[] = [
  { value: "sunny", emoji: "☀️", label: "맑음" },
  { value: "cloudy", emoji: "☁️", label: "흐림" },
  { value: "rainy", emoji: "🌧️", label: "비" },
];

const TEMP_OPTIONS: { value: TemperatureFeel; label: string }[] = [
  { value: "cold", label: "추워요" },
  { value: "cool", label: "시원해요" },
  { value: "warm", label: "따뜻해요" },
  { value: "hot", label: "더워요" },
];

const AIR_OPTIONS: { value: AirQualityPerception; label: string }[] = [
  { value: "fresh", label: "상쾌해요" },
  { value: "normal", label: "보통이에요" },
  { value: "stuffy", label: "답답해요" },
];

const LOCATION_OPTIONS: { value: ActivityLocation; label: string }[] = [
  { value: "indoor", label: "실내만" },
  { value: "outdoor", label: "실외만" },
  { value: "both", label: "둘 다 가능" },
];

export default function CheckInScreen() {
  const colors = useColors();
  const [step, setStep] = useState(1);
  
  // Step 1: Mood & Sleep
  const [mood, setMood] = useState<MoodEmoji | null>(null);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(null);
  
  // Step 2: Stress & Digestion
  const [stress, setStress] = useState<StressLevel>("medium" as StressLevel);
  const [digestion, setDigestion] = useState<DigestionStatus>("normal" as DigestionStatus);
  
  // Step 3: Environment
  const [weather, setWeather] = useState<PerceivedWeather>("sunny" as PerceivedWeather);
  const [temperature, setTemperature] = useState<TemperatureFeel>("warm" as TemperatureFeel);
  const [airQuality, setAirQuality] = useState<AirQualityPerception>("normal" as AirQualityPerception);
  const [location, setLocation] = useState<ActivityLocation>("both" as ActivityLocation);

  const canProceed = () => {
    if (step === 1) return mood !== null && sleepQuality !== null;
    return true;
  };

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save check-in
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    useAppStore.getState().setTodayCheckIn({
      id: generateId(),
      date: getTodayDate(),
      mood: mood!,
      sleepQuality: sleepQuality!,
      stress,
      digestion,
      environment: {
        perceivedWeather: weather,
        temperatureFeel: temperature,
        airQuality,
        activityLocation: location,
      },
      createdAt: new Date().toISOString(),
    });
    
    router.replace("/(tabs)");
  };

  const renderStep1 = () => (
    <View className="gap-6">
      {/* Mood Selection */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          오늘 기분이 어떠세요?
        </Text>
        <View className="flex-row justify-between">
          {MOODS.map((m) => (
            <Pressable
              key={m.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setMood(m.value);
              }}
              style={({ pressed }) => [
                styles.moodButton,
                {
                  backgroundColor: mood === m.value ? colors.primary : colors.surface,
                  borderColor: mood === m.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text className="text-3xl mb-1">{m.value}</Text>
              <Text 
                className="text-xs"
                style={{ color: mood === m.value ? "#fff" : colors.muted }}
              >
                {m.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Sleep Quality */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          어젯밤 수면은 어땠나요?
        </Text>
        <View className="flex-row gap-3">
          {SLEEP_QUALITIES.map((s) => (
            <Pressable
              key={s.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setSleepQuality(s.value);
              }}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: sleepQuality === s.value ? colors.primary : colors.surface,
                  borderColor: sleepQuality === s.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: sleepQuality === s.value ? "#fff" : colors.foreground }}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View className="gap-6">
      {/* Stress Level */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          스트레스 수준은 어떤가요?
        </Text>
        <View className="flex-row gap-3">
          {STRESS_LEVELS.map((s) => (
            <Pressable
              key={s.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setStress(s.value);
              }}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: stress === s.value ? colors.primary : colors.surface,
                  borderColor: stress === s.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: stress === s.value ? "#fff" : colors.foreground }}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Digestion */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          소화 상태는 어떤가요?
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {DIGESTION_STATUS.map((d) => (
            <Pressable
              key={d.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setDigestion(d.value);
              }}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: digestion === d.value ? colors.primary : colors.surface,
                  borderColor: digestion === d.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: digestion === d.value ? "#fff" : colors.foreground }}
              >
                {d.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View className="gap-6">
      {/* Weather */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          오늘 날씨는 어떤가요?
        </Text>
        <View className="flex-row gap-3">
          {WEATHER_OPTIONS.map((w) => (
            <Pressable
              key={w.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setWeather(w.value);
              }}
              style={({ pressed }) => [
                styles.weatherButton,
                {
                  backgroundColor: weather === w.value ? colors.primary : colors.surface,
                  borderColor: weather === w.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text className="text-2xl mb-1">{w.emoji}</Text>
              <Text 
                className="text-sm"
                style={{ color: weather === w.value ? "#fff" : colors.foreground }}
              >
                {w.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Temperature */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          체감 온도는요?
        </Text>
        <View className="flex-row flex-wrap gap-3">
          {TEMP_OPTIONS.map((t) => (
            <Pressable
              key={t.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setTemperature(t.value);
              }}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: temperature === t.value ? colors.primary : colors.surface,
                  borderColor: temperature === t.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: temperature === t.value ? "#fff" : colors.foreground }}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Air Quality */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          공기는 어떤가요?
        </Text>
        <View className="flex-row gap-3">
          {AIR_OPTIONS.map((a) => (
            <Pressable
              key={a.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setAirQuality(a.value);
              }}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: airQuality === a.value ? colors.primary : colors.surface,
                  borderColor: airQuality === a.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: airQuality === a.value ? "#fff" : colors.foreground }}
              >
                {a.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Activity Location */}
      <View>
        <Text className="text-lg font-semibold text-foreground mb-4">
          오늘 운동 가능한 장소는?
        </Text>
        <View className="flex-row gap-3">
          {LOCATION_OPTIONS.map((l) => (
            <Pressable
              key={l.value}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setLocation(l.value);
              }}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: location === l.value ? colors.primary : colors.surface,
                  borderColor: location === l.value ? colors.primary : colors.border,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text 
                className="text-sm font-medium"
                style={{ color: location === l.value ? "#fff" : colors.foreground }}
              >
                {l.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-12">
          {/* Header */}
          <Pressable onPress={handleBack} className="mb-4">
            <Text className="text-primary text-base">
              {step > 1 ? "← 이전" : "← 취소"}
            </Text>
          </Pressable>

          {/* Progress */}
          <View className="flex-row mb-8">
            <View 
              className="flex-1 h-1 rounded-full mr-1"
              style={{ backgroundColor: step >= 1 ? colors.primary : colors.border }}
            />
            <View 
              className="flex-1 h-1 rounded-full mr-1"
              style={{ backgroundColor: step >= 2 ? colors.primary : colors.border }}
            />
            <View 
              className="flex-1 h-1 rounded-full"
              style={{ backgroundColor: step >= 3 ? colors.primary : colors.border }}
            />
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-foreground mb-2">
            {step === 1 && "오늘의 컨디션"}
            {step === 2 && "몸 상태 체크"}
            {step === 3 && "환경 체크"}
          </Text>
          <Text className="text-base text-muted mb-8">
            {step === 1 && "오늘 기분과 수면 상태를 알려주세요"}
            {step === 2 && "스트레스와 소화 상태를 체크해요"}
            {step === 3 && "오늘의 날씨와 운동 환경을 알려주세요"}
          </Text>

          {/* Content */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background">
        <Pressable
          onPress={handleNext}
          disabled={!canProceed()}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: canProceed() ? colors.primary : colors.border,
            },
            pressed && canProceed() && styles.buttonPressed,
          ]}
        >
          <Text 
            className="text-lg font-semibold"
            style={{ color: canProceed() ? "#fff" : colors.muted }}
          >
            {step === 3 ? "완료" : "다음"}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  moodButton: {
    width: 60,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  optionButton: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  weatherButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
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
