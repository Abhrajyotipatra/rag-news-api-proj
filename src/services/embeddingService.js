const axios = require('axios');
const config = require('../config/environment');

class EmbeddingService {
  async generateEmbedding(text) {
    try {
      const response = await axios.post(
        'https://api.jina.ai/v1/embeddings',
        {
          model: 'jina-embeddings-v2-base-en',
          input: [text],
        },
        {
          headers: {
            'Authorization': `Bearer ${config.JINA_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error.message);
      throw new Error('Failed to generate embedding');
    }
  }

  async generateBatchEmbeddings(texts) {
    try {
      const response = await axios.post(
        'https://api.jina.ai/v1/embeddings',
        {
          model: 'jina-embeddings-v2-base-en',
          input: texts,
        },
        {
          headers: {
            'Authorization': `Bearer ${config.JINA_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data.data.map(item => item.embedding);
    } catch (error) {
      console.error('Batch embedding error:', error.message);
      throw new Error('Failed to generate batch embeddings');
    }
  }
}

module.exports = new EmbeddingService();
