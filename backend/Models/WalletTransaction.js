import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
  hirer:   { type: mongoose.Schema.Types.ObjectId, ref: 'Hirer', required: true },
  job:     { type: mongoose.Schema.Types.ObjectId, ref: 'Job', default: null },
  type:    { type: String, enum: ['credit', 'debit'], required: true },
  amount:  { type: Number, required: true },
  title:   { type: String, required: true },
  status:  { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  method:  { type: String, enum: ['topup', 'job_payment', 'refund', 'wallet'], default: 'wallet' },
  receipt: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model('WalletTransaction', walletTransactionSchema);
