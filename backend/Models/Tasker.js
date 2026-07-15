import mongoose from 'mongoose';

const taskerSchema = new mongoose.Schema({
  fullName:    { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email:       { type: String, lowercase: true },
  password:    { type: String, required: true },
  role:        { type: String, default: 'tasker' },

  // Personal
  gender:         { type: String, enum: ['male', 'female', 'other'], required: true }, // fixed: was ['Male','Female','other']
  age:            { type: Number, required: true },
  profilePicture: {
    type:    String,
    default: 'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg'
  },

  // Address — was completely missing from Tasker, added now
  address: [{
    houseNo:   { type: String, default: '' },
    street:    { type: String, default: '' },
    landmark:  { type: String, default: '' },
    city:      { type: String, required: true },
    state:     { type: String },
    pincode:   { type: String, required: true },
    isDefault: { type: Boolean, default: true }
  }],

  // Work
  skills:          [{ type: String, required: true }],
  hourlyRate:      { type: Number, required: true },
  experienceYears: { type: Number, default: 0 },
  languages:       [String],

  // Availability & Location
  serviceCities: [String],
  availability:  { type: Map, of: String },

  // Location (GeoJSON — fixed: coordinates were commented out making it invalid)
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },

  // Jobs & Earnings
  totalEarnings: { type: Number, default: 0 },
  jobsCount:     { type: Number, default: 0 },

  // Documents (for future use)
  documents: {
    cnic:  String,
    photo: String
  },

  // Status
  isApproved:        { type: Boolean, default: false },
  isPhoneVerified:   { type: Boolean, default: false },
  isProfileComplete: { type: Boolean, default: false },
  isActive:          { type: Boolean, default: true },

  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 }
  },

}, { timestamps: true });

export default mongoose.model('Tasker', taskerSchema);