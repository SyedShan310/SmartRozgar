import express from 'express';
import { createTicket, getAllTickets, updateTicket } from '../Controllers/Support.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, createTicket);
router.post('/guest', createTicket);
router.get('/', authenticate, authorize('admin'), getAllTickets);
router.patch('/:id', authenticate, authorize('admin'), updateTicket);

export default router;
