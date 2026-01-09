import { useMemo } from "react";
import { Text, View, ScrollView, StyleSheet, Dimensions } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, getTodayDate } from "@/store";
import { GOAL_LABELS } from "@/types";

const { width } = Dimensions.get('window');

export default function ReportScreen() {
  const colors = useColors();
  
  const userProfile = useAppStore((state) => state.userProfile);
  const mealLogs = useAppStore((state) => state.mealLogs);
  const medications = useAppStore((state) => state.medications);

  // Calculate stats for the last 7 days
  const stats = useMemo(() => {
    const today = new Date();
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const mealsPerDay = last7Days.map(date => {
      return mealLogs.filter(m => m.date === date).length;
    });

    const totalMeals = mealsPerDay.reduce((a, b) => a + b, 0);
    const avgMealsPerDay = totalMeals / 7;

    // Tag frequency
    const tagCounts: Record<string, number> = {};
    mealLogs.forEach(meal => {
      meal.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return {
      last7Days,
      mealsPerDay,
      totalMeals,
      avgMealsPerDay,
      tagCounts,
    };
  }, [mealLogs]);

  const renderWeeklyChart = () => {
    const maxMeals = Math.max(...stats.mealsPerDay, 4);
    const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
    
    return (
      <View 
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-base font-semibold text-foreground mb-4">
          주간 식사 기록
        </Text>
        <View className="flex-row items-end justify-between h-32">
          {stats.mealsPerDay.map((count, i) => {
            const height = maxMeals > 0 ? (count / maxMeals) * 100 : 0;
            const isToday = i === 6;
            return (
              <View key={i} className="items-center flex-1">
                <Text className="text-xs text-muted mb-1">{count}</Text>
                <View 
                  className="w-6 rounded-t-md"
                  style={{ 
                    height: Math.max(height, 4),
                    backgroundColor: isToday ? colors.primary : `${colors.primary}60`,
                  }}
                />
                <Text 
                  className="text-xs mt-2"
                  style={{ color: isToday ? colors.primary : colors.muted }}
                >
                  {dayLabels[new Date(stats.last7Days[i]).getDay()]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderTagStats = () => {
    const sortedTags = Object.entries(stats.tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    if (sortedTags.length === 0) {
      return (
        <View 
          className="p-4 rounded-xl mb-6"
          style={{ backgroundColor: colors.surface }}
        >
          <Text className="text-base font-semibold text-foreground mb-2">
            식사 패턴 분석
          </Text>
          <Text className="text-sm text-muted">
            식사를 기록하면 패턴을 분석해드려요
          </Text>
        </View>
      );
    }

    const maxCount = sortedTags[0][1];

    const tagLabels: Record<string, string> = {
      high_protein: '고단백',
      high_carb: '고탄수',
      high_fat: '고지방',
      high_sodium: '짠 음식',
      low_veggie: '채소 부족',
      alcohol: '음주',
      dessert: '디저트',
    };

    return (
      <View 
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-base font-semibold text-foreground mb-4">
          식사 패턴 분석
        </Text>
        {sortedTags.map(([tag, count]) => {
          const percentage = (count / maxCount) * 100;
          return (
            <View key={tag} className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-sm text-foreground">
                  {tagLabels[tag] || tag}
                </Text>
                <Text className="text-sm text-muted">{count}회</Text>
              </View>
              <View 
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: colors.border }}
              >
                <View 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: colors.primary,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderMedicationSummary = () => {
    if (medications.length === 0) {
      return null;
    }

    return (
      <View 
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-base font-semibold text-foreground mb-4">
          복용 중인 약물
        </Text>
        {medications.map((med) => (
          <View key={med.id} className="flex-row items-center mb-2">
            <Text className="text-lg mr-2">💊</Text>
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground">
                {med.name}
              </Text>
              {med.dosage && (
                <Text className="text-xs text-muted">
                  {med.dosage} {med.frequency && `• ${med.frequency}`}
                </Text>
              )}
            </View>
          </View>
        ))}
        <Text className="text-xs text-muted mt-2">
          * 운동 계획에 약물 정보가 반영됩니다
        </Text>
      </View>
    );
  };

  const renderProfileSummary = () => {
    if (!userProfile) return null;

    const { inBody, goal, diseases } = userProfile;
    const bmi = inBody.weight / Math.pow(inBody.height / 100, 2);
    
    let bmiCategory = '';
    let bmiColor = colors.success;
    if (bmi < 18.5) {
      bmiCategory = '저체중';
      bmiColor = colors.warning;
    } else if (bmi < 23) {
      bmiCategory = '정상';
      bmiColor = colors.success;
    } else if (bmi < 25) {
      bmiCategory = '과체중';
      bmiColor = colors.warning;
    } else {
      bmiCategory = '비만';
      bmiColor = colors.error;
    }

    return (
      <View 
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: colors.surface }}
      >
        <Text className="text-base font-semibold text-foreground mb-4">
          내 프로필
        </Text>
        
        {/* Goal */}
        <View className="flex-row items-center mb-4">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <Text className="text-xl">🎯</Text>
          </View>
          <View>
            <Text className="text-xs text-muted">목표</Text>
            <Text className="text-base font-medium text-foreground">
              {GOAL_LABELS[goal]}
            </Text>
          </View>
        </View>

        {/* Body Metrics */}
        <View className="flex-row mb-4">
          <View className="flex-1 items-center">
            <Text className="text-xs text-muted">키</Text>
            <Text className="text-lg font-semibold text-foreground">
              {inBody.height}cm
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-xs text-muted">체중</Text>
            <Text className="text-lg font-semibold text-foreground">
              {inBody.weight}kg
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text className="text-xs text-muted">BMI</Text>
            <Text 
              className="text-lg font-semibold"
              style={{ color: bmiColor }}
            >
              {bmi.toFixed(1)}
            </Text>
            <Text className="text-xs" style={{ color: bmiColor }}>
              {bmiCategory}
            </Text>
          </View>
        </View>

        {/* Diseases */}
        {diseases.length > 0 && (
          <View>
            <Text className="text-xs text-muted mb-2">관리 중인 질환</Text>
            <View className="flex-row flex-wrap gap-2">
              {diseases.map(disease => (
                <View 
                  key={disease}
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${colors.warning}20` }}
                >
                  <Text className="text-xs" style={{ color: colors.warning }}>
                    {getDiseaseLabel(disease)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
        <View className="mb-6">
          <Text className="text-sm text-muted">나의 건강 기록</Text>
          <Text className="text-2xl font-bold text-foreground">
            리포트
          </Text>
        </View>

        {/* Summary Cards */}
        <View className="flex-row gap-3 mb-6">
          <View 
            className="flex-1 p-4 rounded-xl items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-3xl mb-1">🍽️</Text>
            <Text className="text-2xl font-bold text-foreground">
              {stats.totalMeals}
            </Text>
            <Text className="text-xs text-muted">총 식사 기록</Text>
          </View>
          <View 
            className="flex-1 p-4 rounded-xl items-center"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-3xl mb-1">💊</Text>
            <Text className="text-2xl font-bold text-foreground">
              {medications.length}
            </Text>
            <Text className="text-xs text-muted">복용 약물</Text>
          </View>
        </View>

        {/* Weekly Chart */}
        {renderWeeklyChart()}

        {/* Tag Stats */}
        {renderTagStats()}

        {/* Medication Summary */}
        {renderMedicationSummary()}

        {/* Profile Summary */}
        {renderProfileSummary()}
      </ScrollView>
    </ScreenContainer>
  );
}

function getDiseaseLabel(disease: string): string {
  const labels: Record<string, string> = {
    diabetes: '당뇨',
    obesity: '비만',
    hypertension: '고혈압',
    hyperlipidemia: '고지혈증',
    heart_failure: '심부전',
    osteoporosis: '골다공증',
    hyperthyroidism: '갑상선 항진',
    hypothyroidism: '갑상선 저하',
  };
  return labels[disease] || disease;
}

const styles = StyleSheet.create({});
