// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "fork.knife": "restaurant",
  "figure.run": "fitness-center",
  "chart.bar.fill": "bar-chart",
  "gearshape.fill": "settings",
  "star.fill": "star",
  
  // Common actions
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "plus": "add",
  "xmark": "close",
  "checkmark": "check",
  "checkmark.circle.fill": "check-circle",
  
  // Health & Wellness
  "heart.fill": "favorite",
  "bed.double.fill": "hotel",
  "moon.fill": "nightlight",
  "sun.max.fill": "wb-sunny",
  "cloud.fill": "cloud",
  "cloud.rain.fill": "grain",
  "thermometer": "thermostat",
  
  // Exercise categories
  "house.circle.fill": "home-work",
  "sun.horizon.fill": "wb-twilight",
  "face.smiling.fill": "mood",
  "snowflake": "ac-unit",
  
  // Meal & Food
  "camera.fill": "camera-alt",
  "photo.fill": "photo",
  
  // Medication
  "pills.fill": "medication",
  "cross.case.fill": "medical-services",
  
  // Profile & Settings
  "person.fill": "person",
  "person.crop.circle.fill": "account-circle",
  "bell.fill": "notifications",
  "info.circle.fill": "info",
  "questionmark.circle.fill": "help",
  
  // Misc
  "calendar": "calendar-today",
  "clock.fill": "schedule",
  "location.fill": "location-on",
  "sparkles": "auto-awesome",
  "bolt.fill": "bolt",
  "drop.fill": "water-drop",
  "wind": "air",
  "leaf.fill": "eco",
  "brain.head.profile": "psychology",
  "message.fill": "chat",
  "exclamationmark.triangle.fill": "warning",
  "lock.fill": "lock",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",
  "timer": "timer",
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

export type { IconSymbolName };
