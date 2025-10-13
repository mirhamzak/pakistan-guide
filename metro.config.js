const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add image optimization
config.resolver.assetExts.push(
    // Images
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico'
);

// Configure transformer for better image handling
config.transformer.minifierConfig = {
    keep_fnames: true,
    mangle: {
        keep_fnames: true,
    },
};

module.exports = config;
