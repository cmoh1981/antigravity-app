import { useState } from "react";
import { Text, View, Pressable, StyleSheet, ScrollView, Switch, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import { GOAL_LABELS, DISEASE_LABELS, Disease, UserGoal } from "@/types";
import * as Haptics from "expo-haptics";

export default function SettingsScreen() {
  const colors = useColors();
  
  const userProfile = useAppStore((state) => state.userProfile);
  const settings = useAppStore((state) => state.settings);
  const medications = useAppStore((state) => state.medications);

  const handleToggleLLM = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    useAppStore.getState().toggleLLMCoach();
  };

  const handleToggleNotifications = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    useAppStore.getState().updateSettings({ 
      notifications: !settings.notifications 
    });
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      "온보딩 초기화",
      "모든 데이터가 삭제되고 처음부터 다시 시작합니다. 계속하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { 
          text: "초기화", 
          style: "destructive",
          onPress: () => {
            useAppStore.getState().resetStore();
            router.replace("/onboarding");
          }
        },
      ]
    );
  };

  const handleEditProfile = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Navigate to profile edit (could be a modal or separate screen)
    Alert.alert("프로필 수정", "프로필 수정 기능은 곧 추가될 예정입니다.");
  };

  const handleManageMedications = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/medication");
  };

  const handlePremium = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/premium");
  };

  const renderSettingRow = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !rightElement}
      style={({ pressed }) => [
        styles.settingRow,
        { backgroundColor: colors.surface },
        pressed && onPress && { opacity: 0.8 },
      ]}
    >
      <Text className="text-xl mr-3">{icon}</Text>
      <View className="flex-1">
        <Text className="text-base text-foreground">{title}</Text>
        {subtitle && (
          <Text className="text-xs text-muted mt-0.5">{subtitle}</Text>
        )}
      </View>
      {rightElement || (onPress && (
        <Text className="text-muted">›</Text>
      ))}
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScrollView 
        className="flex-1 px-6"
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            설정
          </Text>
        </View>

        {/* Profile Section */}
        {userProfile && (
          <View className="mb-6">
            <Text className="text-sm font-medium text-muted mb-3">
              내 프로필
            </Text>
            <View 
              className="p-4 rounded-xl"
              style={{ backgroundColor: colors.surface }}
            >
              <View className="flex-row items-center mb-4">
                <View 
                  className="w-16 h-16 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Text className="text-3xl">👤</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-foreground">
                    {GOAL_LABELS[userProfile.goal]}
                  </Text>
                  <Text className="text-sm text-muted">
                    {userProfile.inBody.height}cm • {userProfile.inBody.weight}kg
                  </Text>
                </View>
                <Pressable
                  onPress={handleEditProfile}
                  style={({ pressed }) => [
                    styles.editButton,
                    { backgroundColor: colors.primary },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text className="text-white text-sm">수정</Text>
                </Pressable>
              </View>

              {/* Diseases */}
              {userProfile.diseases.length > 0 && (
                <View className="pt-3 border-t" style={{ borderColor: colors.border }}>
                  <Text className="text-xs text-muted mb-2">관리 중인 질환</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {userProfile.diseases.map(disease => (
                      <View 
                        key={disease}
                        className="px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${colors.warning}20` }}
                      >
                        <Text className="text-xs" style={{ color: colors.warning }}>
                          {DISEASE_LABELS[disease]}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Premium Section */}
        <View className="mb-6">
          <Pressable
            onPress={handlePremium}
            style={({ pressed }) => [
              styles.premiumCard,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.9 },
            ]}
          >
            <View className="flex-row items-center">
              <Text className="text-3xl mr-3">✨</Text>
              <View className="flex-1">
                <Text className="text-lg font-bold text-white">
                  프리미엄 업그레이드
                </Text>
                <Text className="text-sm text-white opacity-80">
                  AI 코치와 고급 기능을 이용하세요
                </Text>
              </View>
              <Text className="text-white text-lg">›</Text>
            </View>
          </Pressable>
        </View>

        {/* Features Section */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-muted mb-3">
            기능
          </Text>
          <View className="gap-2">
            {renderSettingRow(
              "🤖",
              "AI 코치",
              settings.enableLLMCoach ? "활성화됨" : "비활성화됨",
              undefined,
              <Switch
                value={settings.enableLLMCoach}
                onValueChange={handleToggleLLM}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            )}
            {renderSettingRow(
              "💊",
              "약물 관리",
              `${medications.length}개 등록됨`,
              handleManageMedications
            )}
            {renderSettingRow(
              "🔔",
              "알림",
              settings.notifications ? "활성화됨" : "비활성화됨",
              undefined,
              <Switch
                value={settings.notifications}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            )}
          </View>
        </View>

        {/* Info Section */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-muted mb-3">
            정보
          </Text>
          <View className="gap-2">
            {renderSettingRow(
              "📋",
              "이용약관",
              undefined,
              () => Alert.alert("이용약관", "이용약관 페이지로 이동합니다.")
            )}
            {renderSettingRow(
              "🔒",
              "개인정보 처리방침",
              undefined,
              () => Alert.alert("개인정보 처리방침", "개인정보 처리방침 페이지로 이동합니다.")
            )}
            {renderSettingRow(
              "ℹ️",
              "앱 버전",
              "1.0.0"
            )}
          </View>
        </View>

        {/* Danger Zone */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-muted mb-3">
            계정
          </Text>
          <Pressable
            onPress={handleResetOnboarding}
            style={({ pressed }) => [
              styles.settingRow,
              { backgroundColor: colors.surface },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text className="text-xl mr-3">🔄</Text>
            <View className="flex-1">
              <Text className="text-base" style={{ color: colors.error }}>
                데이터 초기화
              </Text>
              <Text className="text-xs text-muted mt-0.5">
                모든 데이터를 삭제하고 처음부터 시작합니다
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Disclaimer */}
        <View 
          className="p-4 rounded-xl"
          style={{ backgroundColor: `${colors.warning}10` }}
        >
          <Text className="text-xs text-muted text-center leading-relaxed">
            이 앱은 의료 조언을 제공하지 않습니다.{"\n"}
            건강 관련 결정은 반드시 전문 의료인과 상담하세요.{"\n"}
            약물 복용량 변경이나 중단은 의사와 상의 후 결정하세요.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumCard: {
    padding: 16,
    borderRadius: 16,
  },
});
