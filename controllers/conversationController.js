import { createConversationChain } from '../langchain/chains/conversation.js';
import Logger from '../middleware/logger.js';
import mongoose from 'mongoose';

// Create a single instance of the conversation chain
const conversationChain = createConversationChain();

export const chat = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    
    if (!message || !sessionId) {
      return res.status(400).json({ 
        error: 'Message and sessionId are required' 
      });
    }
    
    Logger.info(`Processing chat request for session: ${sessionId}`);
    
    // Get response from the conversation chain
    const { message: responseMessage, metadata } = await conversationChain.getResponse(message, sessionId);
    
    // Return the response with metadata
    res.json({
      message: responseMessage,
      metadata
    });
  } catch (error) {
    Logger.error('Error in chat endpoint:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong processing your request'
    });
  }
};

// No streaming endpoint for now as requested

export const reset = async (req, res) => {
  try {
    const { sessionId } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ 
        error: 'SessionId is required' 
      });
    }
    
    Logger.info(`Resetting conversation for session: ${sessionId}`);
    
    // Reset the conversation in the database
    const result = await conversationChain.resetConversation(sessionId);
    
    res.json({ 
      success: true, 
      message: 'Conversation reset successfully'
    });
  } catch (error) {
    Logger.error('Error in reset endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};

export const status = async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    // Get conversation from MongoDB
    const conversation = await mongoose.model("Conversation").findOne({ sessionId });
    
    if (conversation) {
      // Return conversation details
      res.json({ 
        exists: true, 
        stage: conversation.stage,
        messagesCount: conversation.messages.length,
        detectedSymptoms: conversation.detectedSymptoms,
        lastUpdated: conversation.updatedAt
      });
    } else {
      res.json({ 
        exists: false, 
        message: 'No conversation found for this session' 
      });
    }
  } catch (error) {
    Logger.error('Error in status endpoint:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};
