import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate, generateId } from "@/store";
import {
  MoodEmoji, SleepQuality, StressLevel, DigestionStatus,
  PerceivedWeather, TemperatureFeel, AirQualityPerception, ActivityLocation,
} from "@/types";
import * as Haptics from "expo-haptics";
import { AnimatedEntry } from "@/components/animated-entry";

const MOODS: { value: MoodEmoji; label: string }[] = [
  { value: "😄", label: "아주 좋아요" },
  { value: "🙂", label: "좋아요" },
  { value: "😐", label: "보통이에요" },
  { value: "😣", label: "힘들어요" },
  { value: "😤", label: "스트레스" },
];
const SLEEP_QUALITIES: { value: SleepQuality; label: string; emoji: string }[] = [
  { value: "good", label: "잘 잤어요", emoji: "🌙" },
  { value: "fair", label: "보통이에요", emoji: "😴" },
  { value: "poor", label: "못 잤어요", emoji: "😵" },
];
const STRESS_LEVELS: { value: StressLevel; label: string; emoji: string }[] = [
  { value: "low", label: "낮음", emoji: "😌" },
  { value: "medium", label: "보통", emoji: "😐" },
  { value: "high", label: "높음", emoji: "😰" },
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
const TEMP_OPTIONS: { value: TemperatureFeel; emoji: string; label: string }[] = [
  { value: "cold", emoji: "🥶", label: "추워요" },
  { value: "cool", emoji: "🌬️", label: "시원해요" },
  { value: "warm", emoji: "🌤️", label: "따뜻해요" },
  { value: "hot", emoji: "🥵", label: "더워요" },
];
const AIR_OPTIONS: { value: AirQualityPerception; emoji: string; label: string }[] = [
  { value: "fresh", emoji: "🍃", label: "상쾌해요" },
  { value: "normal", emoji: "🌫️", label: "보통이에요" },
  { value: "stuffy", emoji: "😷", label: "답답해요" },
];
const LOCATION_OPTIONS: { value: ActivityLocation; emoji: string; label: string }[] = [
  { value: "indoor", emoji: "🏠", label: "실내만" },
  { value: "outdoor", emoji: "🌳", label: "실외만" },
  { value: "both", emoji: "🔄", label: "둘 다 가능" },
];

const STEP_INFO = [
  { title: "오늘의 컨디션", subtitle: "기분과 수면 상태를 알려주세요", emoji: "💭" },
  { title: "몸 상태 체크", subtitle: "스트레스와 소화 상태를 체크해요", emoji: "🩺" },
  { title: "환경 체크", subtitle: "날씨와 운동 환경을 알려주세요", emoji: "🌍" },
];

export default function CheckInScreen() {
  const colors = useColors();
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<MoodEmoji | null>(null);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(null);
  const [stress, setStress] = useState<StressLevel>("medium" as StressLevel);
  const [digestion, setDigestion] = useState<DigestionStatus>("normal" as DigestionStatus);
  const [weather, setWeather] = useState<PerceivedWeather>("sunny" as PerceivedWeather);
  const [temperature, setTemperature] = useState<TemperatureFeel>("warm" as TemperatureFeel);
  const [airQuality, setAirQuality] = useState<AirQualityPerception>("normal" as AirQualityPerception);
  const [location, setLocation] = useState<ActivityLocation>("both" as ActivityLocation);

  const tap = () => { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); };
  const canProceed = () => step === 1 ? mood !== null && sleepQuality !== null : true;

  const handleNext = () => {
    tap();
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };
  const handleBack = () => { step > 1 ? setStep(step - 1) : router.back(); };

  const handleSubmit = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    useAppStore.getState().setTodayCheckIn({
      id: generateId(), date: getTodayDate(), mood: mood!, sleepQuality: sleepQuality!,
      stress, digestion, environment: { perceivedWeather: weather, temperatureFeel: temperature, airQuality, activityLocation: location },
      createdAt: new Date().toISOString(),
    });
    router.replace("/(tabs)");
  };

  const Chip = ({ selected, label, onPress, emoji }: { selected: boolean; label: string; onPress: () => void; emoji?: string }) => (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
      ]}
    >
      {emoji && <Text className="text-base mr-1.5">{emoji}</Text>}
      <Text className="text-sm font-semibold" style={{ color: selected ? "#fff" : colors.foreground }}>{label}</Text>
    </Pressable>
  );

  const SectionTitle = ({ text }: { text: string }) => (
    <Text className="text-base font-bold text-foreground mb-3">{text}</Text>
  );

  const info = STEP_INFO[step - 1];

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6">
          {/* Nav */}
          <Pressable onPress={handleBack} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
            <Text className="text-primary text-base font-medium">{step > 1 ? "← 이전" : "← 취소"}</Text>
          </Pressable>

          {/* Progress */}
          <View className="flex-row mt-4 mb-6 gap-2">
            {[1, 2, 3].map((s) => (
              <View key={s} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                <View className="h-full rounded-full" style={{ width: step >= s ? "100%" : "0%", backgroundColor: colors.primary }} />
              </View>
            ))}
          </View>

          {/* Step Header */}
          <AnimatedEntry delay={0} duration={300} className="mb-6">
            <View className="flex-row items-center mb-1">
              <Text className="text-2xl mr-2">{info.emoji}</Text>
              <Text className="text-2xl font-bold text-foreground">{info.title}</Text>
            </View>
            <Text className="text-sm text-muted ml-10">{info.subtitle}</Text>
          </AnimatedEntry>

          {/* Step Content */}
          {step === 1 && (
            <AnimatedEntry delay={100} duration={300} className="gap-6">
              <View>
                <SectionTitle text="오늘 기분이 어떠세요?" />
                <View className="flex-row justify-between">
                  {MOODS.map((m) => (
                    <Pressable
                      key={m.value}
                      onPress={() => { tap(); setMood(m.value); }}
                      style={({ pressed }) => [
                        styles.moodBtn,
                        { backgroundColor: mood === m.value ? colors.primary : colors.surface, borderColor: mood === m.value ? colors.primary : colors.border },
                        pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
                      ]}
                    >
                      <Text className="text-3xl mb-1">{m.value}</Text>
                      <Text className="text-xs font-medium" style={{ color: mood === m.value ? "#fff" : colors.muted }}>{m.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
              <View>
                <SectionTitle text="어젯밤 수면은 어땠나요?" />
                <View className="flex-row gap-3">
                  {SLEEP_QUALITIES.map((s) => <Chip key={s.value} selected={sleepQuality === s.value} label={s.label} emoji={s.emoji} onPress={() => setSleepQuality(s.value)} />)}
                </View>
              </View>
            </AnimatedEntry>
          )}

          {step === 2 && (
            <AnimatedEntry delay={100} duration={300} className="gap-6">
              <View>
                <SectionTitle text="스트레스 수준은?" />
                <View className="flex-row gap-3">
                  {STRESS_LEVELS.map((s) => <Chip key={s.value} selected={stress === s.value} label={s.label} emoji={s.emoji} onPress={() => setStress(s.value)} />)}
                </View>
              </View>
              <View>
                <SectionTitle text="소화 상태는?" />
                <View className="flex-row flex-wrap gap-3">
                  {DIGESTION_STATUS.map((d) => <Chip key={d.value} selected={digestion === d.value} label={d.label} onPress={() => setDigestion(d.value)} />)}
                </View>
              </View>
            </AnimatedEntry>
          )}

          {step === 3 && (
            <AnimatedEntry delay={100} duration={300} className="gap-6">
              <View>
                <SectionTitle text="오늘 날씨는?" />
                <View className="flex-row gap-3">
                  {WEATHER_OPTIONS.map((w) => <Chip key={w.value} selected={weather === w.value} label={w.label} emoji={w.emoji} onPress={() => setWeather(w.value)} />)}
                </View>
              </View>
              <View>
                <SectionTitle text="체감 온도는?" />
                <View className="flex-row flex-wrap gap-3">
                  {TEMP_OPTIONS.map((t) => <Chip key={t.value} selected={temperature === t.value} label={t.label} emoji={t.emoji} onPress={() => setTemperature(t.value)} />)}
                </View>
              </View>
              <View>
                <SectionTitle text="공기는 어떤가요?" />
                <View className="flex-row gap-3">
                  {AIR_OPTIONS.map((a) => <Chip key={a.value} selected={airQuality === a.value} label={a.label} emoji={a.emoji} onPress={() => setAirQuality(a.value)} />)}
                </View>
              </View>
              <View>
                <SectionTitle text="운동 가능한 장소는?" />
                <View className="flex-row gap-3">
                  {LOCATION_OPTIONS.map((l) => <Chip key={l.value} selected={location === l.value} label={l.label} emoji={l.emoji} onPress={() => setLocation(l.value)} />)}
                </View>
              </View>
            </AnimatedEntry>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4" style={{ backgroundColor: colors.background }}>
        <Pressable
          onPress={handleNext}
          disabled={!canProceed()}
          style={({ pressed }) => [
            styles.ctaBtn,
            { backgroundColor: canProceed() ? colors.primary : colors.border },
            pressed && canProceed() && { opacity: 0.92, transform: [{ scale: 0.98 }] },
          ]}
        >
          <Text className="text-lg font-bold" style={{ color: canProceed() ? "#fff" : colors.muted }}>
            {step === 3 ? "완료 ✓" : "다음"}
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  moodBtn: { width: 62, height: 82, borderRadius: 16, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  chip: { flex: 1, minWidth: 80, flexDirection: "row", paddingVertical: 13, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  ctaBtn: {
    paddingVertical: 16, borderRadius: 16, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
});
