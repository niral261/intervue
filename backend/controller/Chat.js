import ChatMessage from '../models/ChatMessage.js';

// Get all chat messages
export const getChatMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.find({}).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new chat message
export const createChatMessage = async (req, res) => {
    try {
        const { user, message } = req.body;
        const chatMessage = new ChatMessage({ user, message });
        await chatMessage.save();
        res.status(201).json(chatMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}; 