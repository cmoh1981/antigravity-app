import { Text, View, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function PremiumScreen() {
  const colors = useColors();

  const handleNext = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push("/onboarding/complete");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-12">
          {/* Back Button */}
          <Pressable onPress={handleBack} className="mb-4">
            <Text className="text-primary text-base">← 이전</Text>
          </Pressable>

          {/* Progress */}
          <View className="flex-row mb-8">
            <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
            <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
            <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
            <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
            <View className="flex-1 h-1 bg-primary rounded-full mr-1" />
            <View className="flex-1 h-1 bg-primary rounded-full" />
          </View>

          {/* Title */}
          <View className="items-center mb-6">
            <View 
              className="px-3 py-1 rounded-full mb-4"
              style={{ backgroundColor: `${colors.warning}30` }}
            >
              <Text className="text-sm font-semibold" style={{ color: colors.warning }}>
                COMING SOON
              </Text>
            </View>
            <Text className="text-2xl font-bold text-foreground text-center mb-2">
              프리미엄 기능 출시 예정
            </Text>
            <Text className="text-base text-muted text-center">
              더 정밀한 맞춤 건강 관리
            </Text>
          </View>

          {/* Premium Features */}
          <View className="gap-4">
            <PremiumFeatureCard
              colors={colors}
              emoji="🧬"
              title="유전체 분석"
              description="유전자 검사 결과를 업로드하면 체질에 맞는 운동과 식단을 추천해드려요"
              comingSoon
            />
            <PremiumFeatureCard
              colors={colors}
              emoji="🏥"
              title="건강검진 분석"
              description="건강검진 결과를 분석해서 주의해야 할 점과 개선 방법을 알려드려요"
              comingSoon
            />
            <PremiumFeatureCard
              colors={colors}
              emoji="🤖"
              title="AI 코치 (베타)"
              description="온디바이스 AI가 더 자연스러운 대화로 건강 코칭을 해드려요"
              beta
            />
            <PremiumFeatureCard
              colors={colors}
              emoji="📊"
              title="상세 리포트"
              description="주간/월간 건강 리포트와 트렌드 분석을 제공해요"
              comingSoon
            />
          </View>

          {/* Notice */}
          <View 
            className="mt-6 p-4 rounded-xl"
            style={{ backgroundColor: colors.surface }}
          >
            <Text className="text-sm text-muted leading-relaxed text-center">
              프리미엄 기능은 추후 유료로 제공될 예정이에요.{"\n"}
              출시 알림을 받고 싶으시면 설정에서 신청해주세요!
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-background">
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text className="text-lg font-semibold text-white">
            시작하기
          </Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function PremiumFeatureCard({
  colors,
  emoji,
  title,
  description,
  comingSoon,
  beta,
}: {
  colors: ReturnType<typeof useColors>;
  emoji: string;
  title: string;
  description: string;
  comingSoon?: boolean;
  beta?: boolean;
}) {
  return (
    <View 
      className="p-4 rounded-xl"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-start">
        <Text className="text-3xl mr-3">{emoji}</Text>
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="text-base font-semibold text-foreground mr-2">
              {title}
            </Text>
            {comingSoon && (
              <View 
                className="px-2 py-0.5 rounded"
                style={{ backgroundColor: `${colors.muted}30` }}
              >
                <Text className="text-xs text-muted">출시 예정</Text>
              </View>
            )}
            {beta && (
              <View 
                className="px-2 py-0.5 rounded"
                style={{ backgroundColor: `${colors.primary}30` }}
              >
                <Text className="text-xs" style={{ color: colors.primary }}>베타</Text>
              </View>
            )}
          </View>
          <Text className="text-sm text-muted leading-relaxed">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
