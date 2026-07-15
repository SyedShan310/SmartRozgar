import express from 'express';
import { getTaskers, getTaskerById, updateTasker, getTaskerStats, getSchedule } from '../Controllers/Tasker.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats/me', authenticate, authorize('tasker'), getTaskerStats);
router.get('/schedule/me', authenticate, authorize('tasker'), getSchedule);
router.get('/', getTaskers);
router.get('/:id', getTaskerById);
router.put('/:id', authenticate, authorize('tasker', 'admin'), updateTasker);

export default router;
