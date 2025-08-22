import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const cleanupMaterials = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const materialsCollection = db.collection('materials');

    // First, drop the problematic index
    try {
      await materialsCollection.dropIndex('name_1');
      console.log('✅ Dropped old unique index on name field');
    } catch (error) {
      console.log('Index name_1 not found or already dropped');
    }

    // Find and remove duplicate materials (keep the first one of each name per project)
    const duplicates = await materialsCollection.aggregate([
      {
        $group: {
          _id: { name: "$name", projectId: "$projectId" },
          count: { $sum: 1 },
          docs: { $push: "$_id" }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]).toArray();

    console.log(`Found ${duplicates.length} duplicate material groups`);

    for (const duplicate of duplicates) {
      // Keep the first document, remove the rest
      const [keep, ...remove] = duplicate.docs;
      
      if (remove.length > 0) {
        await materialsCollection.deleteMany({
          _id: { $in: remove }
        });
        console.log(`Removed ${remove.length} duplicate(s) for material: ${duplicate._id.name}`);
      }
    }

    console.log('✅ Cleanup completed. You can now restart your server.');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

cleanupMaterials();