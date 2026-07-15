import mongoose from 'mongoose';

const jobCommentSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  authorRole: {
    type: String,
    enum: ['hirer', 'tasker', 'admin'],
    required: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
}, { timestamps: true });

export default mongoose.model('JobComment', jobCommentSchema);
