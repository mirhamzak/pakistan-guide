// This file provides additional Android configuration to fix hardware bitmap issues
export default {
    android: {
        // Add these configurations to your app.config.js or app.json
        config: {
            // Disable hardware acceleration for specific components
            hardwareAccelerated: false,
            // Force software rendering to avoid hardware bitmap issues
            softwareRendering: true,
        },
        // Add these to the android section
        manifest: {
            application: {
                // Disable hardware acceleration at the application level
                android: {
                    hardwareAccelerated: false,
                },
                // Add specific activity configurations
                activities: [
                    {
                        name: '.MainActivity',
                        android: {
                            hardwareAccelerated: false,
                            // Force software rendering
                            configChanges: 'orientation|keyboardHidden|screenSize',
                        },
                    },
                ],
            },
        },
    },
};
