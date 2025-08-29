/**
 * Configuration Service
 * Reads environment variables and provides configuration for different services
 * Uses single .env file approach for simplicity
 */

class ConfigService {
    constructor() {
        // Don't validate immediately - wait for first use
        this.isValidated = false;
    }
    
    /**
     * Ensure configuration is validated before use
     */
    ensureValidated() {
        if (!this.isValidated) {
            this.validateConfig();
            this.isValidated = true;
        }
    }

    /**
     * Get LLM configuration based on environment variables
     * @returns {Object} LLM configuration object
     */
    getLLMConfig() {
        this.ensureValidated();
        const provider = process.env.LLM_PROVIDER;
        
        switch (provider) {
            case 'ollama':
                return {
                    provider: 'ollama',
                    endpoint: process.env.OLLAMA_ENDPOINT,
                    defaultModel: process.env.OLLAMA_MODEL
                };
                
            case 'openai':
                return {
                    provider: 'openai',
                    apiKey: process.env.OPENAI_API_KEY,
                    defaultModel: process.env.OPENAI_MODEL
                };
                
            case 'ubc-llm-sandbox':
                return {
                    provider: 'ubc-llm-sandbox',
                    apiKey: process.env.LLM_API_KEY,
                    endpoint: process.env.LLM_ENDPOINT,
                    defaultModel: process.env.LLM_DEFAULT_MODEL
                };
                
            default:
                throw new Error(`Unsupported LLM provider: ${provider}`);
        }
    }
    
    /**
     * Get server configuration
     * @returns {Object} Server configuration object
     */
    getServerConfig() {
        this.ensureValidated();
        return {
            port: process.env.TLEF_BIOCBOT_PORT || 8080,
            nodeEnv: process.env.NODE_ENV || 'development'
        };
    }
    
    /**
     * Get database configuration
     * @returns {Object} Database configuration object
     */
    getDatabaseConfig() {
        this.ensureValidated();
        return {
            mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/biocbot'
        };
    }
    
    /**
     * Get vector database configuration
     * @returns {Object} Vector database configuration object
     */
    getVectorDBConfig() {
        this.ensureValidated();
        return {
            host: process.env.QDRANT_HOST || 'localhost',
            port: parseInt(process.env.QDRANT_PORT) || 6333
        };
    }
    
    /**
     * Validate that required configuration is present
     * Throws error if configuration is invalid
     */
    validateConfig() {
        // Get provider directly without calling getLLMConfig to avoid circular dependency
        const provider = process.env.LLM_PROVIDER;
        
        // Validate provider-specific requirements
        if (provider === 'ollama') {
            if (!process.env.OLLAMA_ENDPOINT) {
                throw new Error('OLLAMA_ENDPOINT is required for Ollama provider');
            }
            if (!process.env.OLLAMA_MODEL) {
                throw new Error('OLLAMA_MODEL is required for Ollama provider');
            }
        } else if (provider === 'openai') {
            if (!process.env.OPENAI_API_KEY) {
                throw new Error('OPENAI_API_KEY is required for OpenAI provider');
            }
            if (!process.env.OPENAI_MODEL) {
                throw new Error('OPENAI_MODEL is required for OpenAI provider');
            }
        } else if (provider === 'ubc-llm-sandbox') {
            if (!process.env.LLM_API_KEY) {
                throw new Error('LLM_API_KEY is required for UBC LLM Sandbox provider');
            }
            if (!process.env.LLM_ENDPOINT) {
                throw new Error('LLM_ENDPOINT is required for UBC LLM Sandbox provider');
            }
            if (!process.env.LLM_EMBEDDING_MODEL) {
                throw new Error('LLM_EMBEDDING_MODEL is required for UBC LLM Sandbox provider');
            }
        }
        
        console.log(`✅ Configuration validated successfully`);
        console.log(`🤖 LLM Provider: ${provider}`);
        console.log(`🔑 Model: ${process.env.OLLAMA_MODEL || process.env.OPENAI_MODEL || process.env.UBC_MODEL || 'Not specified'}`);
    }
    
    /**
     * Get current environment name
     * @returns {string} Environment name
     */
    getEnvironment() {
        return process.env.NODE_ENV || 'development';
    }
    
    /**
     * Check if running in development mode
     * @returns {boolean} True if development mode
     */
    isDevelopment() {
        return this.getEnvironment() === 'development';
    }
    
    /**
     * Check if running in production mode
     * @returns {boolean} True if production mode
     */
    isProduction() {
        return this.getEnvironment() === 'production';
    }
}

module.exports = new ConfigService(); 