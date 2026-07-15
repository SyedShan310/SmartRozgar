import Hirer from '../Models/User.js';
import WalletTransaction from '../Models/WalletTransaction.js';
import Job from '../Models/Jobs.js';

const getWallet = async (req, res) => {
  try {
    const hirer = await Hirer.findById(req.user.id).select('walletBalance totalSpent fullName');
    if (!hirer) return res.status(404).json({ success: false, message: 'User not found' });

    const transactions = await WalletTransaction.find({ hirer: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    return res.status(200).json({
      success: true,
      balance: hirer.walletBalance,
      totalSpent: hirer.totalSpent,
      transactions,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const topUp = async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    const amt = parseInt(amount);
    if (!amt || amt < 100) {
      return res.status(400).json({ success: false, message: 'Minimum top-up is Rs. 100' });
    }

    const hirer = await Hirer.findById(req.user.id);
    if (!hirer) return res.status(404).json({ success: false, message: 'User not found' });

    // Pending until admin verifies receipt (if provided)
    const status = receipt ? 'pending' : 'completed';
    if (status === 'completed') hirer.walletBalance += amt;

    await WalletTransaction.create({
      hirer: req.user.id,
      type: 'credit',
      amount: amt,
      title: 'Wallet Top-up',
      status,
      method: 'topup',
      receipt: receipt || '',
    });

    if (status === 'completed') await hirer.save();

    if (receipt && status === 'pending') {
      const Admin = (await import('../Models/Admin.js')).default;
      const { createNotification } = await import('../utils/jobHelpers.js');
      const admins = await Admin.find().select('_id');
      await Promise.all(admins.map((a) => createNotification({
        userId: a._id,
        userRole: 'admin',
        type: 'payment',
        title: 'Wallet Top-up Pending',
        message: `${hirer.fullName} requested Rs. ${amt} top-up`,
        link: '/financials',
      })));
    }

    return res.status(200).json({
      success: true,
      message: receipt ? 'Top-up submitted for verification' : 'Wallet topped up!',
      balance: hirer.walletBalance,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const verifyTopUp = async (req, res) => {
  try {
    const tx = await WalletTransaction.findById(req.params.txId);
    if (!tx || tx.status !== 'pending') {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    tx.status = 'completed';
    await tx.save();

    const hirer = await Hirer.findById(tx.hirer);
    if (hirer) {
      hirer.walletBalance += tx.amount;
      await hirer.save();
    }

    return res.status(200).json({ success: true, message: 'Top-up verified' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPendingDeposits = async (req, res) => {
  try {
    const pending = await WalletTransaction.find({ status: 'pending', type: 'credit' })
      .populate('hirer', 'fullName phoneNumber email')
      .sort({ createdAt: -1 });

    const jobDeposits = await Job.find({
      paymentStatus: { $in: ['unverified', 'unpaid'] },
      price: { $gt: 0 },
    })
      .populate('hirer', 'fullName profilePicture phoneNumber email')
      .populate('tasker', 'fullName')
      .sort({ createdAt: -1 });

    const allWalletTx = await WalletTransaction.find()
      .populate('hirer', 'fullName phoneNumber')
      .sort({ createdAt: -1 })
      .limit(50);

    const paidJobs = await Job.find({ paymentStatus: 'paid', price: { $gt: 0 } })
      .populate('hirer', 'fullName phoneNumber')
      .populate('tasker', 'fullName')
      .sort({ updatedAt: -1 })
      .limit(30);

    const totalPendingAmount = jobDeposits.reduce((s, j) => s + (j.price || 0), 0);
    const totalPaidRevenue = paidJobs.reduce((s, j) => s + (j.price || 0), 0);

    return res.status(200).json({
      success: true,
      walletTopUps: pending,
      jobDeposits,
      allWalletTx,
      paidJobs,
      summary: {
        pendingTopUps: pending.length,
        pendingJobPayments: jobDeposits.length,
        pendingAmount: totalPendingAmount,
        totalRevenue: totalPaidRevenue,
      },
    });
  } catch (error) {
    console.error('getPendingDeposits Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const verifyJobPayment = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Payment already verified' });
    }

    job.paymentStatus = 'paid';
    await job.save();

    // If job already completed, release earnings to tasker now
    if (job.status === 'completed' && job.tasker) {
      const Tasker = (await import('../Models/Tasker.js')).default;
      const tasker = await Tasker.findById(job.tasker);
      if (tasker) {
        tasker.totalEarnings += job.price || 0;
        tasker.jobsCount += 1;
        await tasker.save();
      }
      const hirer = await Hirer.findById(job.hirer);
      if (hirer) {
        hirer.totalSpent += job.price || 0;
        if (!hirer.bookedTasks.includes(job._id)) hirer.bookedTasks.push(job._id);
        await hirer.save();
      }
    }

    return res.status(200).json({ success: true, message: 'Payment verified', job });
  } catch (error) {
    console.error('verifyJobPayment Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getWallet, topUp, verifyTopUp, getPendingDeposits, verifyJobPayment };
