// Configuration for remote data service
// Update these values according to your setup

export const REMOTE_CONFIG = {
    // API Configuration
    API_BASE_URL: 'https://your-api-domain.com/api', // Replace with your actual API URL
    API_KEY: 'your-secure-api-key-here', // Replace with your actual API key
    
    // Cache Configuration
    CACHE_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    CACHE_RETRY_ATTEMPTS: 3,
    CACHE_RETRY_DELAY: 1000, // 1 second
    
    // Update Configuration
    AUTO_CHECK_UPDATES: true, // Automatically check for updates on app start
    UPDATE_CHECK_INTERVAL: 60 * 60 * 1000, // Check for updates every hour
    FORCE_UPDATE_ON_START: false, // Force update check when app starts
    
    // Content Validation
    VALIDATE_CONTENT_ON_LOAD: true, // Validate content when loading
    VALIDATE_PHONE_NUMBERS: true, // Validate emergency phone numbers
    VALIDATE_COORDINATES: true, // Validate travel guidance coordinates
    
    // Fallback Configuration
    FALLBACK_TO_LOCAL: true, // Fallback to local data if remote fails
    SHOW_OFFLINE_MODE: true, // Show offline mode indicator
    
    // Analytics Configuration
    ENABLE_ANALYTICS: true, // Enable usage analytics
    ANALYTICS_ENDPOINT: 'https://your-analytics-domain.com/api/analytics',
    
    // Debug Configuration
    DEBUG_MODE: __DEV__, // Enable debug logging in development
    LOG_REQUESTS: __DEV__, // Log API requests in development
    LOG_CACHE_HITS: __DEV__, // Log cache hits in development
};

// Environment-specific configurations
export const getConfigForEnvironment = (environment) => {
    const baseConfig = { ...REMOTE_CONFIG };
    
    switch (environment) {
        case 'development':
            return {
                ...baseConfig,
                API_BASE_URL: 'http://localhost:3000/api',
                DEBUG_MODE: true,
                LOG_REQUESTS: true,
                CACHE_TIMEOUT: 5 * 60 * 1000, // 5 minutes for development
            };
            
        case 'staging':
            return {
                ...baseConfig,
                API_BASE_URL: 'https://staging-api.your-domain.com/api',
                DEBUG_MODE: true,
                CACHE_TIMEOUT: 10 * 60 * 1000, // 10 minutes for staging
            };
            
        case 'production':
            return {
                ...baseConfig,
                API_BASE_URL: 'https://api.your-domain.com/api',
                DEBUG_MODE: false,
                LOG_REQUESTS: false,
                CACHE_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours for production
            };
            
        default:
            return baseConfig;
    }
};

// Helper function to get current configuration
export const getCurrentConfig = () => {
    // You can determine environment based on your build process
    const environment = __DEV__ ? 'development' : 'production';
    return getConfigForEnvironment(environment);
};
