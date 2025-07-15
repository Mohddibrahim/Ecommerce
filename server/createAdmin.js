import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'admin@example.com';
    const exist = await User.findOne({ email });

    if (exist) {
      console.log('❌ Admin already exists');
      process.exit();
    }

    const hashed = await bcrypt.hash('Admin@123', 10);

    const admin = new User({
      name: 'Admin',
      email,
      password: hashed,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin created');
    process.exit();
  } catch (err) {
    console.error('❌ Error creating admin:', err);
    process.exit(1);
  }
};

createAdmin();
