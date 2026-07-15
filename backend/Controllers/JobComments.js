import Job from '../Models/Jobs.js';
import JobComment from '../Models/JobComment.js';
import Hirer from '../Models/User.js';
import Tasker from '../Models/Tasker.js';
import Admin from '../Models/Admin.js';
import { notifyJobParties } from '../utils/jobHelpers.js';

const canAccessJob = (job, userId, userRole) => {
  const isHirer = job.hirer.toString() === userId;
  const isTasker = job.tasker?.toString() === userId;
  const isAdmin = userRole === 'admin';
  return isHirer || isTasker || isAdmin;
};

const enrichAuthor = async (comment) => {
  const doc = comment.toObject ? comment.toObject() : { ...comment };
  const Model = doc.authorRole === 'tasker' ? Tasker : doc.authorRole === 'admin' ? Admin : Hirer;
  const author = await Model.findById(doc.author).select('fullName profilePicture');
  return {
    ...doc,
    author: author
      ? { _id: author._id, fullName: author.fullName, profilePicture: author.profilePicture, role: doc.authorRole }
      : { _id: doc.author, fullName: 'Unknown', profilePicture: null, role: doc.authorRole },
  };
};

export const getJobComments = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (!canAccessJob(job, userId, userRole)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const comments = await JobComment.find({ job: jobId }).sort({ createdAt: 1 });
    const enriched = await Promise.all(comments.map(enrichAuthor));

    return res.status(200).json({ success: true, comments: enriched });
  } catch (error) {
    console.error('getJobComments Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const addJobComment = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    if (!canAccessJob(job, userId, userRole)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (!job.tasker && userRole !== 'admin') {
      return res.status(400).json({ success: false, message: 'Comments are available once a tasker is assigned' });
    }

    if (['cancelled'].includes(job.status)) {
      return res.status(400).json({ success: false, message: 'Cannot comment on a cancelled job' });
    }

    const comment = await JobComment.create({
      job: jobId,
      author: userId,
      authorRole: userRole,
      text: text.trim(),
    });

    await notifyJobParties(job, {
      type: 'job',
      title: 'New Job Comment',
      message: text.trim().slice(0, 80),
      excludeId: userId,
    });

    const enriched = await enrichAuthor(comment);
    return res.status(201).json({ success: true, comment: enriched });
  } catch (error) {
    console.error('addJobComment Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
