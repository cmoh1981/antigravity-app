import { Text, View, Pressable, StyleSheet, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAppStore } from "@/store";
import * as Haptics from "expo-haptics";

const PREMIUM_FEATURES = [
  {
    emoji: "🤖",
    title: "AI 코치",
    description: "GPT 기반 맞춤형 건강 코칭을 받아보세요",
  },
  {
    emoji: "📊",
    title: "상세 분석",
    description: "주간/월간 건강 트렌드와 인사이트를 확인하세요",
  },
  {
    emoji: "🍽️",
    title: "식단 분석",
    description: "사진으로 식사를 기록하고 영양소를 분석받으세요",
  },
  {
    emoji: "💬",
    title: "무제한 채팅",
    description: "AI 코치와 언제든 대화하세요",
  },
  {
    emoji: "🎯",
    title: "고급 목표 설정",
    description: "세부 목표와 마일스톤을 설정하세요",
  },
  {
    emoji: "📱",
    title: "광고 없음",
    description: "깔끔한 화면에서 집중하세요",
  },
];

const PLANS = [
  {
    id: "monthly",
    name: "월간",
    price: "₩9,900",
    period: "/월",
    popular: false,
  },
  {
    id: "yearly",
    name: "연간",
    price: "₩79,000",
    period: "/년",
    popular: true,
    savings: "33% 할인",
  },
];

export default function PremiumScreen() {
  const colors = useColors();
  const settings = useAppStore((state) => state.settings);

  const handleSelectPlan = (planId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    // In a real app, this would initiate the purchase flow
    alert(`${planId === 'yearly' ? '연간' : '월간'} 플랜이 선택되었습니다.\n실제 결제는 앱스토어를 통해 진행됩니다.`);
  };

  const handleRestorePurchase = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    alert("구매 복원 기능은 앱스토어 연동 후 사용 가능합니다.");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4">
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary text-base">← 뒤로</Text>
          </Pressable>
        </View>

        {/* Hero Section */}
        <View className="items-center px-6 py-8">
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            <Text className="text-4xl">✨</Text>
          </View>
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            프리미엄으로 업그레이드
          </Text>
          <Text className="text-base text-muted text-center">
            AI 코치와 함께 더 효과적인{"\n"}건강 관리를 시작하세요
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 mb-8">
          <View 
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: colors.surface }}
          >
            {PREMIUM_FEATURES.map((feature, i) => (
              <View 
                key={i}
                className="flex-row items-center p-4"
                style={i < PREMIUM_FEATURES.length - 1 ? {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                } : {}}
              >
                <View 
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Text className="text-2xl">{feature.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {feature.title}
                  </Text>
                  <Text className="text-sm text-muted">
                    {feature.description}
                  </Text>
                </View>
                <Text className="text-success text-lg">✓</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Plans */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4 text-center">
            플랜 선택
          </Text>
          <View className="flex-row gap-3">
            {PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => handleSelectPlan(plan.id)}
                style={({ pressed }) => [
                  styles.planCard,
                  {
                    backgroundColor: plan.popular ? colors.primary : colors.surface,
                    borderColor: plan.popular ? colors.primary : colors.border,
                  },
                  pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
                ]}
              >
                {plan.popular && (
                  <View 
                    className="absolute -top-3 left-1/2 px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: colors.success,
                      transform: [{ translateX: -30 }],
                    }}
                  >
                    <Text className="text-xs text-white font-medium">인기</Text>
                  </View>
                )}
                <Text 
                  className="text-sm font-medium mb-2"
                  style={{ color: plan.popular ? '#fff' : colors.muted }}
                >
                  {plan.name}
                </Text>
                <Text 
                  className="text-2xl font-bold"
                  style={{ color: plan.popular ? '#fff' : colors.foreground }}
                >
                  {plan.price}
                </Text>
                <Text 
                  className="text-sm"
                  style={{ color: plan.popular ? 'rgba(255,255,255,0.8)' : colors.muted }}
                >
                  {plan.period}
                </Text>
                {plan.savings && (
                  <View 
                    className="mt-2 px-2 py-1 rounded-full"
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  >
                    <Text className="text-xs text-white font-medium">
                      {plan.savings}
                    </Text>
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Restore Purchase */}
        <View className="px-6 items-center">
          <Pressable onPress={handleRestorePurchase}>
            <Text className="text-primary text-sm">구매 복원</Text>
          </Pressable>
        </View>

        {/* Terms */}
        <View className="px-6 mt-6">
          <Text className="text-xs text-muted text-center leading-relaxed">
            구독은 현재 기간이 끝나기 24시간 전에 자동 갱신됩니다.{"\n"}
            구독은 구매 후 계정 설정에서 관리하고 취소할 수 있습니다.{"\n"}
            무료 체험 기간 중 미사용분은 구독 구매 시 소멸됩니다.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  planCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
  },
});
