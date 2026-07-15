import express from 'express';
import getUserById, { getMe } from '../Controllers/User.js';
import Hirer from '../Models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/me/profile', authenticate, getMe);
router.get('/:userId', getUserById);

router.put('/:userId', authenticate, authorize('hirer'), async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const allowed = ['fullName', 'email', 'gender', 'age', 'address', 'profilePicture'];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await Hirer.findByIdAndUpdate(req.params.userId, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.status(200).json({ success: true, user });
  } catch {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
