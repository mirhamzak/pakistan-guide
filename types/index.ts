export interface GeneralKnowledge {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: string;
}

export interface EmergencyInfo {
  id: string;
  title: string;
  description: string;
  phoneNumber?: string;
  category: 'police' | 'medical' | 'fire' | 'ambulance' | 'other';
  priority: 'high' | 'medium' | 'low';
  location?: string;
}

export interface TravelGuidance {
  id: string;
  title: string;
  description: string;
  category: 'transport' | 'accommodation' | 'attractions' | 'safety' | 'tips';
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  tips: string[];
  images?: string[];
}

export interface LanguagePhrase {
  id: string;
  english: string;
  urdu: string;
  romanized: string;
  category: 'greetings' | 'directions' | 'emergency' | 'shopping' | 'food' | 'transport' | 'common';
  audioUrl?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LocalLaw {
  id: string;
  title: string;
  description: string;
  category: 'traffic' | 'public' | 'business' | 'cultural' | 'safety';
  severity: 'warning' | 'fine' | 'arrest' | 'deportation';
  applicableTo: 'all' | 'tourists' | 'residents' | 'business';
  lastUpdated: string;
}

export interface CulturalFact {
  id: string;
  title: string;
  description: string;
  category: 'traditions' | 'festivals' | 'etiquette' | 'history' | 'religion' | 'food';
  region?: string;
  importance: 'high' | 'medium' | 'low';
  relatedFacts?: string[];
}

export interface Bookmark {
  id: string;
  itemId: string;
  itemType: 'general' | 'emergency' | 'travel' | 'language' | 'law' | 'cultural';
  title: string;
  createdAt: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'emergency' | 'travel' | 'language' | 'law' | 'cultural';
  category: string;
  relevanceScore: number;
}

export interface AppData {
  generalKnowledge: GeneralKnowledge[];
  emergencyInfo: EmergencyInfo[];
  travelGuidance: TravelGuidance[];
  languagePhrases: LanguagePhrase[];
  localLaws: LocalLaw[];
  culturalFacts: CulturalFact[];
  bookmarks: Bookmark[];
  lastUpdated: string;
  version: string;
}
