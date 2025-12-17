import mongoose from 'mongoose';
import dbConnect from '../lib/db/mongodb';
import OsintTarget from '../lib/models/OsintTarget';

async function run() {
  try {
    await dbConnect();
    const res = await OsintTarget.updateMany(
      { $or: [{ targetType: { $exists: false } }, { targetType: null }] },
      { $set: { targetType: 'person' } }
    );
    console.log(`Backfilled targetType for ${res.modifiedCount} documents.`);
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    await mongoose.connection.close();
  }
}

run();
