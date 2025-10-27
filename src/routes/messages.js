const { Router } = require('express');
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

const router = Router();

// Send message
router.post('/', auth, messageController.sendMessage);

// Get messages for a conversation
router.get('/:conversationId', auth, messageController.getMessages);

// List all conversations for user
router.get('/conversations/all', auth, messageController.getConversations);

module.exports = router;
