module.exports = function (api) {
  // Get caller info before caching
  const callerPlatform = api.caller((caller) => caller?.platform);
  api.cache(true);
  
  let plugins = [];

  // Only add worklets plugin for native platforms (iOS/Android), NOT for web
  const isNative = callerPlatform === 'android' || callerPlatform === 'ios';
  if (isNative) {
    plugins.push("react-native-worklets/plugin");
  }

  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins,
  };
};
