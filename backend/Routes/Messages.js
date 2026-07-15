import express from 'express';
import { getConversations, getThread, sendMessage } from '../Controllers/Messages.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', authenticate, getConversations);
router.get('/thread/:partnerId', authenticate, getThread);
router.post('/send', authenticate, sendMessage);

export default router;
