# Pakistan Guide

A comprehensive offline mobile application providing essential information about Pakistan for travelers, residents, and anyone interested in learning about the country.

## Features

### 🏠 Home Dashboard
- Quick access to all app features
- Data initialization status
- Search functionality
- Feature overview

### 📚 General Knowledge
- Pakistan geography and demographics
- Major cities and capitals
- Official languages and currency
- Economic information
- Categorized content with search and filtering

### 🚨 Emergency Information
- Quick access to emergency numbers
- Police, medical, fire, and other emergency contacts
- Priority-based organization
- One-tap calling functionality
- Tourist and women helplines

### ✈️ Travel Guidance
- Transportation options and tips
- Accommodation recommendations
- Safety guidelines
- Must-visit attractions
- Location-based information with coordinates

### 🗣️ Language Phrases
- Essential Urdu phrases for travelers
- English, Urdu, and romanized text
- Categorized by use case (greetings, emergency, shopping, etc.)
- Difficulty levels (beginner, intermediate, advanced)
- Audio support ready

### ⚖️ Local Laws
- Traffic rules and regulations
- Public behavior guidelines
- Photography restrictions
- Business hours and practices
- Religious observances
- Severity indicators and applicability

### ❤️ Cultural Facts
- Traditional greetings and etiquette
- Religious observances
- Festivals and celebrations
- Family values and hospitality
- Regional information
- Importance levels and related facts

### 🔍 Search & Bookmarks
- Global search across all content
- Relevance-based results
- Bookmark favorite items
- Category filtering
- Offline search functionality

## Technical Features

### 📱 Offline-First Design
- Works completely offline after initial setup
- AsyncStorage for data persistence
- SQLite for efficient querying
- No internet connection required

### 🔄 Data Management
- Automatic data initialization on first launch
- Efficient storage with SQLite database
- Search indexing for fast queries
- Bookmark management system

### 🎨 Modern UI/UX
- Clean, intuitive interface
- Category-based navigation
- Search and filtering capabilities
- Responsive design
- Dark/light mode support

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. **First Launch**: Initialize the app data by tapping "Initialize" on the home screen
2. **Navigation**: Use the bottom tabs to access different sections
3. **Search**: Tap the search icon on the home screen to search across all content
4. **Bookmarks**: Save important items for quick access
5. **Emergency**: Quick access to emergency contacts with one-tap calling

## Data Structure

The app includes comprehensive information about:

- **General Knowledge**: 5+ articles covering geography, demographics, and basic facts
- **Emergency Info**: 5+ emergency contacts with priority levels
- **Travel Guidance**: 4+ travel tips covering transportation, accommodation, and safety
- **Language Phrases**: 10+ essential Urdu phrases with pronunciation
- **Local Laws**: 5+ important laws and regulations
- **Cultural Facts**: 7+ cultural insights and traditions

## Technology Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **AsyncStorage** for data persistence
- **SQLite** for efficient querying
- **Expo Router** for navigation
- **React Native Reanimated** for animations

## Contributing

This app is designed to be easily extensible. To add new content:

1. Update the data initializer with new content
2. Add appropriate types in the types file
3. Update the storage service if needed
4. Test the offline functionality

## License

This project is for educational and informational purposes. Please ensure all content is accurate and up-to-date for your specific use case.

## Support

For issues or questions, please check the app's built-in help sections or refer to the emergency contacts for immediate assistance.