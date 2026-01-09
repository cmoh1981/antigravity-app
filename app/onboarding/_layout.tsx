import { Stack } from "expo-router";
import { useColors } from "@/hooks/use-colors";

export default function OnboardingLayout() {
  const colors = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="goal" />
      <Stack.Screen name="body" />
      <Stack.Screen name="diseases" />
      <Stack.Screen name="sleep" />
      <Stack.Screen name="medication" />
      <Stack.Screen name="premium" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
