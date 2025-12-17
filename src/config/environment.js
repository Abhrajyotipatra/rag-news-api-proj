require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Database
  DB: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'rag_news_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',
  },
  
  // Redis
  REDIS: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  },
  
  // APIs
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  JINA_API_KEY: process.env.JINA_API_KEY,
  
  // Vector DB
  CHROMA_URL: process.env.CHROMA_URL || 'http://localhost:8000',
};
