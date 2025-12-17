const pool = require('../config/database');
const ragService = require('../services/ragService');
const newsData = require('../utils/newsData');

class IngestController {
  async ingest(req, res, next) {
    try {
      const articles = req.validatedData?.articles || newsData;

      // Ingest using RAG service
      const docIds = await ragService.ingestNewsArticles(articles);

      
      for (const article of articles) {
        await pool.query(
          `INSERT INTO ingested_articles (title, content, source) 
           VALUES ($1, $2, $3)
           ON CONFLICT DO NOTHING`,
          [article.title, article.content, article.source]
        );
      }

      res.status(200).json({
        success: true,
        message: `Successfully ingested ${docIds.length} articles`,
        count: docIds.length,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new IngestController();
