import { Platform } from "react-native";
import { View, type ViewProps } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface AnimatedEntryProps extends ViewProps {
  direction?: "down" | "up";
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

/**
 * Cross-platform animated entry wrapper.
 * On native: uses react-native-reanimated entering animations.
 * On web: renders a plain View (reanimated entering animations cause visibility:hidden on web).
 */
export function AnimatedEntry({
  direction = "down",
  delay = 0,
  duration = 300,
  children,
  ...props
}: AnimatedEntryProps) {
  if (Platform.OS === "web") {
    return <View {...props}>{children}</View>;
  }

  const entering =
    direction === "up"
      ? FadeInUp.delay(delay).duration(duration)
      : FadeInDown.delay(delay).duration(duration);

  return (
    <Animated.View entering={entering} {...props}>
      {children}
    </Animated.View>
  );
}
