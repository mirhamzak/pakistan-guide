import SearchModal from '@/components/SearchModal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { initializePakistanGuideData } from '@/services/dataInitializer';
import { storageService } from '@/services/storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const router = useRouter();
    const { handleScroll, resetScrollPosition } = useScrollDetection();
    const [isDataInitialized, setIsDataInitialized] = useState(false);
    const [isInitializing, setIsInitializing] = useState(false);
    const [lastSyncDate, setLastSyncDate] = useState(null);
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [isTouristMode, setIsTouristMode] = useState(false);
    const [isGridView, setIsGridView] = useState(false);
    const switchAnimation = useRef(new Animated.Value(0)).current;
    const [isAnimationReady, setIsAnimationReady] = useState(false);
    const [sectionPressCount, setSectionPressCount] = useState(0);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        checkDataInitialization();
        loadBookmarks();
        // Set animation ready after component mounts
        const timer = setTimeout(() => {
            setIsAnimationReady(true);
        }, 100);
        return () => {
            resetScrollPosition();
            clearTimeout(timer);
        };
    }, [resetScrollPosition]);

    // Auto-initialize data if not already initialized
    useEffect(() => {
        if (!isDataInitialized && !isInitializing) {
            initializeData();
        }
    }, [isDataInitialized, isInitializing]);

    const loadBookmarks = async () => {
        try {
            const userBookmarks = await storageService.getBookmarks();
            setBookmarks(userBookmarks);
        } catch (error) {
            console.error('Failed to load bookmarks:', error);
        }
    };

    const checkDataInitialization = async () => {
        try {
            const initialized = await storageService.isDataInitialized();
            setIsDataInitialized(initialized);

            if (initialized) {
                const syncDate = await storageService.getLastSyncDate();
                setLastSyncDate(syncDate);
            }
        } catch (error) {
            console.error('Failed to check data initialization:', error);
        }
    };

    const initializeData = async () => {
        try {
            setIsInitializing(true);
            await storageService.initializeDatabase();

            const data = initializePakistanGuideData();
            await storageService.saveAppData(data);

            setIsDataInitialized(true);
            setLastSyncDate(new Date().toISOString());
            Alert.alert('Success', 'Pakistan Guide data has been initialized successfully!');
        } catch (error) {
            console.error('Failed to initialize data:', error);
            Alert.alert('Error', 'Failed to initialize Pakistan Guide data');
        } finally {
            setIsInitializing(false);
        }
    };

    const contentSections = [
        {
            title: 'General Knowledge',
            description: 'Learn about Pakistan\'s geography, demographics, and basic facts',
            icon: 'book.fill',
            color: colors.general,
            content: 'general',
            route: '../general-knowledge'
        },
        {
            title: 'Emergency Information',
            description: 'Quick access to emergency numbers and contacts',
            icon: 'exclamationmark.triangle.fill',
            color: colors.emergency,
            content: 'emergency',
            route: '../emergency-info'
        },
        {
            title: 'Travel Guidance',
            description: 'Transportation, accommodation, and safety tips',
            icon: 'airplane',
            color: colors.travel,
            content: 'travel',
            route: '../travel-guidance'
        },
        {
            title: 'Language Phrases',
            description: 'Essential Urdu phrases for travelers',
            icon: 'text.bubble.fill',
            color: colors.language,
            content: 'language',
            route: '../language-phrases'
        },
        {
            title: 'Local Laws',
            description: 'Important laws and regulations to know',
            icon: 'scale.fill',
            color: colors.law,
            content: 'laws',
            route: '../local-laws'
        },
        {
            title: 'Cultural Facts',
            description: 'Learn about Pakistani culture and traditions',
            icon: 'heart.fill',
            color: colors.cultural,
            content: 'cultural',
            route: '../cultural-facts'
        }
    ];

    const moreOptions = [
        {
            title: 'Explore All Content',
            description: 'Access all Pakistan Guide sections including general knowledge, travel guidance, language phrases, local laws, cultural facts, and emergency information',
            icon: 'ellipsis.circle.fill',
            color: colors.tint,
            route: '../more'
        }
    ];

    const citizenFeatures = [
        {
            category: 'SIM & Mobile Services',
            items: [
                {
                    title: 'SIMs on CNIC Information',
                    description: 'Check number of SIMs registered on CNIC',
                    icon: 'simcard.fill',
                    color: colors.general,
                    url: 'https://cnic.sims.pk/',
                    type: 'web'
                },
                {
                    title: 'SIM Helpline',
                    description: 'Contact helpline numbers for all mobile networks',
                    icon: 'phone.fill',
                    color: colors.emergency,
                    url: 'sim-helpline',
                    type: 'navigation'
                }
            ]
        },
        {
            category: 'Traffic & Vehicle Services',
            items: [
                {
                    title: 'Check E-Challan',
                    description: 'View and pay traffic violation challans',
                    icon: 'exclamationmark.triangle.fill',
                    color: colors.emergency,
                    url: 'https://echallan.punjabpolice.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'Check Filer Status',
                    description: 'Verify your tax filer status with FBR',
                    icon: 'checkmark.seal.fill',
                    color: colors.general,
                    url: 'https://fbr.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'Vehicle Verification',
                    description: 'Excise & Taxation vehicle verification',
                    icon: 'car.fill',
                    color: colors.travel,
                    url: 'https://excise.punjab.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'Driving License Verification',
                    description: 'Verify driving license authenticity',
                    icon: 'creditcard.fill',
                    color: colors.law,
                    url: 'https://excise.punjab.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'Passport Tracking',
                    description: 'Track your passport application status',
                    icon: 'airplane.departure',
                    color: colors.travel,
                    url: 'https://onlinemrp.dgip.gov.pk/',
                    type: 'web'
                }
            ]
        },
        {
            category: 'Government & Personal Services',
            items: [
                {
                    title: 'BISP / Ehsaas Program',
                    description: 'Check Ehsaas program status and eligibility',
                    icon: 'heart.fill',
                    color: colors.cultural,
                    url: 'https://ehsaas.punjab.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'NADRA ID Renewal',
                    description: 'Smart ID information and renewal services',
                    icon: 'person.badge.plus.fill',
                    color: colors.general,
                    url: 'https://nadra.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'FBR NTN Verification',
                    description: 'Taxpayer verification and NTN status',
                    icon: 'building.2.fill',
                    color: colors.law,
                    url: 'https://fbr.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'Police Character Certificate',
                    description: 'Apply for police character certificate',
                    icon: 'shield.fill',
                    color: colors.emergency,
                    url: 'https://punjabpolice.gov.pk/',
                    type: 'web'
                }
            ]
        },
        {
            category: 'Educational & Career Tools',
            items: [
                {
                    title: 'Board Results',
                    description: 'Check Matric/Inter results from BISE',
                    icon: 'graduationcap.fill',
                    color: colors.general,
                    url: 'https://bise.edu.pk/',
                    type: 'web'
                },
                {
                    title: 'HEC Degree Verification',
                    description: 'Verify university degrees and certificates',
                    icon: 'doc.text.fill',
                    color: colors.language,
                    url: 'https://hec.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'Government Jobs',
                    description: 'Find government job opportunities',
                    icon: 'briefcase.fill',
                    color: colors.travel,
                    url: 'https://nts.org.pk/',
                    type: 'web'
                }
            ]
        },
        {
            category: 'Complaint & Feedback',
            items: [
                {
                    title: 'Citizen Portal',
                    description: 'Pakistan Citizen Portal for complaints',
                    icon: 'person.crop.circle.fill',
                    color: colors.tint,
                    url: 'https://citizenportal.gov.pk/',
                    type: 'web'
                },
                {
                    title: 'Helpline Directory',
                    description: 'Directory of government helpline numbers',
                    icon: 'phone.fill',
                    color: colors.emergency,
                    url: 'tel:1099',
                    type: 'call'
                },
                {
                    title: 'Online FIR Registration',
                    description: 'Register FIR online (province-wise)',
                    icon: 'doc.text.fill',
                    color: colors.law,
                    url: 'https://punjabpolice.gov.pk/',
                    type: 'web'
                }
            ]
        }
    ];

    const quickActions = [
        {
            title: 'Call Police',
            description: 'Emergency: 15',
            icon: 'shield.fill',
            color: colors.emergency,
            phoneNumber: '15'
        },
        {
            title: 'Call Medical',
            description: 'Emergency: 115',
            icon: 'cross.fill',
            color: colors.medical,
            phoneNumber: '115'
        },
        {
            title: 'Call Fire',
            description: 'Emergency: 16',
            icon: 'flame.fill',
            color: colors.fire,
            phoneNumber: '16'
        },
        {
            title: 'Tourist Helpline',
            description: 'Help: 1099',
            icon: 'phone.fill',
            color: colors.tint,
            phoneNumber: '1099'
        }
    ];

    const handleCall = async (phoneNumber, title) => {
        try {
            const url = `tel:${phoneNumber}`;
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot make phone calls on this device');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to make phone call');
        }
    };

    const handleWebLink = async (url, title) => {
        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', `Cannot open ${title}. Please check your internet connection.`);
            }
        } catch (error) {
            Alert.alert('Error', `Failed to open ${title}`);
        }
    };

    const handleSectionPress = async (route) => {
        if (isDataInitialized) {
            // Increment section press count
            const newCount = sectionPressCount + 1;
            setSectionPressCount(newCount);
            
            // Show interstitial ad based on configured frequency
            
            router.push(route);
        } else {
            Alert.alert('Data Required', 'Please initialize the Pakistan Guide data first to access content sections.');
        }
    };

    const handleCitizenFeaturePress = (item) => {
        if (item.type === 'web') {
            handleWebLink(item.url, item.title);
        } else if (item.type === 'call') {
            handleCall(item.url.replace('tel:', ''), item.title);
        } else if (item.type === 'navigation') {
            router.push(item.url);
        }
    };

    const handleSearchResultPress = (result) => {
        // Close the search modal
        setSearchModalVisible(false);

        // Handle different search result types
        if (result.searchType === 'content-section') {
            // Navigate to the content section
            handleSectionPress(result.route);
        } else if (result.searchType === 'citizen-item') {
            // Handle citizen feature press
            handleCitizenFeaturePress(result);
        } else if (result.searchType === 'citizen-category') {
            // For citizen categories, show an alert
            Alert.alert(result.title, result.description);
        }
    };

    const toggleMode = () => {
        const newMode = !isTouristMode;
        setIsTouristMode(newMode);

        // Use software rendering to avoid hardware bitmap issues
        if (isAnimationReady) {
            Animated.timing(switchAnimation, {
                toValue: newMode ? 1 : 0,
                duration: 200,
                useNativeDriver: false, // Use software rendering
            }).start();
        }
    };

    const handleLongPress = (item, type) => {
        console.log('Long press - item:', item); // Debug log
        console.log('Long press - type:', type); // Debug log
        setSelectedItem({ ...item, type });
        setDropdownVisible(true);
    };

    const isBookmarked = (itemId, itemType) => {
        return bookmarks.some(b => b.itemId === itemId && b.itemType === itemType);
    };

    const toggleBookmark = async (item, type) => {
        try {
            console.log('Toggle bookmark - item:', item); // Debug log
            console.log('Toggle bookmark - type:', type); // Debug log
            
            const existingBookmark = bookmarks.find(b => b.itemId === (item.id || item.title) && b.itemType === type);

            if (existingBookmark) {
                await storageService.removeBookmark(existingBookmark.id);
                setBookmarks(bookmarks.filter(b => b.id !== existingBookmark.id));
                Alert.alert('Success', 'Bookmark removed');
            } else {
                const newBookmark = {
                    id: `bookmark-${Date.now()}`,
                    itemId: item.id || item.title,
                    itemType: type,
                    title: item.title,
                    createdAt: new Date().toISOString(),
                    // Store additional info for citizen features
                    ...(item.url && {
                        url: item.url,
                        description: item.description,
                        icon: item.icon,
                        color: item.color
                    })
                };
                
                console.log('Creating bookmark:', newBookmark); // Debug log

                await storageService.addBookmark(newBookmark);
                setBookmarks([...bookmarks, newBookmark]);
                // Alert.alert('Success', 'Bookmark saved');
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            Alert.alert('Error', 'Failed to update bookmark');
        }
        setDropdownVisible(false);
    };

    const closeDropdown = () => {
        setDropdownVisible(false);
        setSelectedItem(null);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader }]}>
                        <ThemedView style={[styles.switchContainer, { backgroundColor: colors.cardHeader }]}>
                            <Animated.View style={[styles.switchWrapper, {
                                backgroundColor: colors.blurBackground,
                                borderColor: colors.blurBorder,
                            }]}>
                                <TouchableOpacity
                                    style={[styles.customSwitch, { backgroundColor: colors.modeSwitch }]}
                                    onPress={toggleMode}
                                    activeOpacity={0.7}
                                >
                                    <Animated.View
                                        style={[
                                            styles.switchThumb,
                                            {
                                                backgroundColor: colors.tint,
                                                transform: [
                                                    {
                                                        translateX: switchAnimation.interpolate({
                                                            inputRange: [0, 1],
                                                            outputRange: [1, 104],
                                                            extrapolate: 'clamp',
                                                        }),
                                                    },
                                                ],
                                            },
                                        ]}
                                    >
                                        <Text style={{ color: isTouristMode ? colors.touristTxt : colors.citizenTxt, fontSize: 15, fontWeight: '600' }}>{isTouristMode ? 'Tourist' : 'Citizen'}</Text>
                                    </Animated.View>
                                    <Text style={{ color: colors.text, position: 'absolute', top: 16, fontSize: 15, fontWeight: '600', left: isTouristMode ? 25 : null, right: isTouristMode ? null : 25 }}>{!isTouristMode ? 'Tourist' : 'Citizen'}</Text>
                                </TouchableOpacity>
                            </Animated.View>
                        </ThemedView>

                        <ThemedView style={[styles.headerContent, { backgroundColor: colors.cardHeader }]}>
                            <ThemedView style={[styles.titleContainer, { backgroundColor: colors.cardHeader }]}>
                                <ThemedText type="title" style={[styles.title, { color: colors.tint }]}>
                                    Pakistan Guide
                                </ThemedText>
                                <ThemedView style={[styles.headerButtons, { backgroundColor: colors.cardHeader }]}>
                                    <TouchableOpacity
                                        style={[styles.headerButton, { backgroundColor: colors.surface }]}
                                        onPress={() => setIsGridView(!isGridView)}
                                    >
                                        <IconSymbol
                                            name={isGridView ? "list.bullet" : "square.grid.2x2"}
                                            size={20}
                                            color={colors.tint}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.headerButton, { backgroundColor: colors.surface }]}
                                        onPress={() => setSearchModalVisible(true)}
                                    >
                                        <IconSymbol name="magnifyingglass" size={20} color={colors.tint} />
                                    </TouchableOpacity>
                                </ThemedView>
                            </ThemedView>
                            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                                {isTouristMode
                                    ? 'Your comprehensive offline guide to Pakistan'
                                    : 'Your local guide to Pakistan'
                                }
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>


                    {/* Dynamic Content Based on Mode */}
                    <ThemedView style={[styles.quickActionsContainer, { backgroundColor: colors.background }]}>
                        {isTouristMode ? (
                            <>
                                <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                                    Content Sections
                                </ThemedText>

                                <ThemedView style={[
                                    styles.sectionsGrid,
                                    { backgroundColor: colors.background },
                                    isGridView && styles.sectionsGridCompact
                                ]}>
                                    {contentSections.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[
                                                isGridView ? styles.sectionCardCompact : styles.sectionCard,
                                                { backgroundColor: colors.card }
                                            ]}
                                            onPress={() => handleSectionPress(item.route)}
                                            onLongPress={() => handleLongPress(item, item.content)}
                                            disabled={!isDataInitialized}
                                        >
                                            <ThemedView style={[
                                                isGridView ? styles.sectionIconContainerCompact : styles.sectionIconContainer,
                                                { backgroundColor: `${item.color}15` }
                                            ]}>
                                                <IconSymbol
                                                    name={item.icon}
                                                    size={isGridView ? 20 : 24}
                                                    color={item.color}
                                                />
                                            </ThemedView>
                                            <ThemedView style={[
                                                isGridView ? styles.sectionContentCompact : styles.sectionContent,
                                                { backgroundColor: colors.card }
                                            ]}>
                                                <ThemedText style={[
                                                    isGridView ? styles.sectionTitleCompact : styles.sectionTitle,
                                                    { color: colors.text }
                                                ]}>
                                                    {item.title}
                                                </ThemedText>
                                                {!isGridView && (
                                                    <ThemedText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                                                        {item.description}
                                                    </ThemedText>
                                                )}
                                            </ThemedView>
                                            {!isGridView && (
                                                <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ThemedView>
                            </>
                        ) : (
                            <>
                                <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                                    Citizen Services
                                </ThemedText>

                                {citizenFeatures.map((category, categoryIndex) => (
                                    <ThemedView key={categoryIndex} style={[styles.categoryContainer, { backgroundColor: colors.background }]}>
                                        <ThemedText style={[styles.categoryTitle, { color: colors.tint }]}>
                                            {category.category}
                                        </ThemedText>
                                        <ThemedView style={[
                                            styles.sectionsGrid,
                                            { backgroundColor: colors.background },
                                            isGridView && styles.sectionsGridCompact
                                        ]}>
                                            {category.items.map((item, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={[
                                                        isGridView ? styles.sectionCardCompact : styles.sectionCard,
                                                        { backgroundColor: colors.card }
                                                    ]}
                                                    onPress={() => handleCitizenFeaturePress(item)}
                                                    onLongPress={() => handleLongPress(item, item.type)}
                                                >
                                                    <ThemedView style={[
                                                        isGridView ? styles.sectionIconContainerCompact : styles.sectionIconContainer,
                                                        { backgroundColor: `${item.color}15` }
                                                    ]}>
                                                        <IconSymbol
                                                            name={item.icon}
                                                            size={isGridView ? 20 : 24}
                                                            color={item.color}
                                                        />
                                                    </ThemedView>
                                                    <ThemedView style={[
                                                        isGridView ? styles.sectionContentCompact : styles.sectionContent,
                                                        { backgroundColor: colors.card }
                                                    ]}>
                                                        <ThemedText style={[
                                                            isGridView ? styles.sectionTitleCompact : styles.sectionTitle,
                                                            { color: colors.text }
                                                        ]}>
                                                            {item.title}
                                                        </ThemedText>
                                                        {!isGridView && (
                                                            <ThemedText style={[styles.sectionDescription, { color: colors.textSecondary }]}>
                                                                {item.description}
                                                            </ThemedText>
                                                        )}
                                                    </ThemedView>
                                                    {!isGridView && (
                                                        <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                                                    )}
                                                </TouchableOpacity>
                                            ))}
                                        </ThemedView>
                                    </ThemedView>
                                ))}
                            </>
                        )}
                    </ThemedView>


                    {/* Quick Emergency Actions */}
                    <ThemedView style={[styles.emergencyContainer, { backgroundColor: colors.background }]}>
                        <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>
                            Quick Emergency Actions
                        </ThemedText>

                        <ThemedView style={[styles.emergencyGrid, { backgroundColor: colors.background }]}>
                            {quickActions.map((action, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.emergencyButton, { backgroundColor: action.color }]}
                                    onPress={() => handleCall(action.phoneNumber, action.title)}
                                >
                                    <IconSymbol name={action.icon} size={20} color="#fff" />
                                    <ThemedText style={styles.emergencyButtonText}>
                                        {action.title}
                                    </ThemedText>
                                </TouchableOpacity>
                            ))}
                        </ThemedView>
                    </ThemedView>


                    {/* App Info */}
                    <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
                        <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                            Pakistan Guide provides comprehensive offline information about Pakistan including general knowledge, emergency contacts, travel guidance, language phrases, local laws, and cultural facts.
                        </ThemedText>
                    </ThemedView>
                </ScrollView>

                {/* Search Modal */}
                <SearchModal
                    visible={searchModalVisible}
                    onClose={() => setSearchModalVisible(false)}
                    homeScreenData={{
                        contentSections,
                        citizenFeatures
                    }}
                    onResultPress={handleSearchResultPress}
                />

                {/* Dropdown Modal */}
                <Modal
                    visible={dropdownVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeDropdown}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={closeDropdown}
                    >
                        <View style={[styles.dropdownContainer, { backgroundColor: colors.card }]}>
                            <ThemedText style={[styles.dropdownTitle, { color: colors.text }]}>
                                {selectedItem?.title}
                            </ThemedText>
                            <TouchableOpacity
                                style={[styles.dropdownItem, { backgroundColor: colors.surface }]}
                                onPress={() => selectedItem && toggleBookmark(selectedItem, selectedItem.type)}
                            >
                                <IconSymbol
                                    name={selectedItem && isBookmarked(selectedItem.id || selectedItem.title, selectedItem.type) ? "bookmark.fill" : "bookmark"}
                                    size={20}
                                    color={selectedItem && isBookmarked(selectedItem.id || selectedItem.title, selectedItem.type) ? "#FF9500" : colors.textSecondary}
                                />
                                <ThemedText style={[styles.dropdownItemText, { color: colors.text }]}>
                                    {selectedItem && isBookmarked(selectedItem.id || selectedItem.title, selectedItem.type) ? 'Remove from Favorites' : 'Add to Favorites'}
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 20,
    },
    switchContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    switchWrapper: {
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    switchBlur: {
        borderRadius: 25,
        overflow: 'hidden',
    },
    customSwitch: {
        width: 220,
        height: 50,
        borderRadius: 25,
        padding: 6,
        position: 'relative',
    },
    switchThumb: {
        width: 104,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 19,
        position: 'absolute',
        top: 6,
        left: 6,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    switchLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height: 38,
        paddingHorizontal: 16,
    },
    switchText: {
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
        flex: 1,
        letterSpacing: 0.3,
    },
    headerContent: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    headerButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerButton: {
        padding: 8,
        borderRadius: 20,
    },
    searchButton: {
        padding: 8,
        borderRadius: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
    },
    quickActionsContainer: {
        padding: 16,
    },
    categoryContainer: {
        marginBottom: 24,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
    },
    sectionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    sectionsGridCompact: {
        justifyContent: 'flex-start',
        gap: 12,
    },
    sectionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionCardCompact: {
        flexDirection: 'column',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        width: '48%',
        minHeight: 100,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    sectionIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sectionIconContainerCompact: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    sectionContent: {
        flex: 1,
    },
    sectionContentCompact: {
        alignItems: 'center',
        flex: 1,
    },
    sectionDescription: {
        fontSize: 14,
    },
    sectionTitleCompact: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 18,
    },
    emergencyContainer: {
        padding: 16,
    },
    emergencyGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    emergencyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginBottom: 8,
        width: '48%',
    },
    emergencyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoContainer: {
        padding: 16,
        margin: 16,
        borderRadius: 12,
        marginBottom: TAB_BAR_HEIGHT,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dropdownContainer: {
        borderRadius: 12,
        padding: 20,
        margin: 20,
        minWidth: 250,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    dropdownTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
    },
    dropdownItemText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
});
