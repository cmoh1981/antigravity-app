import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Platform } from "react-native";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate } from "@/store";
import { CATEGORY_LABELS, ExerciseSet } from "@/types";
import { getExerciseImage } from "@/data/images";
import * as Haptics from "expo-haptics";
import { AnimatedEntry } from "@/components/animated-entry";

const CATEGORY_ICONS: Record<string, string> = {
  PH: "🏠", SO: "☀️", MB: "🧠", TF: "🌡️",
};

const CATEGORY_COLORS: Record<string, string> = {
  PH: "#8B5CF6", SO: "#F59E0B", MB: "#3B82F6", TF: "#10B981",
};

export default function ExerciseScreen() {
  const colors = useColors();
  const [currentPhase, setCurrentPhase] = useState<"warmup" | "main" | "cooldown">("warmup");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const todayPlan = useAppStore((state) => state.todayPlan);
  const todayCheckIn = useAppStore((state) => state.todayCheckIn);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying]);

  if (!todayPlan || !todayCheckIn) {
    return (
      <ScreenContainer>
        <View className="flex-1 justify-center items-center px-6">
          <AnimatedEntry delay={0} duration={400} className="items-center">
            <View className="w-24 h-24 rounded-3xl items-center justify-center mb-6" style={{ backgroundColor: `${colors.primary}12` }}>
              <Text className="text-5xl">🏃</Text>
            </View>
            <Text className="text-2xl font-bold text-foreground text-center mb-3">
              오늘의 운동 계획이 없어요
            </Text>
            <Text className="text-base text-muted text-center leading-relaxed">
              홈에서 컨디션 체크를 완료하면{"\n"}맞춤 운동을 추천해드려요
            </Text>
          </AnimatedEntry>
        </View>
      </ScreenContainer>
    );
  }

  const { exercisePlan } = todayPlan;
  const { routine, categoryReason, safetyNotes, adjustments } = exercisePlan;
  const catColor = CATEGORY_COLORS[exercisePlan.category] || colors.primary;

  const getCurrentExercises = (): ExerciseSet[] => {
    switch (currentPhase) {
      case "warmup": return routine.warmup;
      case "main": return routine.main;
      case "cooldown": return routine.cooldown;
    }
  };

  const currentExercises = getCurrentExercises();
  const currentExercise = currentExercises[currentExerciseIndex];

  const markComplete = () => {
    if (currentExercise) {
      setCompletedExercises((prev) => new Set(prev).add(`${currentPhase}-${currentExerciseIndex}`));
    }
  };

  const handlePlayPause = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    markComplete();
    if (currentExerciseIndex < currentExercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      if (currentPhase === "warmup") { setCurrentPhase("main"); setCurrentExerciseIndex(0); }
      else if (currentPhase === "main") { setCurrentPhase("cooldown"); setCurrentExerciseIndex(0); }
      else {
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsPlaying(false);
      }
    }
    setTimer(0);
  };

  const handlePrev = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex((prev) => prev - 1);
    } else {
      if (currentPhase === "cooldown") { setCurrentPhase("main"); setCurrentExerciseIndex(routine.main.length - 1); }
      else if (currentPhase === "main") { setCurrentPhase("warmup"); setCurrentExerciseIndex(routine.warmup.length - 1); }
    }
    setTimer(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPhaseLabel = (phase: string): string => {
    switch (phase) { case "warmup": return "워밍업"; case "main": return "본 운동"; case "cooldown": return "쿨다운"; default: return ""; }
  };

  const getTotalExercises = () => routine.warmup.length + routine.main.length + routine.cooldown.length;
  const getCurrentOverallIndex = () => {
    let idx = currentExerciseIndex;
    if (currentPhase === "main") idx += routine.warmup.length;
    if (currentPhase === "cooldown") idx += routine.warmup.length + routine.main.length;
    return idx + 1;
  };

  const progressPercent = (getCurrentOverallIndex() / getTotalExercises()) * 100;

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header with category color accent */}
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-2xl items-center justify-center mr-3" style={{ backgroundColor: `${catColor}18` }}>
              <Text className="text-2xl">{CATEGORY_ICONS[exercisePlan.category] || "🏃"}</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <View className="px-2.5 py-1 rounded-full" style={{ backgroundColor: catColor }}>
                  <Text className="text-xs text-white font-semibold">{CATEGORY_LABELS[exercisePlan.category]}</Text>
                </View>
                <Text className="text-sm text-muted">{routine.totalDuration}분</Text>
              </View>
              <Text className="text-xl font-bold text-foreground mt-1">{routine.name}</Text>
            </View>
          </View>
          <Text className="text-sm text-muted leading-relaxed">{categoryReason}</Text>
        </View>

        {/* Overall Progress Bar */}
        <View className="mx-5 mt-3 mb-2">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-xs text-muted font-medium">{getPhaseLabel(currentPhase)} · {currentExerciseIndex + 1}/{currentExercises.length}</Text>
            <Text className="text-xs text-muted">{getCurrentOverallIndex()}/{getTotalExercises()}</Text>
          </View>
          <View className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
            <View className="h-full rounded-full" style={{ width: `${progressPercent}%`, backgroundColor: catColor }} />
          </View>
          {/* Phase indicators */}
          <View className="flex-row mt-2 gap-1.5">
            {(["warmup", "main", "cooldown"] as const).map((phase) => {
              const isActive = phase === currentPhase;
              const isDone = (phase === "warmup" && currentPhase !== "warmup") || (phase === "main" && currentPhase === "cooldown");
              return (
                <Pressable
                  key={phase}
                  onPress={() => { setCurrentPhase(phase); setCurrentExerciseIndex(0); setTimer(0); }}
                  style={({ pressed }) => [
                    { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: isActive ? `${catColor}18` : isDone ? `${colors.success}12` : colors.surface, borderWidth: isActive ? 1.5 : 0.5, borderColor: isActive ? catColor : colors.border },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text className="text-xs font-medium" style={{ color: isActive ? catColor : isDone ? colors.success : colors.muted }}>
                    {isDone ? "✓ " : ""}{getPhaseLabel(phase)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Safety Notes */}
        {(safetyNotes.length > 0 || adjustments.length > 0) && (
          <AnimatedEntry delay={0} duration={300}>
            <View className="mx-5 mt-3 p-4 rounded-2xl" style={{ backgroundColor: `${colors.warning}10` }}>
              <Text className="text-sm font-semibold mb-1.5" style={{ color: colors.warning }}>⚠️ 오늘의 주의사항</Text>
              {safetyNotes.map((note, i) => (
                <Text key={`n-${i}`} className="text-xs text-foreground leading-relaxed">• {note}</Text>
              ))}
              {adjustments.map((adj, i) => (
                <Text key={`a-${i}`} className="text-xs text-foreground leading-relaxed">• {adj}</Text>
              ))}
            </View>
          </AnimatedEntry>
        )}

        {/* Current Exercise Card */}
        <AnimatedEntry delay={0} duration={300}>
          <View className="mx-5 mt-4 rounded-2xl overflow-hidden" style={[styles.cardShadow, { backgroundColor: colors.surface }]}>
            <View className="h-1.5" style={{ backgroundColor: catColor }} />
            <View className="p-5">
              {/* Exercise Name */}
              <Text className="text-2xl font-bold text-foreground mb-1">{currentExercise?.name}</Text>
              {currentExercise?.description && (
                <Text className="text-sm text-muted mb-4 leading-relaxed">{currentExercise.description}</Text>
              )}

              {/* Exercise Image */}
              {currentExercise && (
                <View className="items-center my-3 rounded-2xl overflow-hidden" style={{ backgroundColor: `${catColor}08` }}>
                  <Image
                    source={getExerciseImage(currentExercise.name)}
                    style={{ width: 220, height: 220 }}
                    contentFit="contain"
                  />
                </View>
              )}

              {/* Exercise Metrics */}
              <View className="flex-row justify-around py-4 mt-2 rounded-xl" style={{ backgroundColor: colors.background }}>
                {currentExercise?.reps && (
                  <View className="items-center">
                    <Text className="text-3xl font-bold text-foreground">{currentExercise.reps}</Text>
                    <Text className="text-xs text-muted mt-1">회</Text>
                  </View>
                )}
                {currentExercise?.sets && (
                  <View className="items-center">
                    <Text className="text-3xl font-bold text-foreground">{currentExercise.sets}</Text>
                    <Text className="text-xs text-muted mt-1">세트</Text>
                  </View>
                )}
                {currentExercise?.duration && (
                  <View className="items-center">
                    <Text className="text-3xl font-bold text-foreground">{currentExercise.duration}</Text>
                    <Text className="text-xs text-muted mt-1">초</Text>
                  </View>
                )}
              </View>

              {/* Timer */}
              <View className="items-center py-5">
                <Text className="text-5xl font-bold text-foreground tracking-wider">{formatTime(timer)}</Text>
              </View>

              {/* Controls */}
              <View className="flex-row items-center justify-center gap-5">
                <Pressable onPress={handlePrev} style={({ pressed }) => [styles.controlBtn, { backgroundColor: colors.background }, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}>
                  <Text className="text-lg">⏮️</Text>
                </Pressable>
                <Pressable onPress={handlePlayPause} style={({ pressed }) => [styles.playBtn, { backgroundColor: catColor }, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}>
                  <Text className="text-3xl">{isPlaying ? "⏸️" : "▶️"}</Text>
                </Pressable>
                <Pressable onPress={handleNext} style={({ pressed }) => [styles.controlBtn, { backgroundColor: colors.background }, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}>
                  <Text className="text-lg">⏭️</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </AnimatedEntry>

        {/* Exercise List */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-bold text-foreground mb-4">전체 운동 목록</Text>

          {(["warmup", "main", "cooldown"] as const).map((phase) => {
            const exercises = phase === "warmup" ? routine.warmup : phase === "main" ? routine.main : routine.cooldown;
            return (
              <View key={phase} className="mb-5">
                <Text className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  {getPhaseLabel(phase)} · {exercises.length}개
                </Text>
                {exercises.map((ex, i) => {
                  const key = `${phase}-${i}`;
                  const isActive = currentPhase === phase && currentExerciseIndex === i;
                  const isDone = completedExercises.has(key);
                  return (
                    <Pressable
                      key={key}
                      onPress={() => { setCurrentPhase(phase); setCurrentExerciseIndex(i); setTimer(0); }}
                      style={({ pressed }) => [
                        styles.listItem,
                        { backgroundColor: isActive ? `${catColor}10` : colors.surface, borderColor: isActive ? catColor : "transparent", borderWidth: isActive ? 1.5 : 0 },
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      <View className="w-7 h-7 rounded-full items-center justify-center mr-3" style={{ backgroundColor: isDone ? colors.success : isActive ? catColor : colors.border }}>
                        {isDone ? <Text className="text-xs text-white font-bold">✓</Text> : <Text className="text-xs text-white font-bold">{i + 1}</Text>}
                      </View>
                      <View className="flex-1">
                        <Text className="text-sm font-medium" style={{ color: isDone ? colors.muted : colors.foreground }}>{ex.name}</Text>
                        <Text className="text-xs text-muted">
                          {ex.reps ? `${ex.reps}회` : ""}{ex.sets ? ` × ${ex.sets}세트` : ""}{ex.duration ? `${ex.duration}초` : ""}
                        </Text>
                      </View>
                      {isActive && <View className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />}
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  cardShadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  controlBtn: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  playBtn: { width: 76, height: 76, borderRadius: 38, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 4 },
  listItem: { flexDirection: "row", alignItems: "center", padding: 14, borderRadius: 14, marginBottom: 6 },
});
