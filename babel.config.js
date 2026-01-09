module.exports = function (api) {
  api.cache(true);
  let plugins = [];

  // Only add worklets plugin for native platforms, not for web
  const platform = process.env.EXPO_PLATFORM || process.env.PLATFORM;
  if (platform !== 'web' && process.env.NODE_ENV !== 'production') {
    plugins.push("react-native-worklets/plugin");
  }

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins,
  };
};
