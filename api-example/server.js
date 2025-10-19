// Example Node.js/Express server for serving Pakistan Guide content
// This is a basic example - you can adapt this to your preferred backend technology

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Key for authentication (in production, use proper authentication)
const API_KEY = process.env.API_KEY || 'your-secure-api-key-here';

// Middleware to check API key
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers.authorization?.replace('Bearer ', '');
    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    next();
};

// Load content data
let contentData = null;
const loadContentData = () => {
    try {
        const dataPath = path.join(__dirname, 'content.json');
        const data = fs.readFileSync(dataPath, 'utf8');
        contentData = JSON.parse(data);
        console.log('Content data loaded successfully');
    } catch (error) {
        console.error('Failed to load content data:', error);
        // Fallback to default data structure
        contentData = {
            generalKnowledge: [],
            emergencyInfo: [],
            travelGuidance: [],
            languagePhrases: [],
            localLaws: [],
            culturalFacts: [],
            version: '1.0.0',
            lastUpdated: new Date().toISOString()
        };
    }
};

// Load content on startup
loadContentData();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: contentData?.version || '1.0.0'
    });
});

// Get content version info
app.get('/api/content/version', (req, res) => {
    res.json({
        version: contentData.version,
        lastUpdated: contentData.lastUpdated,
        size: JSON.stringify(contentData).length,
        required: false // Set to true for critical updates
    });
});

// Get all content
app.get('/api/content', authenticateApiKey, (req, res) => {
    try {
        res.json({
            ...contentData,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Get specific content type
app.get('/api/content/:type', authenticateApiKey, (req, res) => {
    try {
        const { type } = req.params;
        const typeMap = {
            'general': 'generalKnowledge',
            'emergency': 'emergencyInfo',
            'travel': 'travelGuidance',
            'language': 'languagePhrases',
            'law': 'localLaws',
            'cultural': 'culturalFacts'
        };

        const fieldName = typeMap[type];
        if (!fieldName || !contentData[fieldName]) {
            return res.status(404).json({ error: 'Content type not found' });
        }

        res.json({
            [fieldName]: contentData[fieldName],
            version: contentData.version,
            lastUpdated: contentData.lastUpdated,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch content' });
    }
});

// Update content (admin endpoint)
app.post('/api/content', authenticateApiKey, (req, res) => {
    try {
        const newContent = req.body;
        
        // Validate content structure
        if (!validateContentStructure(newContent)) {
            return res.status(400).json({ error: 'Invalid content structure' });
        }

        // Update content
        contentData = {
            ...newContent,
            lastUpdated: new Date().toISOString()
        };

        // Save to file
        const dataPath = path.join(__dirname, 'content.json');
        fs.writeFileSync(dataPath, JSON.stringify(contentData, null, 2));

        res.json({ 
            success: true, 
            message: 'Content updated successfully',
            version: contentData.version,
            lastUpdated: contentData.lastUpdated
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Update specific content type
app.post('/api/content/:type', authenticateApiKey, (req, res) => {
    try {
        const { type } = req.params;
        const newData = req.body;
        
        const typeMap = {
            'general': 'generalKnowledge',
            'emergency': 'emergencyInfo',
            'travel': 'travelGuidance',
            'language': 'languagePhrases',
            'law': 'localLaws',
            'cultural': 'culturalFacts'
        };

        const fieldName = typeMap[type];
        if (!fieldName) {
            return res.status(404).json({ error: 'Content type not found' });
        }

        // Update specific field
        contentData[fieldName] = newData;
        contentData.lastUpdated = new Date().toISOString();

        // Save to file
        const dataPath = path.join(__dirname, 'content.json');
        fs.writeFileSync(dataPath, JSON.stringify(contentData, null, 2));

        res.json({ 
            success: true, 
            message: `${type} content updated successfully`,
            version: contentData.version,
            lastUpdated: contentData.lastUpdated
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update content' });
    }
});

// Validate content structure
function validateContentStructure(data) {
    const requiredFields = ['generalKnowledge', 'emergencyInfo', 'travelGuidance', 'languagePhrases', 'localLaws', 'culturalFacts'];
    
    if (!data || typeof data !== 'object') {
        return false;
    }

    for (const field of requiredFields) {
        if (!Array.isArray(data[field])) {
            return false;
        }
    }

    return true;
}

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Pakistan Guide API server running on port ${PORT}`);
    console.log(`API Key: ${API_KEY}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
