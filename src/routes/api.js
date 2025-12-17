const express = require('express');
const router = express.Router();
const { validateChat, validateIngest } = require('../middleware/validation');
const chatController = require('../controllers/chatController');
const historyController = require('../controllers/historyController');
const ingestController = require('../controllers/ingestController');
const { chatLimiter } = require('../middleware/rateLimiter');

// Ingest 
router.post('/ingest', validateIngest, (req, res, next) => {
  ingestController.ingest(req, res, next);
});

// Session management
router.post('/session', (req, res, next) => {
  chatController.createSession(req, res, next);
});

// Chat  (apply chatLimiter only here)
router.post('/chat', chatLimiter, validateChat, (req, res, next) => {
  chatController.chat(req, res, next);
});

// History 
router.get('/history/:sessionId', (req, res, next) => {
  historyController.getHistory(req, res, next);
});

// Delete History
router.delete('/history/:sessionId', (req, res, next) => {
  historyController.deleteHistory(req, res, next);
});

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

module.exports = router;
