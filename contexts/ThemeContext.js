import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

const ThemeContext = createContext(undefined);

const THEME_STORAGE_KEY = 'pakistan_guide_theme_mode';

export function ThemeProvider({ children }) {
    const deviceColorScheme = useDeviceColorScheme();
    const [themeMode, setThemeModeState] = useState('system');
    const [theme, setTheme] = useState('light');

    // Load saved theme mode on app start
    useEffect(() => {
        loadThemeMode();
    }, []);

    // Update theme when device color scheme or theme mode changes
    useEffect(() => {
        if (themeMode === 'system') {
            setTheme(deviceColorScheme === 'dark' ? 'dark' : 'light');
        } else {
            setTheme(themeMode);
        }
    }, [themeMode, deviceColorScheme]);

    const loadThemeMode = async () => {
        try {
            const savedThemeMode = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedThemeMode && ['light', 'dark', 'system'].includes(savedThemeMode)) {
                setThemeModeState(savedThemeMode);
            }
        } catch (error) {
            console.error('Failed to load theme mode:', error);
        }
    };

    const setThemeMode = async (mode) => {
        try {
            setThemeModeState(mode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (error) {
            console.error('Failed to save theme mode:', error);
        }
    };

    const toggleTheme = () => {
        if (themeMode === 'system') {
            setThemeMode(deviceColorScheme === 'dark' ? 'light' : 'dark');
        } else {
            setThemeMode(theme === 'dark' ? 'light' : 'dark');
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                themeMode,
                setThemeMode,
                toggleTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
