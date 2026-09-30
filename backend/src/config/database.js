const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || '';
    console.log('Connecting to MongoDB...');
    const conn = await mongoose.connect(mongoURI);
    console.log(` MongoDB Connected Successfully`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
