import bcrypt from 'bcryptjs';
import Tasker from '../../Models/Tasker.js';
import Hirer  from '../../Models/User.js';
import { signToken } from '../../middleware/auth.js';

const signup = async (req, res) => {
  try {
    const {
      role,
      fullName,
      phone,
      email,
      password,
      gender,
      age,
      address,       // { houseNo, street, landmark, city, state, pincode }
      skills,        // tasker only
      hourlyRate     // tasker only
    } = req.body;

    // ── 1. Role validation ───────────────────────────────────────────────────
    if (!role || !['hirer', 'tasker'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role is required and must be 'hirer' or 'tasker'"
      });
    }

    // ── 2. Common required fields ────────────────────────────────────────────
    if (!fullName || !phone || !password || !address?.city || !address?.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields (name, phone, password, city, pincode)'
      });
    }

    // ── 3. Tasker-specific required fields ───────────────────────────────────
    // fixed: these were never validated so missing gender/age hit a confusing 500
    if (role === 'tasker') {
      if (!gender || !age) {
        return res.status(400).json({
          success: false,
          message: 'Gender and age are required for tasker accounts'
        });
      }
      if (!skills || skills.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Please select at least one skill'
        });
      }
      if (!hourlyRate) {
        return res.status(400).json({
          success: false,
          message: 'Hourly rate is required for tasker accounts'
        });
      }
    }

    // ── 4. Duplicate phone check ─────────────────────────────────────────────
    const [existingHirer, existingTasker] = await Promise.all([
      Hirer.findOne({ phoneNumber: phone }),
      Tasker.findOne({ phoneNumber: phone })
    ]);

    if (existingHirer || existingTasker) {
      return res.status(409).json({
        success: false,
        message: 'Phone number is already registered'
      });
    }

    // ── 5. Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── 6. Build shared fields ───────────────────────────────────────────────
    const commonData = {
      fullName,
      phoneNumber:  phone,
      email:        email  || null,
      password:     hashedPassword,
      gender:       gender || null,
      age:          age    ? parseInt(age) : null,
      address: [{
        houseNo:   address.houseNo  || '',
        street:    address.street   || '',
        landmark:  address.landmark || '',
        city:      address.city,
        state:     address.state    || '',
        pincode:   address.pincode,
        isDefault: true
      }],
      isPhoneVerified:   false,
      isProfileComplete: false
    };

    // ── 7. Create user ───────────────────────────────────────────────────────
    let user;
    let message;

    if (role === 'hirer') {
      user = await Hirer.create({
        ...commonData,
        totalSpent:    0,
        walletBalance: 0
      });
      message = 'Hirer account created successfully!';

    } else {
      user = await Tasker.create({
        ...commonData,
        skills,
        hourlyRate:    parseInt(hourlyRate),
        totalEarnings: 0,
        jobsCount:     0,
        rating:        { average: 0, count: 0 },
        isApproved:    false,
        isActive:      true
      });
      message = 'Tasker account created! Pending admin approval.';
    }

    // ── 8. Success response ──────────────────────────────────────────────────
    const token = signToken({ id: user._id, role });
    return res.status(201).json({
      success: true,
      message,
      token,
      user: {
        id:         user._id,
        fullName:   user.fullName,
        phone:      user.phoneNumber,
        role,
        isApproved: role === 'tasker' ? user.isApproved : true
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Phone number already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

export default signup;