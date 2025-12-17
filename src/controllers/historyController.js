const pool = require('../config/database');

class HistoryController {
  async getHistory(req, res, next) {
    try {
      const { sessionId } = req.params;

      const result = await pool.query(
        `SELECT user_query, llm_response, response_time_ms, created_at 
         FROM chat_logs 
         WHERE session_id = $1 
         ORDER BY created_at DESC`,
        [sessionId]
      );

      res.status(200).json({
        success: true,
        sessionId,
        history: result.rows,
        total: result.rows.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteHistory(req, res, next) {
    try {
      const { sessionId } = req.params;

      await pool.query(
        `DELETE FROM chat_logs WHERE session_id = $1`,
        [sessionId]
      );

      res.status(200).json({
        success: true,
        message: 'History deleted successfully',
        sessionId,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HistoryController();
