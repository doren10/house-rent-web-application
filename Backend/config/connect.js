const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const userSchema = require('../models/UserSchema');
const propertySchema = require('../models/PropertySchema');
const bookingSchema = require('../models/BookingSchema');

dotenv.config();

const seedInitialDataIfEmpty = async () => {
  try {
    const userCount = await userSchema.countDocuments();
    const propertyCount = await propertySchema.countDocuments();
    if (userCount > 0 || propertyCount > 0) {
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('123456', salt);

    const owner = await userSchema.create({
      name: 'Pravanshu',
      email: 'pravanshu@gmail.com',
      password: defaultPassword,
      type: 'Owner',
      granted: 'granted',
    });

    await userSchema.create({
      name: 'Abhi',
      email: 'abhi@gmail.com',
      password: defaultPassword,
      type: 'Admin',
    });

    const renter = await userSchema.create({
      name: 'Ram',
      email: 'ram@gmail.com',
      password: defaultPassword,
      type: 'Renter',
    });

    const uploadsDir = path.join(__dirname, '../uploads');
    let fourthImageFile = 'AKASHRAJ V R (@akashraj_achi) • Instagram photos and videos.jpeg';
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      const found = files.find((f) => f.startsWith('AKASHRAJ'));
      if (found) fourthImageFile = found;
    }

    const prop1 = await propertySchema.create({
      ownerId: owner._id,
      ownerName: owner.name,
      propertyType: 'residential',
      propertyAdType: 'rent',
      propertyAddress: '17, 4th Cross, Indiranagar 2nd Stage, Bengaluru, Karnataka - 560038',
      ownerContact: '+91 98765 43210',
      propertyAmt: 35000,
      propertyImage: [{ filename: '_ (1).jpeg', path: '/uploads/_ (1).jpeg' }],
      additionalInfo: 'Spacious 2BHK furnished residential flat in Indiranagar with covered parking and 24/7 security.',
      isAvailable: 'Available',
    });

    const prop2 = await propertySchema.create({
      ownerId: owner._id,
      ownerName: owner.name,
      propertyType: 'commercial',
      propertyAdType: 'sale',
      propertyAddress: '102, Hosur Road, Near Forum Mall, Koramangala, Bengaluru - 560095',
      ownerContact: '+91 90123 45678',
      propertyAmt: 18000000,
      propertyImage: [
        {
          filename: '56 Commercial Architecture Designs That Make a Statement.jpeg',
          path: '/uploads/56 Commercial Architecture Designs That Make a Statement.jpeg',
        },
      ],
      additionalInfo: 'Prime commercial office building near Forum Mall, Koramangala.',
      isAvailable: 'Unavailable',
    });

    const prop3 = await propertySchema.create({
      ownerId: owner._id,
      ownerName: owner.name,
      propertyType: 'residential',
      propertyAdType: 'rent',
      propertyAddress: '235, 6th Main, JP Nagar Phase 7, Bengaluru, Karnataka - 560078',
      ownerContact: '+91 99876 54321',
      propertyAmt: 8500000,
      propertyImage: [{ filename: '_ (2).jpeg', path: '/uploads/_ (2).jpeg' }],
      additionalInfo: 'Modern independent duplex house in JP Nagar Phase 7 with garden and gated security.',
      isAvailable: 'Available',
    });

    await propertySchema.create({
      ownerId: owner._id,
      ownerName: owner.name,
      propertyType: 'commercial',
      propertyAdType: 'rent',
      propertyAddress: '56, 2nd Floor, Brigade Road, MG Road, Bengaluru - 560001',
      ownerContact: '+91 91234 56789',
      propertyAmt: 120000,
      propertyImage: [{ filename: fourthImageFile, path: `/uploads/${fourthImageFile}` }],
      additionalInfo: 'Commercial retail and studio space on Brigade Road, MG Road.',
      isAvailable: 'Available',
    });

    await bookingSchema.create({
      propertyId: prop2._id,
      propertId: prop2._id,
      ownerID: owner._id,
      userID: renter._id,
      userName: 'Ram Agrawal',
      phone: '913847384567',
      bookingStatus: 'booked',
    });

    await bookingSchema.create({
      propertyId: prop3._id,
      propertId: prop3._id,
      ownerID: owner._id,
      userID: renter._id,
      userName: 'Ram Agrawal',
      phone: '91456473247',
      bookingStatus: 'pending',
    });

    console.log('Initial HouseRent sample data seeded successfully');
  } catch (seedErr) {
    console.error('Seed check error:', seedErr.message);
  }
};

const connectDB = async () => {
  const mongoURI =
    process.env.MONGO_DB ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/HouseRent';

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
    await seedInitialDataIfEmpty();
  } catch (err) {
    console.error(`Could not connect to MongoDB: ${err.message}`);
  }
};

module.exports = connectDB;