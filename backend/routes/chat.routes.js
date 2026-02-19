import express from 'express';
import { getMessages, getChatRooms } from '../controllers/chat.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/rooms', authenticate, getChatRooms);
router.get('/messages/:roomId', authenticate, getMessages);

export default router;
