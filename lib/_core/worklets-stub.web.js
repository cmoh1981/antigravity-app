// Stub for react-native-worklets on web platform
// This file prevents worklets from being used on web where they're not supported

// Export empty stub functions
export const createWorkletRuntime = () => ({});
export const runOnUI = (fn) => fn;
export const runOnJS = (fn) => fn;
export const createSharedValue = (value) => ({ value });
export const useSharedValue = (initial) => ({ value: initial });
export const useDerivedValue = (fn) => ({ value: fn() });
export const useAnimatedStyle = (fn) => fn();
export const withTiming = (value) => value;
export const withSpring = (value) => value;
export const withDecay = (value) => value;
export const Extrapolate = {};
export const interpolate = (value, input, output) => value;

// Default export
export default {
  createWorkletRuntime,
  runOnUI,
  runOnJS,
  createSharedValue,
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDecay,
  Extrapolate,
  interpolate,
};
