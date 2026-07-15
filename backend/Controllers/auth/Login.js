import bcrypt from 'bcryptjs';
import Hirer  from '../../Models/User.js';
import Tasker from '../../Models/Tasker.js';
import Admin  from '../../Models/Admin.js';
import { signToken } from '../../middleware/auth.js';

const login = async (req, res) => {
  try {
    const { phone, password, email, role } = req.body;

    // ── Admin login via email ────────────────────────────────────────────────
    if (role === 'admin' || email) {
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }
      const admin = await Admin.findOne({ email: email.toLowerCase() });
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password' });
      }
      const token = signToken({ id: admin._id, role: 'admin' });
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: admin._id, fullName: admin.fullName, email: admin.email, role: 'admin' },
      });
    }

    // ── 1. Validate input ────────────────────────────────────────────────────
    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and password are required'
      });
    }

    // ── 2. Find user by phone across both collections ────────────────────────
    const hirer  = await Hirer.findOne({ phoneNumber: phone });
    const tasker = await Tasker.findOne({ phoneNumber: phone });

    const user = hirer || tasker;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this phone number'
      });
    }

    // ── 3. Compare password ──────────────────────────────────────────────────
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // ── 4. Block unapproved taskers ──────────────────────────────────────────
    if (tasker && !tasker.isApproved) {
      return res.status(403).json({
        success: false,
        message: 'Your tasker account is pending admin approval'
      });
    }

    // ── 5. Success ───────────────────────────────────────────────────────────
    const token = signToken({ id: user._id, role: user.role });
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id:       user._id,
        fullName: user.fullName,
        phone:    user.phoneNumber,
        email:    user.email || null,
        role:     user.role,
        ...(tasker && { isApproved: tasker.isApproved })
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

export default login;