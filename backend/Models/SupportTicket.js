import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  ticketId:  { type: String, unique: true },
  name:      { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String, default: '' },
  subject:   { type: String, required: true },
  message:   { type: String, required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, default: null },
  userRole:  { type: String, enum: ['hirer', 'tasker', 'guest', 'admin'], default: 'guest' },
  priority:  { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  status:    { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  adminReply:{ type: String, default: '' },
}, { timestamps: true });

supportTicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await mongoose.model('SupportTicket').countDocuments();
    this.ticketId = `TKT-${String(count + 1024).padStart(4, '0')}`;
  }
  next();
});

export default mongoose.model('SupportTicket', supportTicketSchema);
