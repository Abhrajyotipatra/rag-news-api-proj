const axios = require('axios');
const config = require('../config/environment');

class GeminiService {
  constructor() {
    this.apiKey = config.GEMINI_API_KEY;

    this.client = axios.create({
      baseURL: 'https://generativelanguage.googleapis.com/v1beta',
      headers: { 'Content-Type': 'application/json' },
      params: { key: this.apiKey },
    });

    // Use a v1beta-compatible model
    this.model = 'models/gemini-2.5-flash';
  }

  async generateResponse(userQuery, context) {
    try {
      const prompt = `You are a news intelligence assistant. Based on the following retrieved news articles, answer the user's question.

Context from News Database:
${context.map(doc => `- ${doc.title}: ${doc.content}`).join('\n')}

User Question: ${userQuery}

Provide a comprehensive, factual answer based only on the provided context. If the context doesn't contain relevant information, say so.`;

      const response = await this.client.post(
        `/${this.model}:generateContent`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }
      );

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error(
        'Error calling Gemini:',
        error.response?.status,
        error.response?.data || error.message
      );
      throw new Error('Failed to generate response');
    }
  }
}

module.exports = new GeminiService();
