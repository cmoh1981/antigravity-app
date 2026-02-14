import { Text, View, Pressable, StyleSheet, ScrollView, Switch, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import { GOAL_LABELS, DISEASE_LABELS } from "@/types";
import * as Haptics from "expo-haptics";
import { AnimatedEntry } from "@/components/animated-entry";

type SettingsItem = {
  icon: string;
  label: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
  color?: string;
};

export default function SettingsScreen() {
  const colors = useColors();
  const userProfile = useAppStore((state) => state.userProfile);
  const settings = useAppStore((state) => state.settings);
  const medications = useAppStore((state) => state.medications);
  const isPremium = settings.enableLLMCoach; // Premium approximation

  const tap = (action?: () => void) => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    action?.();
  };

  const handleToggleLLM = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useAppStore.getState().toggleLLMCoach();
  };

  const handleToggleNotifications = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    useAppStore.getState().updateSettings({ notifications: !settings.notifications });
  };

  const handleResetOnboarding = () => {
    Alert.alert("프로필 재설정", "프로필 정보를 다시 설정하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "재설정", style: "destructive", onPress: () => { useAppStore.getState().setOnboarded(false); router.replace("/onboarding"); } },
    ]);
  };

  const handleResetData = () => {
    Alert.alert("데이터 초기화", "모든 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.", [
      { text: "취소", style: "cancel" },
      { text: "삭제", style: "destructive", onPress: () => { useAppStore.getState().resetStore(); router.replace("/onboarding"); } },
    ]);
  };

  const sections: { title: string; items: SettingsItem[] }[] = [
    {
      title: "기능",
      items: [
        {
          icon: "🤖", label: "AI 코치", subtitle: settings.enableLLMCoach ? "활성화됨" : "비활성화됨",
          rightElement: <Switch value={settings.enableLLMCoach} onValueChange={handleToggleLLM} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />,
        },
        { icon: "💊", label: "약물 관리", subtitle: `${medications.length}개 등록됨`, onPress: () => router.push("/medication") },
        {
          icon: "🔔", label: "알림", subtitle: settings.notifications ? "활성화됨" : "비활성화됨",
          rightElement: <Switch value={settings.notifications} onValueChange={handleToggleNotifications} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />,
        },
      ],
    },
    {
      title: "정보",
      items: [
        { icon: "📱", label: "앱 버전", value: "1.0.0" },
        { icon: "📋", label: "이용약관", onPress: () => Alert.alert("이용약관", "이용약관 페이지로 이동합니다.") },
        { icon: "🔒", label: "개인정보 처리방침", onPress: () => Alert.alert("개인정보 처리방침", "개인정보 처리방침 페이지로 이동합니다.") },
      ],
    },
    {
      title: "계정",
      items: [
        { icon: "🔄", label: "프로필 재설정", subtitle: "온보딩을 다시 진행합니다", onPress: handleResetOnboarding },
        { icon: "🗑️", label: "모든 데이터 초기화", subtitle: "기록과 설정이 모두 삭제됩니다", danger: true, onPress: handleResetData },
      ],
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <Text className="text-2xl font-bold text-foreground">설정</Text>
        </View>

        {/* Profile Card */}
        {userProfile && (
          <AnimatedEntry delay={0} duration={300} className="px-5 mt-4">
            <View className="p-5 rounded-2xl flex-row items-center" style={[styles.card, { backgroundColor: colors.surface }]}>
              <View className="w-14 h-14 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: `${colors.primary}12` }}>
                <Text className="text-3xl">👤</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center">
                  <Text className="text-lg font-bold text-foreground">{GOAL_LABELS[userProfile.goal]}</Text>
                  {isPremium && (
                    <View className="ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F59E0B18" }}>
                      <Text className="text-xs font-bold" style={{ color: "#F59E0B" }}>PRO</Text>
                    </View>
                  )}
                </View>
                <Text className="text-sm text-muted mt-0.5">{userProfile.inBody.height}cm · {userProfile.inBody.weight}kg</Text>
                {userProfile.diseases.length > 0 && (
                  <View className="flex-row flex-wrap gap-1 mt-2">
                    {userProfile.diseases.slice(0, 3).map((d) => (
                      <View key={d} className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors.warning}12` }}>
                        <Text className="text-xs" style={{ color: colors.warning }}>{DISEASE_LABELS[d]}</Text>
                      </View>
                    ))}
                    {userProfile.diseases.length > 3 && (
                      <Text className="text-xs text-muted self-center">+{userProfile.diseases.length - 3}</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          </AnimatedEntry>
        )}

        {/* Premium Banner */}
        {!isPremium && (
          <AnimatedEntry delay={80} duration={300} className="px-5 mt-4">
            <Pressable
              onPress={() => tap(() => router.push("/premium"))}
              style={({ pressed }) => [styles.premiumBanner, pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] }]}
            >
              <View className="flex-row items-center">
                <Text className="text-3xl mr-3">✨</Text>
                <View className="flex-1">
                  <Text className="text-base font-bold text-white">프리미엄 업그레이드</Text>
                  <Text className="text-xs text-white mt-0.5" style={{ opacity: 0.85 }}>AI 코치와 고급 분석을 이용하세요</Text>
                </View>
                <Text className="text-white text-lg font-light">›</Text>
              </View>
            </Pressable>
          </AnimatedEntry>
        )}

        {/* Settings Sections */}
        {sections.map((section, si) => (
          <AnimatedEntry delay={0} duration={300} key={section.title} className="px-5 mt-5">
            <Text className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 ml-1">{section.title}</Text>
            <View className="rounded-2xl overflow-hidden" style={[styles.card, { backgroundColor: colors.surface }]}>
              {section.items.map((item, ii) => (
                <Pressable
                  key={item.label}
                  onPress={item.onPress ? () => tap(item.onPress) : undefined}
                  disabled={!item.onPress && !item.rightElement}
                  style={({ pressed }) => [
                    styles.row,
                    { borderBottomColor: ii < section.items.length - 1 ? colors.border : "transparent" },
                    pressed && item.onPress && { backgroundColor: `${colors.primary}06` },
                  ]}
                >
                  <View className="w-9 h-9 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: item.danger ? `${colors.error}10` : `${colors.primary}08` }}>
                    <Text className="text-lg">{item.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-medium" style={{ color: item.danger ? colors.error : colors.foreground }}>{item.label}</Text>
                    {item.subtitle && <Text className="text-xs text-muted mt-0.5">{item.subtitle}</Text>}
                  </View>
                  {item.value && <Text className="text-sm text-muted mr-1">{item.value}</Text>}
                  {item.rightElement}
                  {item.onPress && !item.rightElement && <Text className="text-sm text-muted">›</Text>}
                </Pressable>
              ))}
            </View>
          </AnimatedEntry>
        ))}

        {/* Disclaimer */}
        <AnimatedEntry delay={500} duration={300} className="px-5 mt-6">
          <View className="p-4 rounded-2xl" style={{ backgroundColor: `${colors.warning}08` }}>
            <Text className="text-xs text-muted text-center leading-relaxed">
              이 앱은 의료 조언을 제공하지 않습니다.{"\n"}
              건강 관련 결정은 반드시 전문 의료인과 상담하세요.{"\n"}
              약물 복용량 변경이나 중단은 의사와 상의 후 결정하세요.
            </Text>
          </View>
        </AnimatedEntry>

        {/* Footer */}
        <View className="items-center mt-6 mb-4">
          <Text className="text-xs text-muted">오늘건강 v1.0.0</Text>
          <Text className="text-xs text-muted mt-0.5">오늘 하루, 건강하게</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: { shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  row: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5 },
  premiumBanner: {
    padding: 16, borderRadius: 16,
    backgroundColor: "#F5A623",
    shadowColor: "#F5A623", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
});
