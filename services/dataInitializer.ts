import { AppData } from '@/types';

export const initializePakistanGuideData = (): AppData => {
  return {
    generalKnowledge: [
      {
        id: 'gk-1',
        title: 'Pakistan Geography',
        content: 'Pakistan is located in South Asia, bordered by India to the east, Afghanistan and Iran to the west, China to the north, and the Arabian Sea to the south. The country covers an area of 881,913 square kilometers.',
        category: 'geography',
        tags: ['geography', 'location', 'borders', 'area'],
        lastUpdated: '2024-01-01'
      },
      {
        id: 'gk-2',
        title: 'Capital and Major Cities',
        content: 'Islamabad is the capital of Pakistan. Other major cities include Karachi (largest city), Lahore (cultural capital), Faisalabad, Rawalpindi, and Multan.',
        category: 'cities',
        tags: ['capital', 'cities', 'Islamabad', 'Karachi', 'Lahore'],
        lastUpdated: '2024-01-01'
      },
      {
        id: 'gk-3',
        title: 'Population and Demographics',
        content: 'Pakistan has a population of over 240 million people, making it the fifth most populous country in the world. The majority of the population is Muslim (97%), with small minorities of Christians, Hindus, and others.',
        category: 'demographics',
        tags: ['population', 'religion', 'demographics', 'Muslim'],
        lastUpdated: '2024-01-01'
      },
      {
        id: 'gk-4',
        title: 'Official Languages',
        content: 'Urdu is the national language of Pakistan, while English is the official language. Regional languages include Punjabi, Sindhi, Pashto, Balochi, and Saraiki.',
        category: 'language',
        tags: ['Urdu', 'English', 'languages', 'regional'],
        lastUpdated: '2024-01-01'
      },
      {
        id: 'gk-5',
        title: 'Currency and Economy',
        content: 'The Pakistani Rupee (PKR) is the official currency. Pakistan has a mixed economy with agriculture, textiles, and services being major sectors. The country is a member of the World Trade Organization and SAARC.',
        category: 'economy',
        tags: ['currency', 'rupee', 'economy', 'WTO', 'SAARC'],
        lastUpdated: '2024-01-01'
      }
    ],
    emergencyInfo: [
      {
        id: 'emergency-1',
        title: 'Police Emergency',
        description: 'Call 15 for police emergency services. This number works nationwide for reporting crimes, accidents, and other police-related emergencies.',
        phoneNumber: '15',
        category: 'police',
        priority: 'high',
        location: 'Nationwide'
      },
      {
        id: 'emergency-2',
        title: 'Medical Emergency',
        description: 'Call 115 for medical emergencies and ambulance services. This connects you to the nearest hospital emergency services.',
        phoneNumber: '115',
        category: 'medical',
        priority: 'high',
        location: 'Nationwide'
      },
      {
        id: 'emergency-3',
        title: 'Fire Emergency',
        description: 'Call 16 for fire department services. This number connects you to the nearest fire station for fire emergencies.',
        phoneNumber: '16',
        category: 'fire',
        priority: 'high',
        location: 'Nationwide'
      },
      {
        id: 'emergency-4',
        title: 'Tourist Helpline',
        description: 'Call 1099 for tourist assistance and information. This helpline provides support for tourists in Pakistan.',
        phoneNumber: '1099',
        category: 'other',
        priority: 'medium',
        location: 'Nationwide'
      },
      {
        id: 'emergency-5',
        title: 'Women Helpline',
        description: 'Call 1094 for women\'s emergency helpline. This service provides support for women in distress.',
        phoneNumber: '1094',
        category: 'other',
        priority: 'high',
        location: 'Nationwide'
      }
    ],
    travelGuidance: [
      {
        id: 'travel-1',
        title: 'Getting Around Pakistan',
        description: 'Pakistan offers various transportation options including domestic flights, trains, buses, and taxis. The Pakistan Railways network connects major cities, while domestic airlines serve all major destinations.',
        category: 'transport',
        location: 'Nationwide',
        coordinates: {
          latitude: 30.3753,
          longitude: 69.3451
        },
        tips: [
          'Book train tickets in advance for long-distance travel',
          'Use reputable taxi services or ride-sharing apps',
          'Check flight schedules as they may change frequently',
          'Carry identification documents when traveling'
        ]
      },
      {
        id: 'travel-2',
        title: 'Accommodation Options',
        description: 'Pakistan offers a range of accommodation from budget guesthouses to luxury hotels. Major cities have international hotel chains, while smaller towns offer local guesthouses and hotels.',
        category: 'accommodation',
        location: 'Major Cities',
        tips: [
          'Book accommodation in advance during peak season',
          'Check online reviews before booking',
          'Confirm reservation details before arrival',
          'Ask about amenities and services included'
        ]
      },
      {
        id: 'travel-3',
        title: 'Safety Tips for Travelers',
        description: 'Pakistan is generally safe for tourists, but it\'s important to follow local customs and take necessary precautions. Avoid traveling to border areas and follow government travel advisories.',
        category: 'safety',
        location: 'Nationwide',
        tips: [
          'Keep copies of important documents',
          'Inform someone about your travel plans',
          'Avoid displaying expensive items',
          'Follow local customs and dress codes',
          'Stay updated with travel advisories'
        ]
      },
      {
        id: 'travel-4',
        title: 'Must-Visit Attractions',
        description: 'Pakistan is home to stunning natural beauty and rich cultural heritage. Key attractions include the Karakoram Highway, Hunza Valley, Lahore Fort, and the ancient city of Mohenjo-daro.',
        category: 'attractions',
        location: 'Various Locations',
        coordinates: {
          latitude: 35.6762,
          longitude: 71.7854
        },
        tips: [
          'Plan visits during appropriate seasons',
          'Check weather conditions for mountain areas',
          'Hire local guides for better experience',
          'Respect local customs and traditions'
        ]
      }
    ],
    languagePhrases: [
      {
        id: 'lang-1',
        english: 'Hello',
        urdu: 'السلام علیکم',
        romanized: 'Assalam-o-Alaikum',
        category: 'greetings',
        difficulty: 'beginner'
      },
      {
        id: 'lang-2',
        english: 'Thank you',
        urdu: 'شکریہ',
        romanized: 'Shukriya',
        category: 'greetings',
        difficulty: 'beginner'
      },
      {
        id: 'lang-3',
        english: 'How are you?',
        urdu: 'آپ کیسے ہیں؟',
        romanized: 'Aap kaise hain?',
        category: 'greetings',
        difficulty: 'beginner'
      },
      {
        id: 'lang-4',
        english: 'Where is the bathroom?',
        urdu: 'باتھ روم کہاں ہے؟',
        romanized: 'Bathroom kahan hai?',
        category: 'directions',
        difficulty: 'intermediate'
      },
      {
        id: 'lang-5',
        english: 'How much does this cost?',
        urdu: 'یہ کتنا ہے؟',
        romanized: 'Yeh kitna hai?',
        category: 'shopping',
        difficulty: 'intermediate'
      },
      {
        id: 'lang-6',
        english: 'I need help',
        urdu: 'مجھے مدد چاہیے',
        romanized: 'Mujhe madad chahiye',
        category: 'emergency',
        difficulty: 'beginner'
      },
      {
        id: 'lang-7',
        english: 'Call the police',
        urdu: 'پولیس کو بلائیں',
        romanized: 'Police ko bulayen',
        category: 'emergency',
        difficulty: 'beginner'
      },
      {
        id: 'lang-8',
        english: 'I don\'t understand',
        urdu: 'مجھے سمجھ نہیں آ رہا',
        romanized: 'Mujhe samajh nahi aa raha',
        category: 'common',
        difficulty: 'beginner'
      },
      {
        id: 'lang-9',
        english: 'What time is it?',
        urdu: 'کتنے بجے ہیں؟',
        romanized: 'Kitne baje hain?',
        category: 'common',
        difficulty: 'intermediate'
      },
      {
        id: 'lang-10',
        english: 'I\'m lost',
        urdu: 'میں کھو گیا ہوں',
        romanized: 'Main kho gaya hun',
        category: 'directions',
        difficulty: 'intermediate'
      }
    ],
    localLaws: [
      {
        id: 'law-1',
        title: 'Traffic Rules and Regulations',
        description: 'Drive on the left side of the road. Speed limits vary by area: 50 km/h in cities, 80 km/h on highways. Seat belts are mandatory for front seat passengers. Mobile phone use while driving is prohibited.',
        category: 'traffic',
        severity: 'fine',
        applicableTo: 'all',
        lastUpdated: '2024-01-01'
      },
      {
        id: 'law-2',
        title: 'Public Behavior and Decorum',
        description: 'Public displays of affection are discouraged. Dress modestly, especially in religious areas. Avoid drinking alcohol in public places. Respect local customs and traditions.',
        category: 'public',
        severity: 'warning',
        applicableTo: 'all',
        lastUpdated: '2024-01-01'
      },
      {
        id: 'law-3',
        title: 'Photography Restrictions',
        description: 'Photography of military installations, government buildings, and certain religious sites is prohibited. Always ask permission before photographing people, especially women.',
        category: 'public',
        severity: 'arrest',
        applicableTo: 'all',
        lastUpdated: '2024-01-01'
      },
      {
        id: 'law-4',
        title: 'Business Hours and Practices',
        description: 'Most businesses operate from 9 AM to 6 PM, with Friday being a half-day in many areas. Government offices are closed on weekends. Banks operate Monday to Friday.',
        category: 'business',
        severity: 'warning',
        applicableTo: 'all',
        lastUpdated: '2024-01-01'
      },
      {
        id: 'law-5',
        title: 'Religious Observances',
        description: 'During Ramadan, eating, drinking, and smoking in public during daylight hours is prohibited for Muslims. Non-Muslims should be respectful and avoid eating in public during this time.',
        category: 'cultural',
        severity: 'warning',
        applicableTo: 'all',
        lastUpdated: '2024-01-01'
      }
    ],
    culturalFacts: [
      {
        id: 'cultural-1',
        title: 'Traditional Greetings',
        description: 'Pakistanis typically greet with "Assalam-o-Alaikum" (Peace be upon you) and respond with "Wa-Alaikum-Salam" (And upon you peace). Handshakes are common, but some conservative Muslims may prefer not to shake hands with the opposite gender.',
        category: 'etiquette',
        region: 'Nationwide',
        importance: 'high',
        relatedFacts: ['cultural-2', 'cultural-3']
      },
      {
        id: 'cultural-2',
        title: 'Dining Etiquette',
        description: 'It is customary to eat with the right hand, especially when eating traditional foods like biryani or naan. Remove shoes before entering someone\'s home. Always accept tea when offered, as it is a sign of hospitality.',
        category: 'etiquette',
        region: 'Nationwide',
        importance: 'high',
        relatedFacts: ['cultural-1', 'cultural-4']
      },
      {
        id: 'cultural-3',
        title: 'Religious Observances',
        description: 'Pakistan is an Islamic republic, and Islamic practices are deeply embedded in daily life. Friday is the holy day, and many businesses close for Friday prayers. During Ramadan, the pace of life changes significantly.',
        category: 'religion',
        region: 'Nationwide',
        importance: 'high',
        relatedFacts: ['cultural-1', 'cultural-5']
      },
      {
        id: 'cultural-4',
        title: 'Traditional Cuisine',
        description: 'Pakistani cuisine is rich and diverse, featuring dishes like biryani, karahi, nihari, and various types of bread (naan, roti, paratha). Spices are used generously, and meals are often shared family-style.',
        category: 'food',
        region: 'Nationwide',
        importance: 'medium',
        relatedFacts: ['cultural-2']
      },
      {
        id: 'cultural-5',
        title: 'Festivals and Celebrations',
        description: 'Major Islamic festivals include Eid-ul-Fitr (end of Ramadan) and Eid-ul-Adha (Festival of Sacrifice). Other important occasions include Pakistan Day (March 23) and Independence Day (August 14).',
        category: 'festivals',
        region: 'Nationwide',
        importance: 'high',
        relatedFacts: ['cultural-3']
      },
      {
        id: 'cultural-6',
        title: 'Family Values',
        description: 'Family is central to Pakistani culture. Extended families often live together or maintain close relationships. Elders are highly respected, and their advice is sought in important decisions.',
        category: 'traditions',
        region: 'Nationwide',
        importance: 'high',
        relatedFacts: ['cultural-2', 'cultural-7']
      },
      {
        id: 'cultural-7',
        title: 'Hospitality Traditions',
        description: 'Pakistanis are known for their hospitality. Guests are treated with great respect and offered the best food and accommodations available. It is considered impolite to refuse hospitality.',
        category: 'traditions',
        region: 'Nationwide',
        importance: 'high',
        relatedFacts: ['cultural-2', 'cultural-6']
      }
    ],
    bookmarks: [],
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
  };
};
