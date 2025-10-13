/**
 * @typedef {Object} GeneralKnowledge
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} category
 * @property {string[]} tags
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} EmergencyInfo
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} [phoneNumber]
 * @property {'police' | 'medical' | 'fire' | 'ambulance' | 'other'} category
 * @property {'high' | 'medium' | 'low'} priority
 * @property {string} [location]
 */

/**
 * @typedef {Object} TravelGuidance
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'transport' | 'accommodation' | 'attractions' | 'safety' | 'tips'} category
 * @property {string} location
 * @property {Object} [coordinates]
 * @property {number} coordinates.latitude
 * @property {number} coordinates.longitude
 * @property {string[]} tips
 * @property {string[]} [images]
 */

/**
 * @typedef {Object} LanguagePhrase
 * @property {string} id
 * @property {string} english
 * @property {string} urdu
 * @property {string} romanized
 * @property {'greetings' | 'directions' | 'emergency' | 'shopping' | 'food' | 'transport' | 'common'} category
 * @property {string} [audioUrl]
 * @property {'beginner' | 'intermediate' | 'advanced'} difficulty
 */

/**
 * @typedef {Object} LocalLaw
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'traffic' | 'public' | 'business' | 'cultural' | 'safety'} category
 * @property {'warning' | 'fine' | 'arrest' | 'deportation'} severity
 * @property {'all' | 'tourists' | 'residents' | 'business'} applicableTo
 * @property {string} lastUpdated
 */

/**
 * @typedef {Object} CulturalFact
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'traditions' | 'festivals' | 'etiquette' | 'history' | 'religion' | 'food'} category
 * @property {string} [region]
 * @property {'high' | 'medium' | 'low'} importance
 * @property {string[]} [relatedFacts]
 */

/**
 * @typedef {Object} Bookmark
 * @property {string} id
 * @property {string} itemId
 * @property {'general' | 'emergency' | 'travel' | 'language' | 'law' | 'cultural'} itemType
 * @property {string} title
 * @property {string} createdAt
 */

/**
 * @typedef {Object} SearchResult
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {'general' | 'emergency' | 'travel' | 'language' | 'law' | 'cultural'} type
 * @property {string} category
 * @property {number} relevanceScore
 */

/**
 * @typedef {Object} AppData
 * @property {GeneralKnowledge[]} generalKnowledge
 * @property {EmergencyInfo[]} emergencyInfo
 * @property {TravelGuidance[]} travelGuidance
 * @property {LanguagePhrase[]} languagePhrases
 * @property {LocalLaw[]} localLaws
 * @property {CulturalFact[]} culturalFacts
 * @property {Bookmark[]} bookmarks
 * @property {string} lastUpdated
 * @property {string} version
 */

// Export empty object to make this a valid module
export { };

