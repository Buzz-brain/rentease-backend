const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');

// POST /messages - send message
exports.sendMessage = async function (req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { receiverId, propertyId, content } = req.body;
    if (!receiverId || !content) return res.status(422).json({ error: 'Missing required fields' });


    // Derive a unique conversationId string (propertyId-userId-otherUserId)
    const ids = [String(propertyId || ''), String(req.user._id), String(receiverId)].sort();
    const conversationId = ids.join('-');

    // Find or create conversation by conversationId
    let conversation = await Conversation.findOne({ conversationId });
    if (!conversation) {
      conversation = new Conversation({
        conversationId,
        participants: [req.user._id, receiverId],
        propertyId: propertyId || null,
        unreadCount: 1
      });
      await conversation.save();
    }


    const message = new Message({
      senderId: req.user._id,
      receiverId,
      propertyId: propertyId || null,
      conversationId: conversation._id,
      content,
      read: false
    });
    await message.save();

    // Update conversation lastMessage and unreadCount
    conversation.lastMessage = message._id;
    conversation.unreadCount += 1;
    await conversation.save();

    return res.status(201).json({ message });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /messages/:conversationId - fetch chat history
exports.getMessages = async function (req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { conversationId } = req.params;
    // Find conversation by conversationId (string)
    const conversation = await Conversation.findOne({ conversationId });
    if (!conversation) return res.status(404).json({ error: 'Conversation not found' });
    if (!conversation.participants.map(String).includes(String(req.user._id))) {
      return res.status(403).json({ error: 'Not a participant in this conversation' });
    }
    const messages = await Message.find({ conversationId: conversation._id }).sort({ timestamp: 1 });
    return res.json({ data: messages });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// GET /conversations - list all for user
exports.getConversations = async function (req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    return res.json({ data: conversations });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
