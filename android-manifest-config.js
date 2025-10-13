// This file provides additional Android configuration to fix hardware bitmap issues
export default {
    android: {
        // Force software rendering to avoid hardware bitmap issues
        config: {
            hardwareAccelerated: false,
            softwareRendering: true,
            // Additional Android-specific settings
            android: {
                hardwareAccelerated: false,
                largeHeap: true,
                // Force software rendering for all components
                renderToHardwareTextureAndroid: false,
                shouldRasterizeIOS: false,
            },
        },
        // Comprehensive manifest configuration
        manifest: {
            application: {
                android: {
                    hardwareAccelerated: false,
                    largeHeap: true,
                    // Disable hardware acceleration for all activities
                    activities: [
                        {
                            name: '.MainActivity',
                            android: {
                                hardwareAccelerated: false,
                                configChanges: 'orientation|keyboardHidden|screenSize',
                                // Force software rendering
                                renderToHardwareTextureAndroid: false,
                                shouldRasterizeIOS: false,
                            },
                        },
                    ],
                },
            },
        },
    },
};

