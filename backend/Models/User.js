import mongoose from 'mongoose';

const hirerSchema = new mongoose.Schema({
  fullName:    { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email:       { type: String, lowercase: true },
  password:    { type: String, required: true },
  role:        { type: String, default: 'hirer' },

  // Profile
  gender:         { type: String, enum: ['male', 'female', 'other'] }, // fixed: was ['Male','Female','other']
  age:            { type: Number },
  profilePicture: {                                                      // fixed: type was 'String' (string) not String (type)
    type:    String,
    default: 'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg'
  },

  address: [{
    houseNo:   { type: String, default: '' },
    street:    { type: String, default: '' },
    landmark:  { type: String, default: '' },
    city:      { type: String, required: true },
    state:     { type: String },
    pincode:   { type: String, required: true },
    isDefault: { type: Boolean, default: true }
  }],

  // Booking & Money
  bookedTasks:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  totalSpent:    { type: Number, default: 0 },
  walletBalance: { type: Number, default: 0 },

  // Verification
  isPhoneVerified:  { type: Boolean, default: false },
  isProfileComplete:{ type: Boolean, default: false },

}, { timestamps: true });

export default mongoose.model('Hirer', hirerSchema);