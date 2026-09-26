import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/fridgeai';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    isMongoConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database] MongoDB connection failed (${error.message}). Using local in-memory persistence store.`);
    isMongoConnected = false;
    return false;
  }
};

export const getIsMongoConnected = () => isMongoConnected;
