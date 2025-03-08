const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname, {
  // Enable custom resolver options if needed
});

// Add alias for '@' to point to the root directory
config.resolver = {
  ...config.resolver,
  // Use extraNodeModules for aliasing in Metro
  extraNodeModules: {
    '@': path.resolve(__dirname, './'),
  },
  // Ensure .js and other extensions are resolved
  sourceExts: [...config.resolver.sourceExts, 'js', 'cjs', 'ts', 'tsx'],
};

// Export the config with NativeWind applied
module.exports = withNativeWind(config, { input: './global.css' });