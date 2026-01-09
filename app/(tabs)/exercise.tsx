import { useState, useEffect } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate } from "@/store";
import { CATEGORY_LABELS, ExerciseSet } from "@/types";
import { getExerciseImage } from "@/data/images";
import { ExerciseDetailModal } from "@/components/exercise-detail-modal";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function ExerciseScreen() {
  const colors = useColors();
  const [currentPhase, setCurrentPhase] = useState<'warmup' | 'main' | 'cooldown'>('warmup');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseSet | null>(null);
  
  const todayPlan = useAppStore((state) => state.todayPlan);
  const todayCheckIn = useAppStore((state) => state.todayCheckIn);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  if (!todayPlan || !todayCheckIn) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 justify-center items-center">
          <Text className="text-4xl mb-4">🏃</Text>
          <Text className="text-xl font-bold text-foreground text-center mb-2">
            오늘의 운동 계획이 없어요
          </Text>
          <Text className="text-base text-muted text-center">
            홈에서 컨디션 체크를 완료하면{"\n"}맞춤 운동을 추천해드려요
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const { exercisePlan } = todayPlan;
  const { routine, categoryReason, safetyNotes, adjustments } = exercisePlan;

  const getCurrentExercises = (): ExerciseSet[] => {
    switch (currentPhase) {
      case 'warmup': return routine.warmup;
      case 'main': return routine.main;
      case 'cooldown': return routine.cooldown;
    }
  };

  const currentExercises = getCurrentExercises();
  const currentExercise = currentExercises[currentExerciseIndex];

  const handlePlayPause = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentExerciseIndex < currentExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      // Move to next phase
      if (currentPhase === 'warmup') {
        setCurrentPhase('main');
        setCurrentExerciseIndex(0);
      } else if (currentPhase === 'main') {
        setCurrentPhase('cooldown');
        setCurrentExerciseIndex(0);
      } else {
        // Workout complete
        if (Platform.OS !== "web") {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setIsPlaying(false);
      }
    }
    setTimer(0);
  };

  const handlePrev = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    } else {
      // Move to previous phase
      if (currentPhase === 'cooldown') {
        setCurrentPhase('main');
        setCurrentExerciseIndex(routine.main.length - 1);
      } else if (currentPhase === 'main') {
        setCurrentPhase('warmup');
        setCurrentExerciseIndex(routine.warmup.length - 1);
      }
    }
    setTimer(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseLabel = (phase: string): string => {
    switch (phase) {
      case 'warmup': return '워밍업';
      case 'main': return '본 운동';
      case 'cooldown': return '쿨다운';
      default: return '';
    }
  };

  const getTotalExercises = (): number => {
    return routine.warmup.length + routine.main.length + routine.cooldown.length;
  };

  const getCurrentOverallIndex = (): number => {
    let index = currentExerciseIndex;
    if (currentPhase === 'main') index += routine.warmup.length;
    if (currentPhase === 'cooldown') index += routine.warmup.length + routine.main.length;
    return index + 1;
  };

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 90, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-2">
          {/* Header */}
          <View className="mb-6">
            <View className="flex-row items-center mb-2">
              <View 
                className="px-3 py-1 rounded-full mr-2"
                style={{ backgroundColor: getCategoryColor(exercisePlan.category) }}
              >
                <Text className="text-xs text-white font-medium">
                  {CATEGORY_LABELS[exercisePlan.category]}
                </Text>
              </View>
              <Text className="text-sm text-muted">
                {routine.totalDuration}분
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {routine.name}
            </Text>
            <Text className="text-sm text-muted mt-1">
              {categoryReason}
            </Text>
          </View>

          {/* Safety Notes */}
          {(safetyNotes.length > 0 || adjustments.length > 0) && (
            <View 
              className="p-4 rounded-xl mb-6"
              style={{ backgroundColor: `${colors.warning}15` }}
            >
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.warning }}>
                ⚠️ 오늘의 주의사항
              </Text>
              {safetyNotes.map((note, i) => (
                <Text key={`note-${i}`} className="text-sm text-foreground mb-1">
                  • {note}
                </Text>
              ))}
              {adjustments.map((adj, i) => (
                <Text key={`adj-${i}`} className="text-sm text-foreground mb-1">
                  • {adj}
                </Text>
              ))}
            </View>
          )}

          {/* Progress */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm text-muted">
              {getCurrentOverallIndex()} / {getTotalExercises()}
            </Text>
            <View className="flex-row">
              {['warmup', 'main', 'cooldown'].map((phase) => (
                <View 
                  key={phase}
                  className="h-1 w-16 rounded-full mx-0.5"
                  style={{ 
                    backgroundColor: 
                      phase === currentPhase ? colors.primary :
                      (phase === 'warmup' && currentPhase !== 'warmup') ||
                      (phase === 'main' && currentPhase === 'cooldown') 
                        ? colors.success : colors.border
                  }}
                />
              ))}
            </View>
          </View>

          {/* Current Exercise Card */}
          <View 
            className="p-6 rounded-2xl mb-6"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-xs text-primary font-medium mb-2">
              {getPhaseLabel(currentPhase)} {currentExerciseIndex + 1}/{currentExercises.length}
            </Text>
            
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-2xl font-bold text-foreground flex-1">
                {currentExercise?.name}
              </Text>
              <Pressable
                onPress={() => {
                  if (Platform.OS !== 'web') {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedExercise(currentExercise);
                  setShowDetailModal(true);
                }}
                style={({ pressed }) => [
                  styles.infoButton,
                  { backgroundColor: `${colors.primary}20` },
                  pressed && { opacity: 0.7 }
                ]}
              >
                <Text style={{ color: colors.primary, fontSize: 16 }}>ℹ️</Text>
              </Pressable>
            </View>

            {/* Exercise Image */}
            {currentExercise && (
              <Pressable
                onPress={() => {
                  setSelectedExercise(currentExercise);
                  setShowDetailModal(true);
                }}
              >
                <View className="items-center my-4">
                  <Image
                    source={getExerciseImage(currentExercise.name)}
                    style={{ width: 200, height: 200, borderRadius: 16 }}
                    resizeMode="contain"
                  />
                  <Text className="text-xs text-primary mt-2">
                    탭하여 운동 상세 보기
                  </Text>
                </View>
              </Pressable>
            )}
            
            {currentExercise?.description && (
              <Text className="text-sm text-muted mb-4">
                {currentExercise.description}
              </Text>
            )}

            {/* Exercise Details */}
            <View className="flex-row justify-around py-4 border-t border-border">
              {currentExercise?.reps && (
                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">
                    {currentExercise.reps}
                  </Text>
                  <Text className="text-xs text-muted">회</Text>
                </View>
              )}
              {currentExercise?.sets && (
                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">
                    {currentExercise.sets}
                  </Text>
                  <Text className="text-xs text-muted">세트</Text>
                </View>
              )}
              {currentExercise?.duration && (
                <View className="items-center">
                  <Text className="text-2xl font-bold text-foreground">
                    {currentExercise.duration}
                  </Text>
                  <Text className="text-xs text-muted">초</Text>
                </View>
              )}
            </View>

            {/* Timer */}
            <View className="items-center py-4">
              <Text className="text-4xl font-bold text-foreground">
                {formatTime(timer)}
              </Text>
            </View>

            {/* Controls */}
            <View className="flex-row items-center justify-center gap-6">
              <Pressable
                onPress={handlePrev}
                style={({ pressed }) => [
                  styles.controlButton,
                  { backgroundColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text className="text-xl">⏮️</Text>
              </Pressable>
              
              <Pressable
                onPress={handlePlayPause}
                style={({ pressed }) => [
                  styles.playButton,
                  { backgroundColor: colors.primary },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text className="text-3xl">{isPlaying ? '⏸️' : '▶️'}</Text>
              </Pressable>
              
              <Pressable
                onPress={handleNext}
                style={({ pressed }) => [
                  styles.controlButton,
                  { backgroundColor: colors.border },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Text className="text-xl">⏭️</Text>
              </Pressable>
            </View>
          </View>

          {/* Exercise List */}
          <Text className="text-lg font-semibold text-foreground mb-4">
            전체 운동 목록
          </Text>
          
          {/* Warmup */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-muted mb-2">
              워밍업 ({routine.warmup.length}개)
            </Text>
            {routine.warmup.map((ex, i) => (
              <ExerciseListItem 
                key={`warmup-${i}`}
                exercise={ex}
                isActive={currentPhase === 'warmup' && currentExerciseIndex === i}
                isDone={currentPhase !== 'warmup' || currentExerciseIndex > i}
                colors={colors}
                onPress={() => {
                  setCurrentPhase('warmup');
                  setCurrentExerciseIndex(i);
                  setTimer(0);
                }}
              />
            ))}
          </View>

          {/* Main */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-muted mb-2">
              본 운동 ({routine.main.length}개)
            </Text>
            {routine.main.map((ex, i) => (
              <ExerciseListItem 
                key={`main-${i}`}
                exercise={ex}
                isActive={currentPhase === 'main' && currentExerciseIndex === i}
                isDone={currentPhase === 'cooldown' || (currentPhase === 'main' && currentExerciseIndex > i)}
                colors={colors}
                onPress={() => {
                  setCurrentPhase('main');
                  setCurrentExerciseIndex(i);
                  setTimer(0);
                }}
              />
            ))}
          </View>

          {/* Cooldown */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-muted mb-2">
              쿨다운 ({routine.cooldown.length}개)
            </Text>
            {routine.cooldown.map((ex, i) => (
              <ExerciseListItem 
                key={`cooldown-${i}`}
                exercise={ex}
                isActive={currentPhase === 'cooldown' && currentExerciseIndex === i}
                isDone={currentPhase === 'cooldown' && currentExerciseIndex > i}
                colors={colors}
                onPress={() => {
                  setCurrentPhase('cooldown');
                  setCurrentExerciseIndex(i);
                  setTimer(0);
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        visible={showDetailModal}
        exercise={selectedExercise}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedExercise(null);
        }}
      />
    </ScreenContainer>
  );
}

function ExerciseListItem({
  exercise,
  isActive,
  isDone,
  colors,
  onPress,
}: {
  exercise: ExerciseSet;
  isActive: boolean;
  isDone: boolean;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.exerciseItem,
        { 
          backgroundColor: isActive ? `${colors.primary}15` : colors.surface,
          borderColor: isActive ? colors.primary : colors.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View 
        className="w-6 h-6 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: isDone ? colors.success : colors.border }}
      >
        {isDone && <Text className="text-xs text-white">✓</Text>}
      </View>
      <View className="flex-1">
        <Text 
          className="text-sm font-medium"
          style={{ color: isDone ? colors.muted : colors.foreground }}
        >
          {exercise.name}
        </Text>
        <Text className="text-xs text-muted">
          {exercise.reps ? `${exercise.reps}회` : ''}
          {exercise.sets ? ` × ${exercise.sets}세트` : ''}
          {exercise.duration ? `${exercise.duration}초` : ''}
        </Text>
      </View>
    </Pressable>
  );
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'PH': '#9B59B6',
    'SO': '#F39C12',
    'MB': '#3498DB',
    'TF': '#1ABC9C',
  };
  return colors[category] || '#4A90D9';
}

const styles = StyleSheet.create({
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
