import express from 'express';
import { createReview, getTaskerReviews } from '../Controllers/Reviews.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('hirer'), createReview);
router.get('/tasker/:taskerId', getTaskerReviews);

export default router;
