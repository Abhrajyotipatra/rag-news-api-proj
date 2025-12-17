const pool = require('../config/database');
const redisClient = require('../config/redis');
const ragService = require('../services/ragService');
const { randomUUID } = require('crypto');

class ChatController {
  async chat(req, res, next) {
    const startTime = Date.now();
    let responseSent = false; 

    try {
      const { sessionId, query } = req.validatedData;

      console.log(` Chat request - Session: ${sessionId}, Query: "${query}"`);

      try {
        const cachedContext = await redisClient.get(`session:${sessionId}`);
        if (cachedContext) {
          console.log(` Cache hit for session: ${sessionId}`);
        }
      } catch (cacheError) {
        console.warn(' Redis cache error:', cacheError.message);
      }

      const result = await ragService.answerQuery(sessionId, query, 5);

      const responseTime = Date.now() - startTime;

      try {
        const dbResult = await pool.query(
          `INSERT INTO chat_logs (session_id, user_query, llm_response, response_time_ms)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [sessionId, query, result.answer, responseTime]
        );
        console.log(` Chat logged to database (ID: ${dbResult.rows[0].id})`);
      } catch (dbError) {
        console.error(' Database insert error:', dbError.message);
        
      }

      try {
        await redisClient.setEx(
          `session:${sessionId}`,
          3600, // 1 hour TTL
          JSON.stringify({
            lastQuery: query,
            lastResponse: result.answer,
            timestamp: new Date(),
          })
        );
        console.log(`Cache updated for session: ${sessionId}`);
      } catch (cacheError) {
        console.warn(' Redis cache update error:', cacheError.message);
      }

      try {
        await pool.query(
          `UPDATE chat_sessions SET last_activity = CURRENT_TIMESTAMP 
           WHERE session_id = $1`,
          [sessionId]
        );
      } catch (updateError) {
        console.warn('  Session update error:', updateError.message);
      }

      // Send response ONLY ONCE
      if (!responseSent) {
        responseSent = true;
        res.status(200).json({
          success: true,
          sessionId,
          query,
          answer: result.answer,
          sources: result.sources.slice(0, 3), 
          responseTime: `${responseTime}ms`,
          responseTimeMs: responseTime,
        });
      }
    } catch (error) {
      console.error('Chat error:', error.message);
      if (!responseSent) {
        next(error);
      }
    }
  }

  async createSession(req, res, next) {
    try {
      const sessionId = randomUUID();

      console.log(`Creating new session: ${sessionId}`);

      await pool.query(
        `INSERT INTO chat_sessions (session_id) VALUES ($1)`,
        [sessionId]
      );

      console.log(`Session created successfully`);

      res.status(201).json({
        success: true,
        sessionId,
        message: 'Session created successfully',
      });
    } catch (error) {
      console.error('Session creation error:', error.message);
      next(error);
    }
  }
}

module.exports = new ChatController();
