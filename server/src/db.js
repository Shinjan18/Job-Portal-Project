const mongoose = require('mongoose');

const { MONGODB_URI = 'mongodb://localhost:27017/JobListingPortal' } = process.env;

// Connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');});

// Close the Mongoose connection when the Node process ends
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
    process.exit(1);
  }
});

const connect = async (retries = 3, delay = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      mongoose.set('strictQuery', true);
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      });
      console.log(`✓ MongoDB connected successfully (attempt ${attempt}/${retries})`);
      return mongoose.connection;
    } catch (error) {
      console.error(`✗ MongoDB connection attempt ${attempt}/${retries} failed:`, error.message);
      if (attempt < retries) {
        const waitTime = delay * attempt;
        console.log(`  Retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error('✗ MongoDB connection failed after all retries. Exiting...');
        process.exit(1);
      }
    }
  }
};

module.exports = { connect, connection: mongoose.connection };

