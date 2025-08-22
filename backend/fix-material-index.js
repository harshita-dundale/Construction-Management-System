import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixMaterialIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('materials');

    // Drop the existing unique index on 'name' field
    try {
      await collection.dropIndex('name_1');
      console.log('✅ Dropped old unique index on name field');
    } catch (error) {
      console.log('Index name_1 not found or already dropped');
    }

    // The new compound index will be created automatically when the server starts
    console.log('✅ Index fix completed. Restart your server now.');
    
  } catch (error) {
    console.error('Error fixing index:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixMaterialIndex();