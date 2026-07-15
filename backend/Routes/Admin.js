import express from 'express';
import {
  adminLogin, getPendingTaskers, approveTasker,
  rejectTasker, getStats, getAllUsers,
} from '../Controllers/Admin.js';
import { getPendingDeposits } from '../Controllers/Wallet.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/stats', authenticate, authorize('admin'), getStats);
router.get('/financials', authenticate, authorize('admin'), getPendingDeposits);
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.get('/taskers/pending', authenticate, authorize('admin'), getPendingTaskers);
router.patch('/taskers/:id/approve', authenticate, authorize('admin'), approveTasker);
router.delete('/taskers/:id/reject', authenticate, authorize('admin'), rejectTasker);

export default router;
