import bcrypt from 'bcryptjs';
import Admin from '../Models/Admin.js';
import Tasker from '../Models/Tasker.js';
import Hirer from '../Models/User.js';
import Job from '../Models/Jobs.js';
import { signToken } from '../middleware/auth.js';

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
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
      message: 'Admin login successful',
      token,
      user: { id: admin._id, fullName: admin.fullName, email: admin.email, role: 'admin' },
    });
  } catch (error) {
    console.error('adminLogin Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPendingTaskers = async (req, res) => {
  try {
    const taskers = await Tasker.find({ isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: taskers.length, taskers });
  } catch (error) {
    console.error('getPendingTaskers Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const approveTasker = async (req, res) => {
  try {
    const tasker = await Tasker.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    ).select('-password');
    if (!tasker) {
      return res.status(404).json({ success: false, message: 'Tasker not found' });
    }
    return res.status(200).json({ success: true, message: 'Tasker approved', tasker });
  } catch (error) {
    console.error('approveTasker Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rejectTasker = async (req, res) => {
  try {
    const tasker = await Tasker.findByIdAndDelete(req.params.id);
    if (!tasker) {
      return res.status(404).json({ success: false, message: 'Tasker not found' });
    }
    return res.status(200).json({ success: true, message: 'Tasker application rejected' });
  } catch (error) {
    console.error('rejectTasker Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getStats = async (req, res) => {
  try {
    const [hirerCount, taskerCount, jobCount, completedJobs, pendingTaskers, revenue] = await Promise.all([
      Hirer.countDocuments(),
      Tasker.countDocuments({ isApproved: true }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'completed' }),
      Tasker.countDocuments({ isApproved: false }),
      Job.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        hirers: hirerCount,
        taskers: taskerCount,
        totalJobs: jobCount,
        completedJobs,
        pendingTaskers,
        totalRevenue: revenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error('getStats Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [hirers, taskers] = await Promise.all([
      Hirer.find().select('-password').sort({ createdAt: -1 }),
      Tasker.find().select('-password').sort({ createdAt: -1 }),
    ]);
    return res.status(200).json({ success: true, hirers, taskers });
  } catch (error) {
    console.error('getAllUsers Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { adminLogin, getPendingTaskers, approveTasker, rejectTasker, getStats, getAllUsers };
