const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname, {
  // Enable custom resolver options
});

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    '@': path.resolve(__dirname, './'),
  },
  sourceExts: [...config.resolver.sourceExts, 'js', 'cjs', 'ts', 'tsx'],
  assetExts: [...config.resolver.assetExts, 'webp', 'png', 'jpg', 'jpeg'], // Explicitly include webp
};

module.exports = withNativeWind(config, { input: './global.css' });