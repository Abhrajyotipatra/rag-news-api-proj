const embeddingService = require('./embeddingService');
const vectorDbService = require('./vectorDbService');
const geminiService = require('./geminiService');

class RAGService {
  async ingestNewsArticles(articles) {
    try {
      console.log(`Ingesting ${articles.length} articles...`);

      // Generate embeddings for all articles
      const texts = articles.map(a => `${a.title}\n${a.content}`);
      const embeddings = await embeddingService.generateBatchEmbeddings(texts);

      // Combine articles with embeddings
      const documentsWithEmbeddings = articles.map((article, idx) => ({
        ...article,
        embedding: embeddings[idx],
      }));

      // Store in vector database
      const docIds = await vectorDbService.addDocuments(documentsWithEmbeddings);

      console.log(`Successfully ingested ${docIds.length} articles`);
      return docIds;
    } catch (error) {
      console.error('RAG Ingestion error:', error.message);
      throw error;
    }
  }

  async answerQuery(sessionId, userQuery, topK = 5) {
    const startTime = Date.now();
    try {
      console.log(`Processing query: "${userQuery}"`);

      //  Generate embedding for user query
      const queryEmbedding = await embeddingService.generateEmbedding(userQuery);

      // Retrieve relevant documents from vector DB
      const relevantDocs = await vectorDbService.queryDocuments(queryEmbedding, topK);
      console.log(`Retrieved ${relevantDocs.length} relevant documents`);

      //  Generate answer using Gemini with context
      const answer = await geminiService.generateResponse(userQuery, relevantDocs);

      const responseTimeMs = Date.now() - startTime;

      return {
        answer,
        sources: relevantDocs,
        retrievedCount: relevantDocs.length,
        responseTimeMs,
      };
    } catch (error) {
      console.error('RAG query error:', error.message);
      throw error;
    }
  }
}

module.exports = new RAGService();
