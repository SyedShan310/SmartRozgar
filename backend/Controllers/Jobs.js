import Job from '../Models/Jobs.js';
import Hirer from '../Models/User.js';
import Tasker from '../Models/Tasker.js';
import { addStatusHistory, notifyJobParties, createNotification } from '../utils/jobHelpers.js';

// ── Create Job ────────────────────────────────────────────────────────────────
const createJob = async (req, res) => {
  try {
    const {
      jobType, title, service, description,
      address, date, hours, price, tasker, paymentScreenshot
    } = req.body;

    const hirerId = req.user?.id || req.body.hirerId;
    if (!hirerId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (req.user?.role && req.user.role !== 'hirer') {
      return res.status(403).json({ success: false, message: 'Only hirers can create jobs' });
    }
    if (!jobType || !['direct', 'public'].includes(jobType)) {
      return res.status(400).json({ success: false, message: "jobType must be 'direct' or 'public'" });
    }
    if (!title || !service || !date) {
      return res.status(400).json({ success: false, message: 'title, service and date are required' });
    }
    if (!address?.city || !address?.pincode) {
      return res.status(400).json({ success: false, message: 'city and pincode are required' });
    }
    if (jobType === 'direct' && !tasker) {
      return res.status(400).json({ success: false, message: 'tasker ID is required for direct jobs' });
    }

    const job = await Job.create({
      hirer:       hirerId,
      tasker:      jobType === 'direct' ? tasker : null,
      jobType, title, service,
      description: description || '',
      address: {
        houseNo: address.houseNo || address.street || '',
        street:  address.street  || '',
        city:    address.city,
        pincode: address.pincode || '00000',
      },
      date:          new Date(date),
      hours:         parseInt(hours) || 1,
      price:         parseInt(price) || 0,
      status:        'pending',
      paymentStatus: paymentScreenshot ? 'unverified' : 'unpaid',
      paymentScreenshots: paymentScreenshot ? [paymentScreenshot] : [],
      statusHistory: [{
        status: 'pending',
        note: jobType === 'direct' ? 'Booking sent to tasker' : 'Job posted publicly',
        by: hirerId,
        role: 'hirer',
        at: new Date(),
      }],
    });

    if (jobType === 'direct' && tasker) {
      await createNotification({
        userId: tasker,
        userRole: 'tasker',
        type: 'job',
        title: 'New Job Request',
        message: `New booking: ${title}`,
        link: '/tasks',
        jobId: job._id,
      });
    }

    if (paymentScreenshot) {
      const Admin = (await import('../Models/Admin.js')).default;
      const admins = await Admin.find().select('_id');
      await Promise.all(admins.map((a) => createNotification({
        userId: a._id,
        userRole: 'admin',
        type: 'payment',
        title: 'Payment Receipt Uploaded',
        message: `${title} — Rs. ${price} awaiting verification`,
        link: '/financials',
        jobId: job._id,
      })));
    }

    return res.status(201).json({
      success: true,
      message: jobType === 'direct' ? 'Job sent to tasker!' : 'Job posted publicly!',
      job
    });

  } catch (error) {
    console.error('createJob Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── Get My Jobs (hirer's own jobs) ────────────────────────────────────────────
const getMyJobs = async (req, res) => {
  try {
    const hirerId = req.user?.id || req.params.hirerId;
    if (!hirerId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const jobs = await Job.find({ hirer: hirerId })
      .populate('tasker', 'fullName profilePicture rating hourlyRate')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: jobs.length, jobs });

  } catch (error) {
    console.error('getMyJobs Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── Get All Public Jobs (for taskers to browse) ───────────────────────────────
const getPublicJobs = async (req, res) => {
  try {
    const { taskerId } = req.query;

    const jobs = await Job.find({ jobType: 'public', status: 'pending' })
      .populate('hirer', 'fullName profilePicture')
      .sort({ createdAt: -1 });

    const jobsWithAppliedFlag = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.hasApplied = taskerId
        ? job.applications.some(a => a.tasker.toString() === taskerId)
        : false;
      return jobObj;
    });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs: jobsWithAppliedFlag
    });

  } catch (error) {
    console.error('getPublicJobs Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── Get Single Job Details ────────────────────────────────────────────────────
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId)
      .populate('hirer',               'fullName profilePicture phoneNumber')
      .populate('tasker',              'fullName profilePicture rating hourlyRate phoneNumber')
      .populate('applications.tasker', 'fullName profilePicture rating skills hourlyRate phoneNumber');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    return res.status(200).json({ success: true, job });

  } catch (error) {
    console.error('getJobById Error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Apply to a Public Job ─────────────────────────────────────────────────────
const getTaskerJobs = async (req, res) => {
  try {
    const taskerId = req.user?.id || req.params.taskerId;
    if (!taskerId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const jobs = await Job.find({ tasker: taskerId })
      .populate('hirer', 'fullName profilePicture phoneNumber')
      .populate('tasker', 'fullName profilePicture rating hourlyRate')
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error('getTaskerJobs Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const acceptDirectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const taskerId = req.user?.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.jobType !== 'direct') {
      return res.status(400).json({ success: false, message: 'Not a direct job' });
    }
    if (job.tasker?.toString() !== taskerId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not assigned to you' });
    }
    if (job.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Job is no longer pending' });
    }

    addStatusHistory(job, 'accepted', 'Tasker accepted the job', taskerId, 'tasker');
    await job.save();
    await notifyJobParties(job, {
      type: 'job',
      title: 'Job Accepted',
      message: `${job.title} has been accepted`,
      excludeId: taskerId,
    });

    const updated = await Job.findById(jobId)
      .populate('hirer', 'fullName profilePicture phoneNumber')
      .populate('tasker', 'fullName profilePicture rating hourlyRate');

    return res.status(200).json({ success: true, message: 'Job accepted!', job: updated });
  } catch (error) {
    console.error('acceptDirectJob Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const rejectDirectJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const taskerId = req.user?.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.tasker?.toString() !== taskerId?.toString()) {
      return res.status(403).json({ success: false, message: 'Not assigned to you' });
    }
    if (job.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Job is no longer pending' });
    }

    addStatusHistory(job, 'cancelled', 'Tasker rejected the job', taskerId, 'tasker');
    job.tasker = null;
    await job.save();
    await notifyJobParties(job, {
      type: 'job',
      title: 'Job Rejected',
      message: `Tasker declined: ${job.title}`,
      excludeId: taskerId,
    });

    return res.status(200).json({ success: true, message: 'Job rejected' });
  } catch (error) {
    console.error('rejectDirectJob Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const validStatuses = ['in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const isHirer = job.hirer.toString() === userId;
    const isTasker = job.tasker?.toString() === userId;

    if (status === 'in-progress') {
      if (!isTasker && userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Only tasker can start job' });
      }
      if (!['accepted', 'pending'].includes(job.status)) {
        return res.status(400).json({ success: false, message: 'Job cannot be started' });
      }
    }

    if (status === 'completed') {
      if (!isTasker && !isHirer && userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
      if (!['accepted', 'in-progress'].includes(job.status)) {
        return res.status(400).json({ success: false, message: 'Job cannot be completed' });
      }

      // Only release earnings if admin already verified payment
      if (job.tasker && job.paymentStatus === 'paid') {
        const tasker = await Tasker.findById(job.tasker);
        if (tasker) {
          tasker.totalEarnings += job.price || 0;
          tasker.jobsCount += 1;
          await tasker.save();
        }
        const hirer = await Hirer.findById(job.hirer);
        if (hirer) {
          hirer.totalSpent += job.price || 0;
          if (!hirer.bookedTasks.includes(job._id)) {
            hirer.bookedTasks.push(job._id);
          }
          await hirer.save();
        }
      }
    }

    if (status === 'cancelled') {
      if (!isHirer && !isTasker && userRole !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const notes = {
      'in-progress': 'Tasker started working on the job',
      completed: 'Job marked as completed',
      cancelled: 'Job was cancelled',
    };
    addStatusHistory(job, status, notes[status], userId, userRole);
    await job.save();

    await notifyJobParties(job, {
      type: 'job',
      title: `Job ${status}`,
      message: `${job.title} is now ${status}`,
      excludeId: userId,
    });

    const updated = await Job.findById(jobId)
      .populate('hirer', 'fullName profilePicture phoneNumber')
      .populate('tasker', 'fullName profilePicture rating hourlyRate phoneNumber')
      .populate('applications.tasker', 'fullName profilePicture rating skills hourlyRate');

    return res.status(200).json({ success: true, message: `Job marked as ${status}`, job: updated });
  } catch (error) {
    console.error('updateJobStatus Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const applyToJob = async (req, res) => {
  try {
    const { jobId }    = req.params;
    const taskerId = req.user?.id || req.body.taskerId;

    if (!taskerId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.jobType !== 'public') {
      return res.status(400).json({ success: false, message: 'Can only apply to public jobs' });
    }
    if (job.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    const alreadyApplied = job.applications.some(
      a => a.tasker.toString() === taskerId
    );
    if (alreadyApplied) {
      return res.status(409).json({ success: false, message: 'You have already applied to this job' });
    }

    job.applications.push({ tasker: taskerId, status: 'pending' });
    await job.save();

    await createNotification({
      userId: job.hirer,
      userRole: 'hirer',
      type: 'job',
      title: 'New Application',
      message: `Someone applied to: ${job.title}`,
      link: '/profile/tasks',
      jobId: job._id,
    });

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully!',
      applicationsCount: job.applications.length
    });

  } catch (error) {
    console.error('applyToJob Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── Withdraw Application ──────────────────────────────────────────────────────
const withdrawApplication = async (req, res) => {
  try {
    const { jobId }    = req.params;
    const taskerId = req.user?.id || req.body.taskerId;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const before = job.applications.length;
    job.applications = job.applications.filter(
      a => a.tasker.toString() !== taskerId
    );

    if (job.applications.length === before) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    await job.save();
    return res.status(200).json({ success: true, message: 'Application withdrawn' });

  } catch (error) {
    console.error('withdrawApplication Error:', error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── Accept an Applicant ───────────────────────────────────────────────────────
const acceptApplicant = async (req, res) => {
  try {
    const { jobId }    = req.params;
    const { taskerId } = req.body;
    const hirerId = req.user?.id;

    if (hirerId) {
      const jobCheck = await Job.findById(jobId);
      if (jobCheck && jobCheck.hirer.toString() !== hirerId) {
        return res.status(403).json({ success: false, message: 'Not your job' });
      }
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.jobType !== 'public') {
      return res.status(400).json({ success: false, message: 'Only public jobs have applicants' });
    }
    if (job.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Job is no longer pending' });
    }

    const appIndex = job.applications.findIndex(
      a => a.tasker.toString() === taskerId
    );
    if (appIndex === -1) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    // Accept chosen, reject the rest
    job.applications = job.applications.map((a, i) => ({
      ...a.toObject(),
      status: i === appIndex ? 'accepted' : 'rejected'
    }));

    job.tasker = taskerId;
    addStatusHistory(job, 'accepted', 'Hirer accepted tasker application', hirerId, 'hirer');
    await job.save();

    await createNotification({
      userId: taskerId,
      userRole: 'tasker',
      type: 'job',
      title: 'Application Accepted!',
      message: `You were selected for: ${job.title}`,
      link: '/tasks',
      jobId: job._id,
    });

    const updated = await Job.findById(jobId)
      .populate('tasker',              'fullName profilePicture rating hourlyRate phoneNumber')
      .populate('applications.tasker', 'fullName profilePicture rating skills hourlyRate phoneNumber');

    return res.status(200).json({
      success: true,
      message: 'Tasker accepted successfully!',
      job: updated
    });

  } catch (error) {
    console.error('acceptApplicant Error:', error);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Single export at the bottom — fixes the duplicate export error ────────────
export {
  createJob,
  getMyJobs,
  getPublicJobs,
  getJobById,
  getTaskerJobs,
  acceptDirectJob,
  rejectDirectJob,
  updateJobStatus,
  applyToJob,
  withdrawApplication,
  acceptApplicant,
};