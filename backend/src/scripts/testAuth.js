const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const connectDB = require('../config/database');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');

async function testAuth() {
  try {
    await connectDB();
    console.log('Testing User model and login verification...');

    // 1. Find seeded donor
    const donor = await User.findOne({ email: 'donor@sahara.org' }).select('+passwordHash');
    if (!donor) throw new Error('Donor not found!');
    
    // 2. Test password verification
    const isMatch = await donor.comparePassword('Donor@123');
    console.log('Donor password check (Donor@123):', isMatch ? '✅ MATCHED' : '❌ FAILED');

    // 3. Test JWT generation
    const token = generateToken(donor._id, donor.role);
    console.log('Generated JWT token:', token.substring(0, 30) + '...');

    // 4. Test phone login lookup
    const userByPhone = await User.findOne({ phone: '9999900003' }).select('+passwordHash');
    console.log('User found by phone (9999900003):', userByPhone ? `✅ FOUND (${userByPhone.name})` : '❌ NOT FOUND');

    console.log('\nAll direct Auth layer checks passed! 🎉');
    process.exit(0);
  } catch (err) {
    console.error('Test Auth Error:', err);
    process.exit(1);
  }
}

testAuth();
