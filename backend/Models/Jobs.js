import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({

  // ── Parties ──────────────────────────────────────────────────────────────
  hirer: {
    type:     mongoose.Schema.Types.ObjectId,
    ref:      'Hirer',
    required: true
  },
  tasker: {
    type:    mongoose.Schema.Types.ObjectId,
    ref:     'Tasker',
    default: null          // null until a tasker is assigned
  },

  // ── Job Info ─────────────────────────────────────────────────────────────
  jobType: {
    type:     String,
    enum:     ['direct', 'public'],
    required: true
    // direct = hirer picks a specific tasker
    // public = hirer posts, taskers apply
  },
  title:       { type: String, required: true },   // added: e.g. "Need a cook for dinner party"
  service:     { type: String, required: true },   // e.g. "Cooking", "Cleaning"
  description: { type: String, default: '' },      // added: hirer's instructions/details
  
  address: {
    houseNo: { type: String, default: '' },
    street:  { type: String, default: '' },
    city:    { type: String, required: true },
    state:   { type: String, default: '' },
    pincode: { type: String, required: true }
  },

  date:  { type: Date,   required: true },
  hours: { type: Number, default: 1 },
  price: { type: Number, default: 0 },

  // ── Applications (only used when jobType = 'public') ─────────────────────
  // added: was missing entirely — taskers couldn't apply to public jobs
  applications: [{
    tasker:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tasker', required: true },
    status:    { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
  }],

  // ── Status ───────────────────────────────────────────────────────────────
  status: {
    type:    String,
    enum:    ['pending', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
    // added 'in-progress' — useful for tracking active jobs
  },

  // ── Payment ──────────────────────────────────────────────────────────────
  paymentScreenshots: [{ type: String }],
  paymentStatus: {
    type:    String,
    enum:    ['unpaid', 'unverified', 'paid', 'refunded'],
    default: 'unpaid'
  },

  // ── Post-job ─────────────────────────────────────────────────────────────
  ratingGiven: { type: Boolean, default: false },

  // ── Job tracking timeline ──────────────────────────────────────────────────
  statusHistory: [{
    status: { type: String, required: true },
    note:   { type: String, default: '' },
    by:     { type: mongoose.Schema.Types.ObjectId, default: null },
    role:   { type: String, enum: ['hirer', 'tasker', 'admin', 'system'], default: 'system' },
    at:     { type: Date, default: Date.now },
  }],

}, { timestamps: true });

export default mongoose.model('Job', jobSchema);