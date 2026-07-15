import Review from '../Models/Review.js';
import Job from '../Models/Jobs.js';
import Tasker from '../Models/Tasker.js';

const createReview = async (req, res) => {
  try {
    const { jobId, rating, comment } = req.body;
    const hirerId = req.user.id;

    if (req.user.role !== 'hirer') {
      return res.status(403).json({ success: false, message: 'Only hirers can leave reviews' });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    if (job.hirer.toString() !== hirerId) {
      return res.status(403).json({ success: false, message: 'Not your job' });
    }
    if (job.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed jobs' });
    }
    if (job.ratingGiven) {
      return res.status(409).json({ success: false, message: 'Review already submitted' });
    }
    if (!job.tasker) {
      return res.status(400).json({ success: false, message: 'No tasker assigned to this job' });
    }

    const review = await Review.create({
      job: jobId,
      hirer: hirerId,
      tasker: job.tasker,
      rating: parseInt(rating),
      comment: comment || '',
    });

    job.ratingGiven = true;
    await job.save();

    const tasker = await Tasker.findById(job.tasker);
    if (tasker) {
      const newCount = tasker.rating.count + 1;
      const newAvg = ((tasker.rating.average * tasker.rating.count) + parseInt(rating)) / newCount;
      tasker.rating = { average: Math.round(newAvg * 10) / 10, count: newCount };
      await tasker.save();
    }

    return res.status(201).json({ success: true, message: 'Review submitted!', review });
  } catch (error) {
    console.error('createReview Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getTaskerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tasker: req.params.taskerId })
      .populate('hirer', 'fullName profilePicture')
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error('getTaskerReviews Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { createReview, getTaskerReviews };
