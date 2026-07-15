import Tasker from '../Models/Tasker.js';

const SKILL_MAP = {
  plumber:      'Plumbing',
  electrician:  'Electrician',
  cleaning:     'Maid/Cleaning',
  cooking:      'Cooking',
  babysitting:  'Babysitting',
  driver:       'Driver',
  gardening:    'Gardening',
  laundry:      'Laundry',
  carpenter:    'General Maintenance & Repair',
  handyman:     'General Maintenance & Repair',
  painter:      'General Maintenance & Repair',
  ac:           'General Maintenance & Repair',
  geyser:       'Plumbing',
  pest:         'General Maintenance & Repair',
  makeup:       'General Maintenance & Repair',
  eldercare:    'Elder Care',
};

const getTaskers = async (req, res) => {
  try {
    const { service, city, skill } = req.query;
    const filter = { isApproved: true, isActive: true };

    const skillTerm = skill || (service ? SKILL_MAP[service.toLowerCase()] : null);
    if (skillTerm) {
      filter.skills = { $regex: skillTerm, $options: 'i' };
    }
    if (city) {
      filter.$or = [
        { 'address.city': { $regex: city, $options: 'i' } },
        { serviceCities: { $regex: city, $options: 'i' } },
      ];
    }

    const taskers = await Tasker.find(filter)
      .select('-password')
      .sort({ 'rating.average': -1, jobsCount: -1 });

    return res.status(200).json({ success: true, count: taskers.length, taskers });
  } catch (error) {
    console.error('getTaskers Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTaskerById = async (req, res) => {
  try {
    const tasker = await Tasker.findById(req.params.id).select('-password');
    if (!tasker || !tasker.isApproved) {
      return res.status(404).json({ success: false, message: 'Tasker not found' });
    }
    return res.status(200).json({ success: true, tasker });
  } catch (error) {
    console.error('getTaskerById Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateTasker = async (req, res) => {
  try {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const allowed = ['fullName', 'email', 'gender', 'age', 'skills', 'hourlyRate', 'experienceYears', 'languages', 'serviceCities', 'address', 'profilePicture'];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const tasker = await Tasker.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!tasker) {
      return res.status(404).json({ success: false, message: 'Tasker not found' });
    }
    return res.status(200).json({ success: true, tasker });
  } catch (error) {
    console.error('updateTasker Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTaskerStats = async (req, res) => {
  try {
    const taskerId = req.user.id;
    const tasker = await Tasker.findById(taskerId).select('-password');
    if (!tasker) return res.status(404).json({ success: false, message: 'Tasker not found' });

    const Job = (await import('../Models/Jobs.js')).default;
    const jobs = await Job.find({ tasker: taskerId });

    const active = jobs.filter((j) => ['accepted', 'in-progress'].includes(j.status));
    const pending = jobs.filter((j) => j.status === 'pending');
    const completed = jobs.filter((j) => j.status === 'completed');

    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const weeklyJobs = completed.filter((j) => new Date(j.updatedAt) >= weekAgo);
    const weeklyEarnings = weeklyJobs.reduce((s, j) => s + (j.price || 0), 0);

    const upcoming = active
      .filter((j) => new Date(j.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    const recentActivity = jobs
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map((j) => ({
        title: j.title,
        status: j.status,
        amount: j.price,
        date: j.updatedAt,
      }));

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyData = dayNames.map((day, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - d.getDay() + i);
      const dayJobs = completed.filter((j) => {
        const jd = new Date(j.updatedAt);
        return jd.toDateString() === d.toDateString();
      });
      return { day, amount: dayJobs.reduce((s, j) => s + (j.price || 0), 0), hours: dayJobs.length * 2 };
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalEarnings: tasker.totalEarnings,
        jobsCount: tasker.jobsCount,
        rating: tasker.rating,
        activeCount: active.length,
        pendingCount: pending.length,
        completedCount: completed.length,
        weeklyEarnings,
      },
      upcoming,
      recentActivity,
      weeklyData,
      tasker,
    });
  } catch (error) {
    console.error('getTaskerStats Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getSchedule = async (req, res) => {
  try {
    const Job = (await import('../Models/Jobs.js')).default;
    const { date } = req.query;
    const target = date ? new Date(date) : new Date();
    const start = new Date(target); start.setHours(0, 0, 0, 0);
    const end = new Date(target); end.setHours(23, 59, 59, 999);

    const jobs = await Job.find({
      tasker: req.user.id,
      date: { $gte: start, $lte: end },
      status: { $nin: ['cancelled'] },
    })
      .populate('hirer', 'fullName phoneNumber')
      .sort({ date: 1 });

    return res.status(200).json({ success: true, jobs, date: target });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getTaskers, getTaskerById, updateTasker, getTaskerStats, getSchedule, SKILL_MAP };
