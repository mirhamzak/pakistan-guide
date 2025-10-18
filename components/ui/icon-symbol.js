// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Platform } from 'react-native';

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
    // Tab bar icons
    'house.fill': 'home',
    'house': 'home',
    'magnifyingglass': 'search',
    'magnifyingglass.circle.fill': 'search',
    'bookmark': 'bookmark-border',
    'bookmark.fill': 'bookmark',
    'gearshape': 'settings',
    'gearshape.fill': 'settings',

    // General icons
    'paperplane.fill': 'send',
    'chevron.left.forwardslash.chevron.right': 'code',
    'chevron.right': 'chevron-right',
    'book.fill': 'book',
    'exclamationmark.triangle.fill': 'warning',
    'checkmark.circle.fill': 'check-circle',
    'trash.fill': 'delete',
    'square.and.arrow.up': 'share',
    'bell.fill': 'notifications',
    'moon.fill': 'nightlight-round',
    'sun.max.fill': 'wb-sunny',
    'gear.circle.fill': 'settings',
    'list.bullet': 'format-list-bulleted',
    'square.grid.2x2': 'grid-view',
    'ellipsis.circle.fill': 'more-horiz',
    'simcard.fill': 'sim-card',
    'checkmark.seal.fill': 'verified',
    'car.fill': 'directions-car',
    'creditcard.fill': 'credit-card',
    'airplane.departure': 'flight-takeoff',
    'person.badge.plus.fill': 'person-add',
    'building.2.fill': 'business',
    'graduationcap.fill': 'school',
    'briefcase.fill': 'work',
    'person.crop.circle.fill': 'account-circle',
    'location.fill': 'location-on',
    'location': 'location-on',
    'info.circle.fill': 'info',
    'hand.raised.fill': 'pan-tool',
    'doc.text.fill': 'description',

    // Action icons
    'airplane': 'flight',
    'text.bubble.fill': 'chat-bubble',
    'scale.fill': 'gavel',
    'heart.fill': 'favorite',
    'shield.fill': 'security',
    'cross.fill': 'add',
    'flame.fill': 'local-fire-department',
    'phone.fill': 'phone',
    'xmark': 'close',
    'xmark.circle.fill': 'cancel',
    'clock': 'schedule',

    // Navigation icons
    'chevron.left': 'chevron-left',
    'chevron.down': 'keyboard-arrow-down',
    'chevron.up': 'keyboard-arrow-up',
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
    name,
    size = 24,
    color,
    style,
}) {
    const iconName = MAPPING[name] || 'help-outline'; // fallback to help icon
    return (
        <MaterialIcons
            color={color}
            size={size}
            name={iconName}
            style={[{
                resizeMode: 'contain',
                // Force software rendering for icons to avoid hardware bitmap issues
                ...(Platform.OS === 'android' && {
                    renderToHardwareTextureAndroid: false,
                    shouldRasterizeIOS: false
                })
            }, style]}
        />
    );
}
