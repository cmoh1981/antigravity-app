import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, TextInput, FlatList, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore, generateId } from "@/store";
import { DRUG_DATABASE } from "@/data/drugs";
import { MedicationEntry, MedicationTag } from "@/types";
import * as Haptics from "expo-haptics";

const MEDICATION_TAG_LABELS: Record<MedicationTag, string> = {
  DROWSINESS_POSSIBLE: '졸음 유발 가능',
  DEHYDRATION_RISK_POSSIBLE: '탈수 위험',
  ORTHOSTATIC_DIZZINESS_POSSIBLE: '기립성 어지러움',
  BLEEDING_RISK_CAUTION: '출혈 주의',
};

export default function MedicationScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  
  const medications = useAppStore((state) => state.medications);

  const searchResults = searchQuery.length >= 2
    ? DRUG_DATABASE.filter(drug => 
        drug.nameKo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (drug.nameEn && drug.nameEn.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 10)
    : [];

  const handleAddMedication = (drug: typeof DRUG_DATABASE[0]) => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    const newMed: MedicationEntry = {
      id: generateId(),
      name: drug.nameKo,
      nameEn: drug.nameEn,
      tags: drug.tags,
      confirmedByUser: true,
      addedVia: 'search',
      createdAt: new Date().toISOString(),
    };
    
    useAppStore.getState().addMedication(newMed);
    setSearchQuery("");
    setShowSearch(false);
  };

  const handleDeleteMedication = (id: string, name: string) => {
    Alert.alert(
      "약물 삭제",
      `${name}을(를) 목록에서 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive",
          onPress: () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            useAppStore.getState().deleteMedication(id);
          }
        },
      ]
    );
  };

  const renderMedicationCard = (med: MedicationEntry) => (
    <View 
      key={med.id}
      className="p-4 rounded-xl mb-3"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-foreground">
            {med.name}
          </Text>
          {med.nameEn && (
            <Text className="text-xs text-muted">{med.nameEn}</Text>
          )}
        </View>
        <Pressable
          onPress={() => handleDeleteMedication(med.id, med.name)}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text className="text-error text-sm">삭제</Text>
        </Pressable>
      </View>
      
      {med.tags.length > 0 && (
        <View className="flex-row flex-wrap gap-2">
          {med.tags.map(tag => (
            <View 
              key={tag}
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: `${colors.warning}20` }}
            >
              <Text className="text-xs" style={{ color: colors.warning }}>
                {MEDICATION_TAG_LABELS[tag]}
              </Text>
            </View>
          ))}
        </View>
      )}
      
      <Text className="text-xs text-muted mt-2">
        추가일: {new Date(med.createdAt).toLocaleDateString('ko-KR')}
      </Text>
    </View>
  );

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 px-6 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary text-base">← 뒤로</Text>
          </Pressable>
          <Text className="text-lg font-bold text-foreground">
            약물 관리
          </Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Search Section */}
        <View className="mb-6">
          <View 
            className="flex-row items-center p-3 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-lg mr-2">🔍</Text>
            <TextInput
              className="flex-1 text-base text-foreground"
              placeholder="약물 이름 검색..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setShowSearch(true)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Text className="text-muted">✕</Text>
              </Pressable>
            )}
          </View>

          {/* Search Results */}
          {showSearch && searchResults.length > 0 && (
            <View 
              className="mt-2 rounded-xl overflow-hidden"
              style={{ backgroundColor: colors.surface }}
            >
              {searchResults.map((drug, i) => (
                <Pressable
                  key={drug.id}
                  onPress={() => handleAddMedication(drug)}
                  style={({ pressed }) => [
                    styles.searchResult,
                    { borderBottomColor: colors.border },
                    i === searchResults.length - 1 && { borderBottomWidth: 0 },
                    pressed && { backgroundColor: `${colors.primary}10` },
                  ]}
                >
                  <View className="flex-1">
                    <Text className="text-base text-foreground">
                      {drug.nameKo}
                    </Text>
                    {drug.nameEn && (
                      <Text className="text-xs text-muted">{drug.nameEn}</Text>
                    )}
                  </View>
                  <Text className="text-primary">+ 추가</Text>
                </Pressable>
              ))}
            </View>
          )}

          {showSearch && searchQuery.length >= 2 && searchResults.length === 0 && (
            <View 
              className="mt-2 p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-sm text-muted text-center">
                검색 결과가 없습니다
              </Text>
            </View>
          )}
        </View>

        {/* Medication List */}
        <Text className="text-sm font-medium text-muted mb-3">
          등록된 약물 ({medications.length}개)
        </Text>
        
        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {medications.length === 0 ? (
            <View 
              className="p-8 rounded-xl items-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Text className="text-4xl mb-3">💊</Text>
              <Text className="text-base text-foreground text-center mb-2">
                등록된 약물이 없어요
              </Text>
              <Text className="text-sm text-muted text-center">
                복용 중인 약물을 검색해서 추가하면{"\n"}
                운동 계획에 반영됩니다
              </Text>
            </View>
          ) : (
            medications.map(renderMedicationCard)
          )}
        </ScrollView>

        {/* Info Note */}
        <View 
          className="p-4 rounded-xl mt-4"
          style={{ backgroundColor: `${colors.warning}10` }}
        >
          <Text className="text-xs text-muted text-center">
            ⚠️ 약물 정보는 운동 안전 가이드에만 사용됩니다.{"\n"}
            복용량 변경은 반드시 의사와 상담하세요.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
});
