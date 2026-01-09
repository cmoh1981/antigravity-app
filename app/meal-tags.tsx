import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate } from "@/store";
import { MealLog, MealType, FoodTag } from "@/types";
import * as Haptics from "expo-haptics";

// Food tag options with Korean labels
const FOOD_TAG_OPTIONS: { value: FoodTag; label: string; emoji: string }[] = [
  { value: "protein", label: "단백질", emoji: "🥩" },
  { value: "carbs", label: "탄수화물", emoji: "🍚" },
  { value: "vegetables", label: "채소", emoji: "🥗" },
  { value: "fruits", label: "과일", emoji: "🍎" },
  { value: "dairy", label: "유제품", emoji: "🥛" },
  { value: "grains", label: "곡물", emoji: "🌾" },
  { value: "seafood", label: "해산물", emoji: "🐟" },
  { value: "soup", label: "국/찌개", emoji: "🍲" },
  { value: "fried", label: "튀김류", emoji: "🍟" },
  { value: "spicy", label: "매운 음식", emoji: "🌶️" },
  { value: "sweet", label: "단 음식", emoji: "🍰" },
  { value: "caffeine", label: "카페인", emoji: "☕" },
  { value: "alcohol", label: "주류", emoji: "🍺" },
  { value: "processed", label: "가공식품", emoji: "🥫" },
];

// Portion size options
const PORTION_OPTIONS: { value: "small" | "medium" | "large"; label: string }[] = [
  { value: "small", label: "적게" },
  { value: "medium", label: "보통" },
  { value: "large", label: "많이" },
];

export default function MealTagsScreen() {
  const colors = useColors();
  const params = useLocalSearchParams<{ imageUri?: string; mealType?: string }>();
  const imageUri = params.imageUri || "";
  const mealType = (params.mealType as MealType) || "lunch";

  const [selectedTags, setSelectedTags] = useState<FoodTag[]>([]);
  const [portionSize, setPortionSize] = useState<"small" | "medium" | "large">("medium");
  const [notes, setNotes] = useState("");

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    snack: "간식",
  };

  const toggleTag = (tag: FoodTag) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePortionSelect = (size: "small" | "medium" | "large") => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPortionSize(size);
  };

  const handleSave = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const mealLog: MealLog = {
      id: `meal_${Date.now()}`,
      date: getTodayDate(),
      mealType,
      photoUri: imageUri,
      tags: selectedTags,
      portionSize,
      notes: notes || undefined,
      createdAt: new Date().toISOString(),
    };

    useAppStore.getState().addMealLog(mealLog);

    // Navigate back to meal tab
    router.replace("/(tabs)/meal");
  };

  const handleCancel = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.back();
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Pressable
            onPress={handleCancel}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Text className="text-primary font-medium">취소</Text>
          </Pressable>
          <Text className="text-lg font-bold text-foreground">
            {mealTypeLabels[mealType]} 기록
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Photo Preview */}
        <View className="px-6 mb-6">
          <View 
            className="w-full aspect-square rounded-2xl overflow-hidden"
            style={{ backgroundColor: colors.surface }}
          >
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-4xl mb-2">📷</Text>
                <Text className="text-muted">사진 없음</Text>
              </View>
            )}
          </View>
        </View>

        {/* Portion Size */}
        <View className="px-6 mb-6">
          <Text className="text-base font-semibold text-foreground mb-3">
            식사량
          </Text>
          <View className="flex-row gap-3">
            {PORTION_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => handlePortionSelect(option.value)}
                style={({ pressed }) => [
                  styles.portionButton,
                  { 
                    backgroundColor: portionSize === option.value 
                      ? colors.primary 
                      : colors.surface,
                    borderColor: portionSize === option.value 
                      ? colors.primary 
                      : colors.border,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text 
                  className="font-medium"
                  style={{ 
                    color: portionSize === option.value 
                      ? "white" 
                      : colors.foreground 
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Food Tags */}
        <View className="px-6 mb-6">
          <Text className="text-base font-semibold text-foreground mb-3">
            음식 태그 (선택)
          </Text>
          <Text className="text-sm text-muted mb-4">
            먹은 음식의 종류를 선택해주세요
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {FOOD_TAG_OPTIONS.map((option) => {
              const isSelected = selectedTags.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  onPress={() => toggleTag(option.value)}
                  style={({ pressed }) => [
                    styles.tagButton,
                    { 
                      backgroundColor: isSelected 
                        ? `${colors.primary}15` 
                        : colors.surface,
                      borderColor: isSelected 
                        ? colors.primary 
                        : colors.border,
                    },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text className="mr-1">{option.emoji}</Text>
                  <Text 
                    className="text-sm"
                    style={{ 
                      color: isSelected 
                        ? colors.primary 
                        : colors.foreground 
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Selected Tags Summary */}
        {selectedTags.length > 0 && (
          <View className="px-6 mb-6">
            <View 
              className="p-4 rounded-xl"
              style={{ backgroundColor: `${colors.success}10` }}
            >
              <Text className="text-sm text-success font-medium mb-1">
                선택된 태그 ({selectedTags.length}개)
              </Text>
              <Text className="text-sm text-foreground">
                {selectedTags.map(tag => {
                  const option = FOOD_TAG_OPTIONS.find(o => o.value === tag);
                  return option ? `${option.emoji} ${option.label}` : tag;
                }).join(", ")}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Save Button */}
      <View 
        className="absolute left-0 right-0 px-6 pb-6"
        style={{ bottom: 0, backgroundColor: colors.background }}
      >
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text className="text-white text-lg font-semibold">
            식사 기록 저장
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  portionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  tagButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
