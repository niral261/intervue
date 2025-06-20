import express from 'express';
import { getChatMessages, createChatMessage } from '../controller/Chat.js';

const router = express.Router();

router.get('/messages', getChatMessages);
router.post('/messages', createChatMessage);

export default router; 