// API Route handler for AI Doctor conversations
import express from 'express';
import {
  chat,
  reset,
  status
} from '../controllers/conversationController.js';

const router = express.Router();

// Main chat endpoint - no streaming for now
router.post('/chat', chat);

// Reset conversation
router.post('/reset', reset);

// Get conversation status
router.get('/status/:sessionId', status);

export default router;
