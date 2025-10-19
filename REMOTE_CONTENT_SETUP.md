# Remote Content Management Setup

This guide explains how to set up dynamic content updates for your Pakistan Guide app without requiring app store updates.

## 🎯 Overview

The remote content system allows you to:
- Update content without app store releases
- Validate content integrity
- Cache content for offline use
- Track content usage analytics
- Manage different content versions

## 🚀 Quick Start

### 1. Migrate Your Data

First, migrate your local data to the remote format:

```bash
cd /path/to/pakistan-guide
node scripts/migrateToRemote.js
```

This will create:
- `api-example/content.json` - Your content in API format
- `api-example/API_DOCUMENTATION.md` - API documentation

### 2. Set Up Your API Server

#### Option A: Use the Provided Example

```bash
cd api-example
npm install
npm start
```

#### Option B: Deploy to a Cloud Service

1. Upload the `api-example` folder to your hosting service
2. Install dependencies: `npm install`
3. Start the server: `npm start`

#### Option C: Use Your Own Backend

Implement the API endpoints as documented in `API_DOCUMENTATION.md`.

### 3. Configure Your App

Update the configuration in `config/remoteConfig.js`:

```javascript
export const REMOTE_CONFIG = {
    API_BASE_URL: 'https://your-api-domain.com/api',
    API_KEY: 'your-secure-api-key-here',
    // ... other settings
};
```

### 4. Test the Integration

The app will automatically:
- Check for updates on startup
- Cache content for offline use
- Fallback to local data if remote fails

## 📋 API Endpoints

### Required Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/content/version` | Get version info |
| GET | `/api/content` | Get all content |
| GET | `/api/content/{type}` | Get specific content type |
| POST | `/api/content` | Update all content (admin) |
| POST | `/api/content/{type}` | Update specific type (admin) |

### Authentication

All API endpoints require authentication:
```
Authorization: Bearer your-api-key
```

## 🔧 Configuration Options

### Cache Settings
```javascript
CACHE_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
CACHE_RETRY_ATTEMPTS: 3,
CACHE_RETRY_DELAY: 1000, // 1 second
```

### Update Settings
```javascript
AUTO_CHECK_UPDATES: true,
UPDATE_CHECK_INTERVAL: 60 * 60 * 1000, // 1 hour
FORCE_UPDATE_ON_START: false,
```

### Validation Settings
```javascript
VALIDATE_CONTENT_ON_LOAD: true,
VALIDATE_PHONE_NUMBERS: true,
VALIDATE_COORDINATES: true,
```

## 📱 App Integration

### Using the Content Manager

The app includes a built-in content manager accessible through the settings:

```javascript
import { ContentManager } from '@/components/ContentManager';

// In your settings screen
<ContentManager 
    visible={showContentManager} 
    onClose={() => setShowContentManager(false)} 
/>
```

### Manual Content Updates

```javascript
import { useData } from '@/contexts/DataContext';

const { updateContent, checkForUpdates } = useData();

// Check for updates
const updateInfo = await checkForUpdates();

// Update specific content type
await updateContent('emergency');

// Update all content
await updateContent('all');
```

## 🔍 Content Validation

The system automatically validates:
- Emergency phone numbers
- Travel guidance coordinates
- Content structure integrity
- Required fields presence

### Validation Results

```javascript
const { validateContent } = useData();
const issues = await validateContent();

// Issues will contain:
// - type: content type
// - id: item id
// - field: problematic field
// - value: current value
// - issue: description of the problem
```

## 📊 Analytics and Monitoring

### Content Statistics

```javascript
const { getContentStats } = useData();
const stats = await getContentStats();

// Returns:
// - generalKnowledge: number of items
// - emergencyInfo: number of items
// - travelGuidance: number of items
// - languagePhrases: number of items
// - localLaws: number of items
// - culturalFacts: number of items
// - lastUpdated: timestamp
// - version: current version
```

### Usage Tracking

The system tracks:
- Content access patterns
- Update frequency
- Cache hit rates
- Error rates

## 🛡️ Security Best Practices

### API Security
1. Use HTTPS for all API calls
2. Implement proper API key authentication
3. Rate limit API requests
4. Validate all input data
5. Use environment variables for sensitive data

### Content Security
1. Validate content structure before saving
2. Sanitize user input
3. Implement content versioning
4. Backup content regularly

## 🚨 Troubleshooting

### Common Issues

#### 1. Content Not Updating
- Check API endpoint URL
- Verify API key is correct
- Check network connectivity
- Review cache settings

#### 2. Validation Errors
- Check phone number formats
- Verify coordinate ranges
- Ensure required fields are present
- Review content structure

#### 3. Performance Issues
- Adjust cache timeout
- Optimize content size
- Review retry settings
- Monitor API response times

### Debug Mode

Enable debug logging in development:

```javascript
// In config/remoteConfig.js
DEBUG_MODE: true,
LOG_REQUESTS: true,
LOG_CACHE_HITS: true,
```

## 📈 Scaling Considerations

### For High Traffic
1. Implement CDN for content delivery
2. Use database instead of JSON files
3. Add Redis for caching
4. Implement load balancing

### For Large Content
1. Implement content pagination
2. Use compression for API responses
3. Implement incremental updates
4. Add content compression

## 🔄 Migration Strategy

### Phase 1: Setup
1. Set up API server
2. Migrate existing content
3. Test integration

### Phase 2: Rollout
1. Deploy to staging
2. Test with beta users
3. Monitor performance

### Phase 3: Production
1. Deploy to production
2. Monitor usage
3. Iterate based on feedback

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check debug logs
4. Contact development team

## 🔗 Related Files

- `services/remoteDataService.js` - Main remote data service
- `contexts/DataContext.js` - Updated data context
- `components/ContentManager.js` - Content management UI
- `config/remoteConfig.js` - Configuration settings
- `api-example/` - Example API server
- `scripts/migrateToRemote.js` - Data migration script
