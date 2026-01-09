const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Mobile web optimizations
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    compress: {
      // Remove console logs in production
      drop_console: process.env.NODE_ENV === 'production',
    },
  },
};

// Enable inline requires for better performance
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Create empty stub for worklets on web
config.resolver = {
  ...config.resolver,
  resolveRequest: (context, moduleName, platform) => {
    // Stub out worklets for web platform
    if (platform === 'web' && moduleName === 'react-native-worklets') {
      return {
        filePath: path.join(__dirname, 'lib/_core/worklets-stub.web.js'),
        type: 'sourceFile',
      };
    }
    
    // Use default resolver
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});
