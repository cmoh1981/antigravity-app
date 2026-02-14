import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Platform } from "react-native";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate, generateId } from "@/store";
import { MealLog, MealTag, MEAL_TAG_LABELS } from "@/types";
import { getMealImage } from "@/data/images";
import * as Haptics from "expo-haptics";
import { AnimatedEntry } from "@/components/animated-entry";

const MEAL_TYPES = [
  { value: "breakfast" as const, label: "아침", emoji: "🌅", color: "#F59E0B" },
  { value: "lunch" as const, label: "점심", emoji: "☀️", color: "#EF6C00" },
  { value: "dinner" as const, label: "저녁", emoji: "🌙", color: "#7C3AED" },
  { value: "snack" as const, label: "간식", emoji: "🍪", color: "#EC4899" },
];

const MEAL_TAGS: { value: MealTag; label: string; emoji: string }[] = [
  { value: "high_protein", label: "고단백", emoji: "🥩" },
  { value: "high_carb", label: "고탄수", emoji: "🍚" },
  { value: "high_fat", label: "고지방", emoji: "🧈" },
  { value: "high_sodium", label: "짠 음식", emoji: "🧂" },
  { value: "low_veggie", label: "채소 부족", emoji: "🥬" },
  { value: "alcohol", label: "음주", emoji: "🍺" },
  { value: "dessert", label: "디저트", emoji: "🍰" },
];

export default function MealScreen() {
  const colors = useColors();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");
  const [selectedTags, setSelectedTags] = useState<MealTag[]>([]);

  const mealLogs = useAppStore((state) => state.mealLogs);
  const todayPlan = useAppStore((state) => state.todayPlan);
  const todayMeals = mealLogs.filter((m) => m.date === getTodayDate());

  const handleAddMeal = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAddModal(true);
  };

  const handleSaveMeal = () => {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const getMealTypeInfo = (type: string) => MEAL_TYPES.find((m) => m.value === type);

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted">
                {new Date().toLocaleDateString("ko-KR", { month: "long", day: "numeric", weekday: "short" })}
              </Text>
              <Text className="text-2xl font-bold text-foreground mt-1">식단 관리</Text>
            </View>
            <Pressable
              onPress={handleAddMeal}
              style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
            >
              <Text className="text-white font-semibold text-sm">+ 식사 기록</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Meal Summary */}
        <View className="px-5 mt-4">
          <View className="flex-row gap-2">
            {MEAL_TYPES.map((type) => {
              const logged = todayMeals.some((m) => m.mealType === type.value);
              return (
                <View key={type.value} className="flex-1 items-center py-3 rounded-2xl" style={{ backgroundColor: logged ? `${type.color}15` : colors.surface }}>
                  <Text className="text-xl mb-1">{type.emoji}</Text>
                  <Text className="text-xs font-medium" style={{ color: logged ? type.color : colors.muted }}>
                    {type.label}
                  </Text>
                  {logged && <View className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: type.color }} />}
                </View>
              );
            })}
          </View>
        </View>

        {/* Recommended Meals */}
        {todayPlan && (
          <View className="px-5 mt-6">
            <Text className="text-lg font-bold text-foreground mb-3">오늘의 추천 식단</Text>
            <View className="gap-3">
              {todayPlan.mealPlan.map((meal, i) => {
                const info = getMealTypeInfo(meal.mealType);
                return (
                  <AnimatedEntry delay={0} duration={300} key={i}>
                    <View className="rounded-2xl overflow-hidden" style={[styles.cardShadow, { backgroundColor: colors.surface }]}>
                      <View className="h-1" style={{ backgroundColor: info?.color || colors.primary }} />
                      <View className="flex-row p-4">
                        <View className="mr-3 rounded-xl overflow-hidden" style={{ backgroundColor: `${info?.color || colors.primary}10` }}>
                          <Image source={getMealImage(meal.mealType as "breakfast" | "lunch" | "dinner" | "snack")} style={{ width: 72, height: 72 }} contentFit="cover" />
                        </View>
                        <View className="flex-1 justify-center">
                          <View className="flex-row items-center mb-1">
                            <Text className="text-sm mr-1">{info?.emoji}</Text>
                            <Text className="text-sm font-semibold" style={{ color: info?.color }}>{info?.label}</Text>
                          </View>
                          <Text className="text-base font-medium text-foreground mb-1">{meal.suggestion}</Text>
                          <Text className="text-xs text-muted leading-relaxed">{meal.reason}</Text>
                        </View>
                      </View>
                    </View>
                  </AnimatedEntry>
                );
              })}
            </View>
          </View>
        )}

        {/* Today's Meal Log */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-bold text-foreground mb-3">오늘의 식사 기록</Text>
          {todayMeals.length === 0 ? (
            <View className="p-8 rounded-2xl items-center" style={{ backgroundColor: colors.surface }}>
              <View className="w-16 h-16 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${colors.primary}10` }}>
                <Text className="text-3xl">🍽️</Text>
              </View>
              <Text className="text-base font-medium text-foreground mb-1">아직 기록이 없어요</Text>
              <Text className="text-sm text-muted text-center">식사를 기록하면 영양 균형을{"\n"}분석해드려요</Text>
            </View>
          ) : (
            <View className="gap-3">
              {todayMeals.map((meal, i) => {
                const info = getMealTypeInfo(meal.mealType);
                return (
                  <AnimatedEntry delay={0} duration={250} key={meal.id}>
                    <View className="p-4 rounded-2xl" style={[styles.cardShadow, { backgroundColor: colors.surface }]}>
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: `${info?.color || colors.primary}15` }}>
                            <Text className="text-lg">{info?.emoji}</Text>
                          </View>
                          <View>
                            <Text className="text-base font-semibold text-foreground">{info?.label}</Text>
                            <Text className="text-xs text-muted">
                              {new Date(meal.createdAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {meal.tags.length > 0 && (
                        <View className="flex-row flex-wrap gap-1.5 mt-1">
                          {meal.tags.map((tag) => (
                            <View key={tag} className="px-2.5 py-1 rounded-full" style={{ backgroundColor: `${colors.primary}12` }}>
                              <Text className="text-xs" style={{ color: colors.primary }}>{MEAL_TAG_LABELS[tag]}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {meal.photoUri && (
                        <View className="mt-3 rounded-xl overflow-hidden">
                          <Image source={{ uri: meal.photoUri }} style={{ width: "100%", height: 160 }} contentFit="cover" />
                        </View>
                      )}
                    </View>
                  </AnimatedEntry>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Add Modal */}
      {showAddModal && (
        <View className="absolute inset-0 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.45)" }}>
          <Pressable className="flex-1" onPress={() => setShowAddModal(false)} />
          <AnimatedEntry delay={0} duration={250}>
            <View className="rounded-t-3xl pt-2 pb-8 px-6" style={{ backgroundColor: colors.background }}>
              {/* Handle bar */}
              <View className="w-10 h-1 rounded-full self-center mb-5" style={{ backgroundColor: colors.border }} />

              <Text className="text-xl font-bold text-foreground mb-5">식사 기록하기</Text>

              {/* Meal Type */}
              <Text className="text-sm font-semibold text-foreground mb-3">식사 종류</Text>
              <View className="flex-row gap-2 mb-6">
                {MEAL_TYPES.map((type) => {
                  const selected = selectedMealType === type.value;
                  return (
                    <Pressable
                      key={type.value}
                      onPress={() => {
                        if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedMealType(type.value);
                      }}
                      style={({ pressed }) => [
                        styles.mealTypeBtn,
                        { backgroundColor: selected ? type.color : colors.surface, borderColor: selected ? type.color : colors.border },
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      <Text className="text-lg mb-1">{type.emoji}</Text>
                      <Text className="text-xs font-medium" style={{ color: selected ? "#fff" : colors.foreground }}>{type.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Tags */}
              <Text className="text-sm font-semibold text-foreground mb-3">식사 특징</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {MEAL_TAGS.map((tag) => {
                  const selected = selectedTags.includes(tag.value);
                  return (
                    <Pressable
                      key={tag.value}
                      onPress={() => handleToggleTag(tag.value)}
                      style={({ pressed }) => [
                        styles.tagBtn,
                        { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
                        pressed && { opacity: 0.8 },
                      ]}
                    >
                      <Text className="text-sm mr-1">{tag.emoji}</Text>
                      <Text className="text-xs font-medium" style={{ color: selected ? "#fff" : colors.foreground }}>{tag.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Save */}
              <Pressable
                onPress={handleSaveMeal}
                style={({ pressed }) => [styles.saveBtn, { backgroundColor: colors.primary }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
              >
                <Text className="text-base font-bold text-white">저장하기</Text>
              </Pressable>
            </View>
          </AnimatedEntry>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  addBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  cardShadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  mealTypeBtn: { flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5, alignItems: "center" },
  tagBtn: { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 24, borderWidth: 1 },
  saveBtn: { paddingVertical: 16, borderRadius: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
});
