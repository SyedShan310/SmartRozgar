import express from 'express';
import { getWallet, topUp, verifyTopUp, getPendingDeposits, verifyJobPayment } from '../Controllers/Wallet.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('hirer'), getWallet);
router.post('/topup', authenticate, authorize('hirer'), topUp);
router.get('/pending', authenticate, authorize('admin'), getPendingDeposits);
router.patch('/verify/:txId', authenticate, authorize('admin'), verifyTopUp);
router.patch('/verify-job/:jobId', authenticate, authorize('admin'), verifyJobPayment);

export default router;
