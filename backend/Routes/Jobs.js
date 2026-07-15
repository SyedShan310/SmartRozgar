import express from 'express';
import {
  createJob, getMyJobs, getPublicJobs, getTaskerJobs,
  getJobById, applyToJob, withdrawApplication,
  acceptApplicant, acceptDirectJob, rejectDirectJob, updateJobStatus,
} from '../Controllers/Jobs.js';
import { getJobComments, addJobComment } from '../Controllers/JobComments.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticate, authorize('hirer'), createJob);
router.get('/my', authenticate, authorize('hirer'), getMyJobs);
router.get('/my/:hirerId', authenticate, authorize('hirer'), getMyJobs);
router.get('/tasker', authenticate, authorize('tasker'), getTaskerJobs);
router.get('/tasker/:taskerId', authenticate, authorize('tasker'), getTaskerJobs);
router.get('/public', getPublicJobs);
router.get('/:jobId/comments', authenticate, getJobComments);
router.post('/:jobId/comments', authenticate, addJobComment);
router.get('/:jobId', getJobById);
router.post('/:jobId/apply', authenticate, authorize('tasker'), applyToJob);
router.post('/:jobId/withdraw', authenticate, authorize('tasker'), withdrawApplication);
router.post('/:jobId/accept-applicant', authenticate, authorize('hirer'), acceptApplicant);
router.patch('/:jobId/accept', authenticate, authorize('tasker'), acceptDirectJob);
router.patch('/:jobId/reject', authenticate, authorize('tasker'), rejectDirectJob);
router.patch('/:jobId/status', authenticate, updateJobStatus);

export default router;
