import { useMemo } from "react";
import { Text, View, ScrollView, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate } from "@/store";
import { GOAL_LABELS } from "@/types";
import { AnimatedEntry } from "@/components/animated-entry";

const TAG_EMOJIS: Record<string, string> = {
  high_protein: "🥩", high_carb: "🍚", high_fat: "🧈", high_sodium: "🧂",
  low_veggie: "🥬", alcohol: "🍺", dessert: "🍰",
};
const TAG_LABELS: Record<string, string> = {
  high_protein: "고단백", high_carb: "고탄수", high_fat: "고지방", high_sodium: "짠 음식",
  low_veggie: "채소 부족", alcohol: "음주", dessert: "디저트",
};
const TAG_COLORS: Record<string, string> = {
  high_protein: "#EF4444", high_carb: "#F59E0B", high_fat: "#8B5CF6", high_sodium: "#6B7280",
  low_veggie: "#22C55E", alcohol: "#3B82F6", dessert: "#EC4899",
};

export default function ReportScreen() {
  const colors = useColors();
  const userProfile = useAppStore((state) => state.userProfile);
  const mealLogs = useAppStore((state) => state.mealLogs);
  const medications = useAppStore((state) => state.medications);

  const stats = useMemo(() => {
    const today = new Date();
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split("T")[0]);
    }
    const mealsPerDay = last7Days.map((date) => mealLogs.filter((m) => m.date === date).length);
    const totalMeals = mealsPerDay.reduce((a, b) => a + b, 0);
    const tagCounts: Record<string, number> = {};
    mealLogs.forEach((meal) => meal.tags.forEach((tag) => { tagCounts[tag] = (tagCounts[tag] || 0) + 1; }));
    const streak = (() => {
      let count = 0;
      for (let i = last7Days.length - 1; i >= 0; i--) {
        if (mealsPerDay[i] > 0) count++;
        else break;
      }
      return count;
    })();
    return { last7Days, mealsPerDay, totalMeals, tagCounts, streak };
  }, [mealLogs]);

  const bmiData = useMemo(() => {
    if (!userProfile) return null;
    const { height, weight } = userProfile.inBody;
    const bmi = weight / Math.pow(height / 100, 2);
    let category = "정상";
    let color = colors.success;
    if (bmi < 18.5) { category = "저체중"; color = colors.warning; }
    else if (bmi >= 23 && bmi < 25) { category = "과체중"; color = colors.warning; }
    else if (bmi >= 25) { category = "비만"; color = colors.error; }
    return { bmi, category, color };
  }, [userProfile, colors]);

  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-sm text-muted">나의 건강 기록</Text>
          <Text className="text-2xl font-bold text-foreground mt-1">리포트</Text>
        </View>

        {/* Summary Cards */}
        <AnimatedEntry delay={0} duration={300} className="px-5 mt-4">
          <View className="flex-row gap-3">
            <View className="flex-1 p-4 rounded-2xl" style={[styles.card, { backgroundColor: colors.surface }]}>
              <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: `${colors.primary}12` }}>
                <Text className="text-xl">🍽️</Text>
              </View>
              <Text className="text-3xl font-bold text-foreground">{stats.totalMeals}</Text>
              <Text className="text-xs text-muted mt-0.5">총 식사 기록</Text>
            </View>
            <View className="flex-1 p-4 rounded-2xl" style={[styles.card, { backgroundColor: colors.surface }]}>
              <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "#F59E0B12" }}>
                <Text className="text-xl">🔥</Text>
              </View>
              <Text className="text-3xl font-bold text-foreground">{stats.streak}</Text>
              <Text className="text-xs text-muted mt-0.5">연속 기록일</Text>
            </View>
            <View className="flex-1 p-4 rounded-2xl" style={[styles.card, { backgroundColor: colors.surface }]}>
              <View className="w-10 h-10 rounded-xl items-center justify-center mb-2" style={{ backgroundColor: "#8B5CF612" }}>
                <Text className="text-xl">💊</Text>
              </View>
              <Text className="text-3xl font-bold text-foreground">{medications.length}</Text>
              <Text className="text-xs text-muted mt-0.5">복용 약물</Text>
            </View>
          </View>
        </AnimatedEntry>

        {/* Weekly Chart */}
        <AnimatedEntry delay={100} duration={300} className="px-5 mt-5">
          <View className="p-5 rounded-2xl" style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text className="text-base font-bold text-foreground mb-4">주간 식사 기록</Text>
            <View className="flex-row items-end justify-between" style={{ height: 140 }}>
              {stats.mealsPerDay.map((count, i) => {
                const maxMeals = Math.max(...stats.mealsPerDay, 4);
                const height = maxMeals > 0 ? (count / maxMeals) * 110 : 0;
                const isToday = i === 6;
                const dayIdx = new Date(stats.last7Days[i]).getDay();
                return (
                  <View key={i} className="items-center flex-1">
                    <Text className="text-xs font-semibold mb-1.5" style={{ color: isToday ? colors.primary : colors.muted }}>{count}</Text>
                    <View className="w-7 rounded-lg" style={{ height: Math.max(height, 6), backgroundColor: isToday ? colors.primary : `${colors.primary}30` }} />
                    <Text className="text-xs mt-2 font-medium" style={{ color: isToday ? colors.primary : colors.muted }}>
                      {dayLabels[dayIdx]}
                    </Text>
                    {isToday && <View className="w-1.5 h-1.5 rounded-full mt-1" style={{ backgroundColor: colors.primary }} />}
                  </View>
                );
              })}
            </View>
          </View>
        </AnimatedEntry>

        {/* Tag Analysis */}
        <AnimatedEntry delay={200} duration={300} className="px-5 mt-5">
          <View className="p-5 rounded-2xl" style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text className="text-base font-bold text-foreground mb-4">식사 패턴 분석</Text>
            {Object.keys(stats.tagCounts).length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-3xl mb-2">📊</Text>
                <Text className="text-sm text-muted text-center">식사를 기록하면{"\n"}패턴을 분석해드려요</Text>
              </View>
            ) : (
              Object.entries(stats.tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([tag, count], i) => {
                  const maxCount = Object.values(stats.tagCounts).reduce((a, b) => Math.max(a, b), 1);
                  const pct = (count / maxCount) * 100;
                  const tagColor = TAG_COLORS[tag] || colors.primary;
                  return (
                    <View key={tag} className="mb-3.5">
                      <View className="flex-row items-center justify-between mb-1.5">
                        <View className="flex-row items-center">
                          <Text className="text-sm mr-1.5">{TAG_EMOJIS[tag] || "🏷️"}</Text>
                          <Text className="text-sm font-medium text-foreground">{TAG_LABELS[tag] || tag}</Text>
                        </View>
                        <Text className="text-sm font-semibold" style={{ color: tagColor }}>{count}회</Text>
                      </View>
                      <View className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: `${tagColor}15` }}>
                        <View className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: tagColor }} />
                      </View>
                    </View>
                  );
                })
            )}
          </View>
        </AnimatedEntry>

        {/* Medications */}
        {medications.length > 0 && (
          <AnimatedEntry delay={300} duration={300} className="px-5 mt-5">
            <View className="p-5 rounded-2xl" style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text className="text-base font-bold text-foreground mb-4">복용 중인 약물</Text>
              {medications.map((med) => (
                <View key={med.id} className="flex-row items-center py-3 border-b" style={{ borderBottomColor: colors.border }}>
                  <View className="w-10 h-10 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: "#8B5CF612" }}>
                    <Text className="text-lg">💊</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-foreground">{med.name}</Text>
                    {med.dosage && (
                      <Text className="text-xs text-muted mt-0.5">{med.dosage}{med.frequency ? ` · ${med.frequency}` : ""}</Text>
                    )}
                  </View>
                </View>
              ))}
              <Text className="text-xs text-muted mt-3 italic">운동 계획에 약물 정보가 자동 반영됩니다</Text>
            </View>
          </AnimatedEntry>
        )}

        {/* Profile */}
        {userProfile && bmiData && (
          <AnimatedEntry delay={400} duration={300} className="px-5 mt-5">
            <View className="p-5 rounded-2xl" style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text className="text-base font-bold text-foreground mb-4">내 프로필</Text>

              {/* Goal */}
              <View className="flex-row items-center mb-5 pb-4 border-b" style={{ borderBottomColor: colors.border }}>
                <View className="w-12 h-12 rounded-2xl items-center justify-center mr-3" style={{ backgroundColor: `${colors.primary}12` }}>
                  <Text className="text-2xl">🎯</Text>
                </View>
                <View>
                  <Text className="text-xs text-muted">나의 목표</Text>
                  <Text className="text-lg font-bold text-foreground">{GOAL_LABELS[userProfile.goal]}</Text>
                </View>
              </View>

              {/* Body Metrics */}
              <View className="flex-row mb-4">
                <View className="flex-1 items-center py-3 rounded-xl mr-2" style={{ backgroundColor: colors.background }}>
                  <Text className="text-xs text-muted mb-1">키</Text>
                  <Text className="text-xl font-bold text-foreground">{userProfile.inBody.height}<Text className="text-sm font-normal text-muted">cm</Text></Text>
                </View>
                <View className="flex-1 items-center py-3 rounded-xl mr-2" style={{ backgroundColor: colors.background }}>
                  <Text className="text-xs text-muted mb-1">체중</Text>
                  <Text className="text-xl font-bold text-foreground">{userProfile.inBody.weight}<Text className="text-sm font-normal text-muted">kg</Text></Text>
                </View>
                <View className="flex-1 items-center py-3 rounded-xl" style={{ backgroundColor: colors.background }}>
                  <Text className="text-xs text-muted mb-1">BMI</Text>
                  <Text className="text-xl font-bold" style={{ color: bmiData.color }}>{bmiData.bmi.toFixed(1)}</Text>
                  <Text className="text-xs font-medium" style={{ color: bmiData.color }}>{bmiData.category}</Text>
                </View>
              </View>

              {/* Diseases */}
              {userProfile.diseases.length > 0 && (
                <View>
                  <Text className="text-xs text-muted mb-2">관리 중인 질환</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {userProfile.diseases.map((disease) => (
                      <View key={disease} className="px-3 py-1.5 rounded-full" style={{ backgroundColor: `${colors.warning}12` }}>
                        <Text className="text-xs font-medium" style={{ color: colors.warning }}>{getDiseaseLabel(disease)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </AnimatedEntry>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function getDiseaseLabel(disease: string): string {
  const labels: Record<string, string> = {
    diabetes: "당뇨", obesity: "비만", hypertension: "고혈압", hyperlipidemia: "고지혈증",
    heart_failure: "심부전", osteoporosis: "골다공증", hyperthyroidism: "갑상선 항진", hypothyroidism: "갑상선 저하",
  };
  return labels[disease] || disease;
}

const styles = StyleSheet.create({
  card: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
});
