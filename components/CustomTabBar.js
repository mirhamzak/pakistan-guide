import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/colors';
import { useTabBar } from '@/contexts/TabBarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

const tabs = [
    {
        name: 'index',
        title: 'Home',
        icon: 'house.fill',
        focusedIcon: 'house.fill',
        color: '#007AFF',
    },
    {
        name: 'search',
        title: 'Search',
        icon: 'magnifyingglass.circle.fill',
        focusedIcon: 'magnifyingglass.circle.fill',
        color: '#34C759',
    },
    {
        name: 'favourites',
        title: 'Favourites',
        icon: 'bookmark.fill',
        focusedIcon: 'bookmark.fill',
        color: '#FF9500',
    },
    {
        name: 'settings',
        title: 'Settings',
        icon: 'gearshape.fill',
        focusedIcon: 'gearshape.fill',
        color: '#AF52DE',
    },
];

export default function CustomTabBar({ state, descriptors, navigation }) {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const { isCollapsed } = useTabBar();

    const animatedHeight = React.useRef(new Animated.Value(80)).current;
    const animatedOpacity = React.useRef(new Animated.Value(1)).current;
    const animatedWidth = React.useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const targetHeight = isCollapsed ? 50 : 80;
        const targetOpacity = isCollapsed ? 0.7 : 1;
        const targetWidth = isCollapsed ? 0.9 : 1;

        Animated.parallel([
            Animated.timing(animatedHeight, {
                toValue: targetHeight,
                duration: 300,
                useNativeDriver: false, // Use software rendering
            }),
            Animated.timing(animatedOpacity, {
                toValue: targetOpacity,
                duration: 300,
                useNativeDriver: false, // Use software rendering
            }),
            Animated.timing(animatedWidth, {
                toValue: targetWidth,
                duration: 300,
                useNativeDriver: false, // Use software rendering
            }),
        ]).start();
    }, [isCollapsed, animatedHeight, animatedOpacity, animatedWidth]);

    return (
        <Animated.View style={[styles.container, {
            height: animatedHeight
        }]}>
            <Animated.View style={[styles.blurContainer, {
                backgroundColor: colors.blurBackground,
                borderColor: colors.blurBorder,
                transform: [{ scaleX: animatedWidth }]
            }]}>
                {/* Replace BlurView with simple View to avoid hardware bitmap issues */}
                <View style={[styles.blurView, { backgroundColor: colors.blurBackground }]}>
                    <Animated.View style={[styles.tabBar, { opacity: animatedOpacity }]}>
                        {state.routes.map((route, index) => {
                            const { options } = descriptors[route.key];
                            const tab = tabs.find(t => t.name === route.name);
                            const isFocused = state.index === index;

                            const onPress = () => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!isFocused && !event.defaultPrevented) {
                                    navigation.navigate(route.name);
                                }
                            };

                            const onLongPress = () => {
                                navigation.emit({
                                    type: 'tabLongPress',
                                    target: route.key,
                                });
                            };

                            if (!tab) return null;

                            return (
                                <TouchableOpacity
                                    key={route.key}
                                    accessibilityRole="button"
                                    accessibilityState={isFocused ? { selected: true } : {}}
                                    accessibilityLabel={options.tabBarAccessibilityLabel}
                                    testID={options.tabBarTestID}
                                    onPress={onPress}
                                    onLongPress={onLongPress}
                                    style={[styles.tabItem, isCollapsed && styles.tabItemCollapsed]}
                                >
                                    <View>
                                        {isCollapsed ? (
                                            <ThemedText
                                                style={[
                                                    styles.tabText,
                                                    {
                                                        color: isFocused ? colors.tabIconSelected : colors.tabIconDefault,
                                                        fontWeight: isFocused ? '600' : '400'
                                                    }
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {tab.title}
                                            </ThemedText>
                                        ) : (
                                            <MaterialIcons
                                                name={
                                                    tab.name === 'index' ? 'home' :
                                                        tab.name === 'search' ? 'search' :
                                                            tab.name === 'favourites' ? 'bookmark' :
                                                                tab.name === 'settings' ? 'settings' : 'home'
                                                }
                                                size={isFocused ? 28 : 26}
                                                color={isFocused ? colors.tabIconSelected : colors.tabIconDefault}
                                            />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </Animated.View>
                </View>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 7,
        left: 0,
        right: 0,
        justifyContent: 'flex-end',
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 100,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    blurView: {
        flex: 1,
        justifyContent: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabContent: {
        // alignItems: 'center',
        // justifyContent: 'center',
        // paddingVertical: 12,
        // paddingHorizontal: 16,
        // minWidth: 50,
    },
    tabItemCollapsed: {
        minWidth: 35,
    },
    tabContentCollapsed: {
        // paddingVertical: 6,
        // paddingHorizontal: 6,
        minWidth: 35,
        height: 100,
        backgroundColor: 'red',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    tabText: {
        fontSize: 18,
        textAlign: 'center',
    },
    tabTextCollapsed: {
        // fontSize: 14,
        textAlign: 'center',
        // transform: [{ scale: 1 }], // Prevent text from scaling with the container
    },
});
