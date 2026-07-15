import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, required: true },
  userRole: { type: String, enum: ['hirer', 'tasker', 'admin'], required: true },
  type:     { type: String, enum: ['job', 'payment', 'message', 'system', 'review'], default: 'system' },
  title:    { type: String, required: true },
  message:  { type: String, default: '' },
  link:     { type: String, default: '' },
  jobId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  isRead:   { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
