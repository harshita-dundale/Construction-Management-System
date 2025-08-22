import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    
    await db.collection('materials').dropIndex('name_1');
    console.log('✅ Index dropped successfully');
  } catch (error) {
    console.log('Index already dropped or not found');
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

dropIndex();