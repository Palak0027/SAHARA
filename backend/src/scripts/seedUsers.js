const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const connectDB = require('../config/database');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();

    console.log('Clearing existing demo users...');
    await User.deleteMany({
      email: {
        $in: [
          'admin@sahara.org',
          'volunteer@sahara.org',
          'donor@sahara.org',
          'ngo@sahara.org'
        ]
      }
    });

    const saltRounds = 10;
    const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
    const volunteerPassword = await bcrypt.hash('Volunteer@123', saltRounds);
    const donorPassword = await bcrypt.hash('Donor@123', saltRounds);
    const ngoPassword = await bcrypt.hash('Ngo@123', saltRounds);

    const demoUsers = [
      {
        name: 'Sahara Super Admin',
        phone: '9999900001',
        email: 'admin@sahara.org',
        passwordHash: adminPassword,
        role: 'admin',
        roles: ['admin'],
        activeRole: 'admin',
        location: {
          address: 'Headquarters, Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          coordinates: { lat: 28.6315, lng: 77.2167 }
        },
        isActive: true
      },
      {
        name: 'Vikram Volunteer',
        phone: '9999900002',
        email: 'volunteer@sahara.org',
        passwordHash: volunteerPassword,
        role: 'volunteer',
        roles: ['volunteer'],
        activeRole: 'volunteer',
        location: {
          address: 'Sector 18 Market',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pincode: '201301',
          coordinates: { lat: 28.5708, lng: 77.3271 }
        },
        volunteerDetails: {
          availability: true,
          vehicleType: 'two_wheeler'
        },
        isActive: true
      },
      {
        name: 'Aarav Donor',
        phone: '9999900003',
        email: 'donor@sahara.org',
        passwordHash: donorPassword,
        role: 'donor',
        roles: ['donor'],
        activeRole: 'donor',
        location: {
          address: 'B-10, Green Park Extension',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110016',
          coordinates: { lat: 28.5589, lng: 77.2028 }
        },
        isActive: true
      },
      {
        name: 'Sneha NGO Director',
        phone: '9999900004',
        email: 'ngo@sahara.org',
        passwordHash: ngoPassword,
        role: 'receiver',
        roles: ['receiver'],
        activeRole: 'receiver',
        receiverType: 'organization',
        organization: {
          orgName: 'Goonj Hope Foundation',
          regNumber: 'NGO/DL/2022/9871',
          description: 'Working for child nutrition and winter clothes distribution',
          verificationStatus: 'verified'
        },
        location: {
          address: 'Sarita Vihar Institutional Area',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110076',
          coordinates: { lat: 28.5286, lng: 77.2917 }
        },
        isActive: true
      }
    ];

    await User.insertMany(demoUsers);

    console.log('✅ Demo Users Seeded Successfully:');
    console.log('----------------------------------------------------');
    console.log('1. Admin:     admin@sahara.org     | Pass: Admin@123');
    console.log('2. Volunteer: volunteer@sahara.org | Pass: Volunteer@123');
    console.log('3. Donor:     donor@sahara.org     | Pass: Donor@123');
    console.log('4. NGO Recv:  ngo@sahara.org       | Pass: Ngo@123');
    console.log('----------------------------------------------------');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedUsers();
