const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add image optimization
config.resolver.assetExts.push(
    // Images
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'
);

// Configure transformer for better image handling and hardware bitmap compatibility
config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
        keep_fnames: true,
    },
};

// Add Android-specific configuration for better bitmap handling
config.transformer.android = {
    ...config.transformer.android,
    // Force software rendering for certain assets
    assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

module.exports = config;

