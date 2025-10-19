import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { DataProvider } from '@/contexts/DataContext';
import { TabBarProvider } from '@/contexts/TabBarContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: '(tabs)',
};

function RootLayoutNav() {
    const { theme } = useTheme();
    const colors = Colors[theme];

    useEffect(() => {
        // Hide the splash screen after the app is ready
        const hideSplashScreen = async () => {
            try {
                await SplashScreen.hideAsync();
            } catch (error) {
                console.warn('Error hiding splash screen:', error);
            }
        };

        // Add a small delay to ensure the app is fully loaded
        const timer = setTimeout(hideSplashScreen, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <NavigationThemeProvider value={theme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                </Stack>
                <StatusBar
                    style={theme === 'dark' ? 'light' : 'dark'}
                    backgroundColor={Platform.OS === 'android' ? (theme === 'dark' ? colors.background : '#FFFFFF') : undefined}
                    translucent={Platform.OS === 'android' ? false : undefined}
                />
            </NavigationThemeProvider>
        </View>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <DataProvider>
                    <TabBarProvider>
                        <RootLayoutNav />
                    </TabBarProvider>
                </DataProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
