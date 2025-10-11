import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, TAB_BAR_HEIGHT } from '@/constants/colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useScrollDetection } from '@/hooks/useScrollDetection';
import { storageService } from '@/services/storage';
import { CulturalFact } from '@/types';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function CulturalFactsScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const { handleScroll, resetScrollPosition } = useScrollDetection();
  const [culturalFacts, setCulturalFacts] = useState<CulturalFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadCulturalFacts();
    return () => {
      resetScrollPosition();
    };
  }, [resetScrollPosition]);

  const loadCulturalFacts = async () => {
    try {
      setLoading(true);
      const data = await storageService.getAppData();
      if (data?.culturalFacts) {
        setCulturalFacts(data.culturalFacts);
      }
    } catch (error) {
      console.error('Failed to load cultural facts:', error);
      Alert.alert('Error', 'Failed to load cultural facts data');
    } finally {
      setLoading(false);
    }
  };

  const handleItemPress = (item: CulturalFact) => {
    router.push({
      pathname: '../content-detail',
      params: {
        type: 'cultural',
        id: item.id,
        title: item.title,
        content: item.description,
        category: item.category,
        region: item.region || '',
        importance: item.importance,
        relatedFacts: item.relatedFacts?.join(',') || ''
      }
    } as any);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'traditions':
        return 'heart.fill';
      case 'festivals':
        return 'party.popper.fill';
      case 'etiquette':
        return 'person.bow';
      case 'history':
        return 'book.closed.fill';
      case 'religion':
        return 'building.columns.fill';
      case 'food':
        return 'fork.knife';
      default:
        return 'heart.fill';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'traditions':
        return colors.cultural;
      case 'festivals':
        return colors.fire;
      case 'etiquette':
        return colors.tint;
      case 'history':
        return colors.general;
      case 'religion':
        return colors.law;
      case 'food':
        return colors.travel;
      default:
        return colors.textSecondary;
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return colors.emergency;
      case 'medium':
        return colors.fire;
      case 'low':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'exclamationmark.circle.fill';
      case 'medium':
        return 'info.circle.fill';
      case 'low':
        return 'circle.fill';
      default:
        return 'circle.fill';
    }
  };

  // Get unique categories
  const categories = Array.from(new Set(culturalFacts.map(item => item.category)));

  // Filter facts by selected category
  const filteredFacts = selectedCategory
    ? culturalFacts.filter(item => item.category === selectedCategory)
    : culturalFacts;

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
          <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            <ThemedView style={styles.loadingContainer}>
              <IconSymbol name="heart.fill" size={48} color={colors.cultural} />
              <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
                Loading Cultural Facts...
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <ThemedView style={[styles.header, { backgroundColor: colors.cardHeader }]}>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.surface }]}
              onPress={() => router.back()}
            >
              <IconSymbol name="chevron.left" size={24} color={colors.tint} />
            </TouchableOpacity>
            <ThemedView style={[styles.headerContent, { backgroundColor: colors.cardHeader }]}>
              <ThemedText type="title" style={[styles.title, { color: colors.cultural }]}>
                Cultural Facts
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                Learn about Pakistani culture and traditions
              </ThemedText>
            </ThemedView>
          </ThemedView>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {/* Category Filter */}
            <ThemedView style={[styles.categoryFilter, { backgroundColor: colors.background }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    { backgroundColor: selectedCategory === null ? colors.cultural : colors.surface }
                  ]}
                  onPress={() => setSelectedCategory(null)}
                >
                  <ThemedText style={[
                    styles.categoryButtonText,
                    { color: selectedCategory === null ? '#fff' : colors.text }
                  ]}>
                    All
                  </ThemedText>
                </TouchableOpacity>
                {categories.map((category, index) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: selectedCategory === category ? getCategoryColor(category) : colors.surface }
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <ThemedText style={[
                      styles.categoryButtonText,
                      { color: selectedCategory === category ? '#fff' : colors.text }
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ThemedView>

            {/* Quick Stats */}
            <ThemedView style={[styles.statsContainer, { backgroundColor: colors.card }]}>
              <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                <ThemedText style={[styles.statNumber, { color: colors.cultural }]}>
                  {culturalFacts.length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Total Facts
                </ThemedText>
              </ThemedView>
              <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                <ThemedText style={[styles.statNumber, { color: colors.emergency }]}>
                  {culturalFacts.filter(f => f.importance === 'high').length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  High Importance
                </ThemedText>
              </ThemedView>
              <ThemedView style={[styles.statItem, { backgroundColor: colors.card }]}>
                <ThemedText style={[styles.statNumber, { color: colors.travel }]}>
                  {categories.length}
                </ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Categories
                </ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Cultural Facts List */}
            <ThemedView style={[styles.contentContainer, { backgroundColor: colors.background }]}>
              {filteredFacts.map((fact, index) => (
                <TouchableOpacity
                  key={fact.id}
                  style={[styles.factCard, { backgroundColor: colors.card }]}
                  onPress={() => handleItemPress(fact)}
                >
                  <ThemedView style={[styles.factIconContainer, { backgroundColor: `${getCategoryColor(fact.category)}15` }]}>
                    <IconSymbol
                      name={getCategoryIcon(fact.category) as any}
                      size={20}
                      color={getCategoryColor(fact.category)}
                    />
                  </ThemedView>
                  <ThemedView style={[styles.factContent, { backgroundColor: colors.card }]}>
                    <ThemedView style={[styles.factHeader, { backgroundColor: colors.card }]}>
                      <ThemedText style={[styles.factTitle, { color: colors.text }]}>
                        {fact.title}
                      </ThemedText>
                      <ThemedView style={[styles.importanceBadge, { backgroundColor: getImportanceColor(fact.importance) }]}>
                        <IconSymbol
                          name={getImportanceIcon(fact.importance) as any}
                          size={12}
                          color="#fff"
                        />
                        <ThemedText style={styles.importanceText}>
                          {fact.importance.toUpperCase()}
                        </ThemedText>
                      </ThemedView>
                    </ThemedView>
                    <ThemedText style={[styles.factDescription, { color: colors.textSecondary }]}>
                      {fact.description.length > 120 ? `${fact.description.substring(0, 120)}...` : fact.description}
                    </ThemedText>
                    <ThemedView style={[styles.factFooter, { backgroundColor: colors.card }]}>
                      <ThemedView style={[styles.categoryTag, { backgroundColor: colors.surface }]}>
                        <ThemedText style={[styles.categoryTagText, { color: colors.textSecondary }]}>
                          {fact.category}
                        </ThemedText>
                      </ThemedView>
                      {fact.region && (
                        <ThemedView style={[styles.regionTag, { backgroundColor: colors.surface }]}>
                          <IconSymbol name="location" size={12} color={colors.textSecondary} />
                          <ThemedText style={[styles.regionText, { color: colors.textSecondary }]}>
                            {fact.region}
                          </ThemedText>
                        </ThemedView>
                      )}
                    </ThemedView>
                  </ThemedView>
                  <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ))}
            </ThemedView>

            {/* Cultural Tips */}
            <ThemedView style={[styles.tipsContainer, { backgroundColor: colors.card }]}>
              <ThemedText type="subtitle" style={[styles.tipsTitle, { color: colors.text }]}>
                Cultural Etiquette Tips
              </ThemedText>
              <ThemedView style={[styles.tipsList, { backgroundColor: colors.card }]}>
                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                  • Always greet with "Assalam-o-Alaikum" when meeting someone
                </ThemedText>
                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                  • Remove shoes before entering someone's home
                </ThemedText>
                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                  • Accept tea when offered as it's a sign of hospitality
                </ThemedText>
                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                  • Dress modestly, especially in religious areas
                </ThemedText>
                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                  • Use your right hand for eating and greeting
                </ThemedText>
                <ThemedText style={[styles.tipItem, { color: colors.textSecondary }]}>
                  • Respect elders and their opinions
                </ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Info Footer */}
            <ThemedView style={[styles.infoContainer, { backgroundColor: colors.card }]}>
              <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
                Tap on any cultural fact to read detailed information. Understanding local culture helps create meaningful connections.
              </ThemedText>
            </ThemedView>
          </ScrollView>
        </ThemedView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  categoryFilter: {
    padding: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 16,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  factIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  factContent: {
    flex: 1,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  factTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  importanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  importanceText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  factDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  factFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  categoryTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  regionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  regionText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  tipsContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipsList: {
    marginLeft: 8,
  },
  tipItem: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
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
});
