import express from 'express';
import { getMyNotifications, markRead, markAllRead } from '../Controllers/Notifications.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getMyNotifications);
router.patch('/read-all', authenticate, markAllRead);
router.patch('/:id/read', authenticate, markRead);

export default router;
