import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from '../Models/Admin.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await Admin.findOne({ email: 'admin@smartrorozgar.com' });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const hashed = await bcrypt.hash('admin123', 12);
  await Admin.create({
    fullName: 'SmartRozgar Admin',
    email: 'admin@smartrorozgar.com',
    password: hashed,
    role: 'admin',
  });
  console.log('Admin seeded: admin@smartrorozgar.com / admin123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
