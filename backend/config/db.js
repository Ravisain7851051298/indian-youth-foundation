const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);

    // Auto-verify that users collection email index is partial/non-conflicting
    try {
      const usersCol = mongoose.connection.collection('users');
      await usersCol.updateMany(
        { $or: [{ email: null }, { email: '' }] },
        { $unset: { email: '' } }
      );
      const existingIndexes = await usersCol.indexes();
      const emailIdx = existingIndexes.find((idx) => idx.name === 'email_1');
      if (emailIdx && (!emailIdx.partialFilterExpression || emailIdx.sparse)) {
        await usersCol.dropIndex('email_1');
        await usersCol.createIndex(
          { email: 1 },
          {
            unique: true,
            partialFilterExpression: { email: { $type: 'string', $gt: '' } },
            name: 'email_1'
          }
        );
      }
    } catch (idxErr) {
      // Ignore if index already in good state or collection not yet initialized
    }

    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.log('ℹ️ Running in resilient mode. Database operations will use fallback storage if Mongoose is disconnected.');
    return false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
