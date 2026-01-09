import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, FlatList } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate, generateId } from "@/store";
import { MealLog, MealTag, MEAL_TAG_LABELS } from "@/types";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const MEAL_TYPES = [
  { value: 'breakfast' as const, label: '아침', emoji: '🌅' },
  { value: 'lunch' as const, label: '점심', emoji: '☀️' },
  { value: 'dinner' as const, label: '저녁', emoji: '🌙' },
  { value: 'snack' as const, label: '간식', emoji: '🍪' },
];

const MEAL_TAGS: { value: MealTag; label: string; emoji: string }[] = [
  { value: 'high_protein', label: '고단백', emoji: '🥩' },
  { value: 'high_carb', label: '고탄수', emoji: '🍚' },
  { value: 'high_fat', label: '고지방', emoji: '🧈' },
  { value: 'high_sodium', label: '짠 음식', emoji: '🧂' },
  { value: 'low_veggie', label: '채소 부족', emoji: '🥬' },
  { value: 'alcohol', label: '음주', emoji: '🍺' },
  { value: 'dessert', label: '디저트', emoji: '🍰' },
];

export default function MealScreen() {
  const colors = useColors();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [selectedTags, setSelectedTags] = useState<MealTag[]>([]);
  
  const mealLogs = useAppStore((state) => state.mealLogs);
  const todayPlan = useAppStore((state) => state.todayPlan);
  
  const todayMeals = mealLogs.filter(m => m.date === getTodayDate());

  const handleAddMeal = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    setShowAddModal(true);
  };

  const handleSaveMeal = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    const newMeal: MealLog = {
      id: generateId(),
      date: getTodayDate(),
      mealType: selectedMealType,
      tags: selectedTags,
      confirmedByUser: true,
      createdAt: new Date().toISOString(),
    };
    
    useAppStore.getState().addMealLog(newMeal);
    setShowAddModal(false);
    setSelectedTags([]);
  };

  const handleToggleTag = (tag: MealTag) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const renderMealPlan = () => {
    if (!todayPlan) return null;
    
    return (
      <View className="mb-6">
        <Text className="text-lg font-semibold text-foreground mb-4">
          오늘의 추천 식단
        </Text>
        <View className="gap-3">
          {todayPlan.mealPlan.map((meal, i) => (
            <View 
              key={i}
              className="p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center mb-2">
                <Text className="text-xl mr-2">
                  {meal.mealType === 'breakfast' ? '🌅' : 
                   meal.mealType === 'lunch' ? '☀️' : '🌙'}
                </Text>
                <Text className="text-base font-medium text-foreground">
                  {meal.mealType === 'breakfast' ? '아침' : 
                   meal.mealType === 'lunch' ? '점심' : '저녁'}
                </Text>
              </View>
              <Text className="text-sm text-foreground mb-2">
                {meal.suggestion}
              </Text>
              <Text className="text-xs text-muted">
                {meal.reason}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderTodayMeals = () => {
    if (todayMeals.length === 0) {
      return (
        <View 
          className="p-6 rounded-xl items-center"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-4xl mb-3">🍽️</Text>
          <Text className="text-base text-muted text-center">
            오늘 기록한 식사가 없어요{"\n"}
            식사를 기록해보세요!
          </Text>
        </View>
      );
    }

    return (
      <View className="gap-3">
        {todayMeals.map((meal) => (
          <View 
            key={meal.id}
            className="p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center">
                <Text className="text-xl mr-2">
                  {MEAL_TYPES.find(m => m.value === meal.mealType)?.emoji}
                </Text>
                <Text className="text-base font-medium text-foreground">
                  {MEAL_TYPES.find(m => m.value === meal.mealType)?.label}
                </Text>
              </View>
              <Text className="text-xs text-muted">
                {new Date(meal.createdAt).toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
            {meal.tags.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {meal.tags.map(tag => (
                  <View 
                    key={tag}
                    className="px-2 py-1 rounded-full"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Text className="text-xs text-primary">
                      {MEAL_TAG_LABELS[tag]}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderAddModal = () => {
    if (!showAddModal) return null;

    return (
      <View 
        className="absolute inset-0 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <Pressable 
          className="flex-1" 
          onPress={() => setShowAddModal(false)} 
        />
        <View 
          className="rounded-t-3xl p-6"
          style={{ backgroundColor: colors.background }}
        >
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-xl font-bold text-foreground">
              식사 기록하기
            </Text>
            <Pressable onPress={() => setShowAddModal(false)}>
              <Text className="text-primary text-base">취소</Text>
            </Pressable>
          </View>

          {/* Meal Type Selection */}
          <Text className="text-sm font-medium text-foreground mb-3">
            식사 종류
          </Text>
          <View className="flex-row gap-2 mb-6">
            {MEAL_TYPES.map(type => (
              <Pressable
                key={type.value}
                onPress={() => {
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                  setSelectedMealType(type.value);
                }}
                style={[
                  styles.mealTypeButton,
                  {
                    backgroundColor: selectedMealType === type.value ? colors.primary : colors.surface,
                    borderColor: selectedMealType === type.value ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text className="text-lg mb-1">{type.emoji}</Text>
                <Text 
                  className="text-xs"
                  style={{ color: selectedMealType === type.value ? '#fff' : colors.foreground }}
                >
                  {type.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Tags Selection */}
          <Text className="text-sm font-medium text-foreground mb-3">
            식사 특징 (선택)
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {MEAL_TAGS.map(tag => (
              <Pressable
                key={tag.value}
                onPress={() => handleToggleTag(tag.value)}
                style={[
                  styles.tagButton,
                  {
                    backgroundColor: selectedTags.includes(tag.value) ? colors.primary : colors.surface,
                    borderColor: selectedTags.includes(tag.value) ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text className="text-sm mr-1">{tag.emoji}</Text>
                <Text 
                  className="text-xs"
                  style={{ color: selectedTags.includes(tag.value) ? '#fff' : colors.foreground }}
                >
                  {tag.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSaveMeal}
            style={({ pressed }) => [
              styles.saveButton,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text className="text-lg font-semibold text-white">
              저장하기
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-sm text-muted">
              {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
            </Text>
            <Text className="text-2xl font-bold text-foreground">
              식단 관리
            </Text>
          </View>
          <Pressable
            onPress={handleAddMeal}
            style={({ pressed }) => [
              styles.addButton,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text className="text-white font-semibold">+ 기록</Text>
          </Pressable>
        </View>

        {/* Meal Plan */}
        {renderMealPlan()}

        {/* Today's Meals */}
        <Text className="text-lg font-semibold text-foreground mb-4">
          오늘의 식사 기록
        </Text>
        {renderTodayMeals()}
      </ScrollView>

      {/* Add Modal */}
      {renderAddModal()}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mealTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  tagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
