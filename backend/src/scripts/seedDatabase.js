 
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const connectDB = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const Donation = require('../models/Donation');
const Need = require('../models/Need');
const Task = require('../models/Task');

const seedAll = async () => {
  try {
    console.log('Connecting to MongoDB for comprehensive seeding...');
    await connectDB();

    console.log('Clearing existing demo collections...');
    await User.deleteMany({
      email: {
        $in: [
          'admin@sahara.org',
          'volunteer@sahara.org',
          'rohan.volunteer@sahara.org',
          'donor@sahara.org',
          'priya.donor@sahara.org',
          'ngo@sahara.org',
          'care.foundation@sahara.org',
          'child.aid@sahara.org',
          'neha.receiver@sahara.org'
        ]
      }
    });

    const saltRounds = 10;
    const adminPass = await bcrypt.hash('Admin@123', saltRounds);
    const volPass = await bcrypt.hash('Volunteer@123', saltRounds);
    const donorPass = await bcrypt.hash('Donor@123', saltRounds);
    const recvPass = await bcrypt.hash('Receiver@123', saltRounds);

    // 1. Seed Users
    const usersToCreate = [
      {
        name: 'Sahara Super Admin',
        phone: '9999900001',
        email: 'admin@sahara.org',
        passwordHash: adminPass,
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
        passwordHash: volPass,
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
        name: 'Rohan Mishra',
        phone: '9999900008',
        email: 'rohan.volunteer@sahara.org',
        passwordHash: volPass,
        role: 'volunteer',
        roles: ['volunteer'],
        activeRole: 'volunteer',
        location: {
          address: 'Civil Lines',
          city: 'Kanpur',
          state: 'Uttar Pradesh',
          pincode: '208001',
          coordinates: { lat: 26.4725, lng: 80.3475 }
        },
        volunteerDetails: {
          availability: true,
          vehicleType: 'four_wheeler'
        },
        isActive: true
      },
      {
        name: 'Aarav Donor',
        phone: '9999900003',
        email: 'donor@sahara.org',
        passwordHash: donorPass,
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
        name: 'Priya Sharma (Corporate Donor)',
        phone: '9999900009',
        email: 'priya.donor@sahara.org',
        passwordHash: donorPass,
        role: 'donor',
        roles: ['donor'],
        activeRole: 'donor',
        location: {
          address: 'DLF Phase 4',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122002',
          coordinates: { lat: 28.4682, lng: 77.0863 }
        },
        isActive: true
      },
      {
        name: 'Sneha NGO Director',
        phone: '9999900004',
        email: 'ngo@sahara.org',
        passwordHash: recvPass,
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
      },
      {
        name: 'Care & Nourish Trust',
        phone: '9999900005',
        email: 'care.foundation@sahara.org',
        passwordHash: recvPass,
        role: 'receiver',
        roles: ['receiver'],
        activeRole: 'receiver',
        receiverType: 'organization',
        organization: {
          orgName: 'Care & Nourish Trust',
          regNumber: 'TRUST/UP/2023/1042',
          description: 'Grassroots community kitchen feeding daily wage migrant workers.',
          verificationStatus: 'pending'
        },
        location: {
          address: 'Kakadeo Metro Station Area',
          city: 'Kanpur',
          state: 'Uttar Pradesh',
          pincode: '208025',
          coordinates: { lat: 26.4862, lng: 80.3061 }
        },
        isActive: true
      },
      {
        name: 'Child Education & Aid Mission',
        phone: '9999900006',
        email: 'child.aid@sahara.org',
        passwordHash: recvPass,
        role: 'receiver',
        roles: ['receiver'],
        activeRole: 'receiver',
        receiverType: 'organization',
        organization: {
          orgName: 'Child Education & Aid Mission',
          regNumber: 'SOCIETY/DL/2024/552',
          description: 'Educating underprivileged kids and providing seasonal apparel.',
          verificationStatus: 'pending'
        },
        location: {
          address: 'Lajpat Nagar Community Center',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110024',
          coordinates: { lat: 28.5677, lng: 77.2433 }
        },
        isActive: true
      },
      {
        name: 'Neha Individual Beneficiary',
        phone: '9999900007',
        email: 'neha.receiver@sahara.org',
        passwordHash: recvPass,
        role: 'receiver',
        roles: ['receiver'],
        activeRole: 'receiver',
        receiverType: 'individual',
        location: {
          address: 'Rohini Sector 16',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110089',
          coordinates: { lat: 28.7297, lng: 77.1275 }
        },
        isActive: true
      }
    ];

    const seededUsers = await User.insertMany(usersToCreate);
    const adminUser = seededUsers.find(u => u.role === 'admin');
    const donorUser = seededUsers.find(u => u.email === 'donor@sahara.org');
    const volUser = seededUsers.find(u => u.email === 'volunteer@sahara.org');
    const ngoUser = seededUsers.find(u => u.email === 'care.foundation@sahara.org');

    // 2. Categories
    let foodCategory = await Category.findOne({ name: 'Food' });
    if (!foodCategory) {
      foodCategory = await Category.create({
        name: 'Food',
        description: 'Cooked meals, dry rations, and packaged groceries',
        status: 'active',
        createdBy: adminUser._id
      });
    }

    let clothesCategory = await Category.findOne({ name: 'Clothes' });
    if (!clothesCategory) {
      clothesCategory = await Category.create({
        name: 'Clothes',
        description: 'Seasonal apparel, winter blankets, jackets, footwear',
        status: 'active',
        createdBy: adminUser._id
      });
    }

    let medicineCategory = await Category.findOne({ name: 'Medicines' });
    if (!medicineCategory) {
      medicineCategory = await Category.create({
        name: 'Medicines',
        description: 'First aid, OTC wellness products, hygiene kits',
        status: 'active',
        createdBy: adminUser._id
      });
    }

    // 3. Clear existing demo donations & needs
    await Donation.deleteMany({ title: { $in: ['100 Fresh Packed Meals', '50 Winter Jackets & Blankets', '50 Ration Grocery Kits'] } });
    await Need.deleteMany({ title: { $in: ['Urgent Ration Kits for 40 Families', 'Winter Blankets for Night Shelter', 'Emergency Baby Nutrition'] } });
    await Task.deleteMany({ title: { $in: ['Deliver Fresh Meals to Night Shelter', 'Sort & Distribute Winter Jackets'] } });

    // 4. Create Donations
    const now = new Date();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const donation1 = await Donation.create({
      donorId: donorUser._id,
      title: '100 Fresh Packed Meals',
      categoryId: foodCategory._id,
      quantity: 100,
      unit: 'meals',
      description: 'Hot vegetarian meals (Dal, Rice, Roti, Subzi) freshly prepared for immediate distribution.',
      location: donorUser.location,
      availableFrom: now,
      availableUntil: tomorrow,
      foodDetails: {
        preparedOn: now,
        safeUntil: tomorrow,
        isVeg: true
      },
      status: 'available'
    });

    const donation2 = await Donation.create({
      donorId: donorUser._id,
      title: '50 Winter Jackets & Blankets',
      categoryId: clothesCategory._id,
      quantity: 50,
      unit: 'items',
      description: 'Clean, sanitized winter jackets and heavy fleece blankets for extreme cold weather.',
      location: donorUser.location,
      availableFrom: now,
      availableUntil: nextWeek,
      status: 'available'
    });

    // 5. Create Needs
    const need1 = await Need.create({
      receiverId: ngoUser._id,
      title: 'Urgent Ration Kits for 40 Families',
      categoryId: foodCategory._id,
      quantity: 40,
      unit: 'kits',
      urgency: 'critical',
      requiredBy: tomorrow,
      description: 'Critical need for dry ration packets (Atta, Rice, Pulses, Cooking Oil) for flooded community area.',
      location: ngoUser.location,
      receiverType: 'organization',
      status: 'open'
    });

    const need2 = await Need.create({
      receiverId: ngoUser._id,
      title: 'Winter Blankets for Night Shelter',
      categoryId: clothesCategory._id,
      quantity: 60,
      unit: 'blankets',
      urgency: 'high',
      requiredBy: nextWeek,
      description: 'Need warm blankets for homeless individuals staying at the temporary night shelter.',
      location: ngoUser.location,
      receiverType: 'organization',
      status: 'open'
    });

    // 6. Create Tasks
    await Task.create({
      title: 'Deliver Fresh Meals to Night Shelter',
      description: 'Pickup 100 packed meals from Green Park and deliver to community kitchen in Delhi.',
      taskType: 'delivery',
      donationId: donation1._id,
      needId: need1._id,
      volunteerId: volUser._id,
      assignedBy: adminUser._id,
      location: donorUser.location,
      status: 'assigned',
      urgency: 'critical',
      scheduledTime: 'Today · 5:30 PM',
      peopleNeeded: 1
    });

    await Task.create({
      title: 'Sort & Distribute Winter Jackets',
      description: 'Assist in sorting sizes and handing over jackets to registered beneficiaries.',
      taskType: 'distribution',
      donationId: donation2._id,
      needId: need2._id,
      volunteerId: null,
      assignedBy: adminUser._id,
      location: ngoUser.location,
      status: 'available',
      urgency: 'high',
      scheduledTime: 'Tomorrow · 10:00 AM',
      peopleNeeded: 2
    });

    console.log('\n====================================================');
    console.log('✅ ALL DEMO DATA & ADMIN SEEDING COMPLETED!');
    console.log('====================================================');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('   Email:    admin@sahara.org');
    console.log('   Password: Admin@123');
    console.log('----------------------------------------------------');
    console.log('📋 OTHER DEMO ACCOUNTS:');
    console.log('   Volunteer: volunteer@sahara.org   | Volunteer@123');
    console.log('   Donor:     donor@sahara.org       | Donor@123');
    console.log('   NGO:       care.foundation@sahara.org (Pending Verification)');
    console.log('====================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedAll();
