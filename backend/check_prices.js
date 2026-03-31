import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI).then(async () => {
  console.log('Connected to DB');
  const db = mongoose.connection.db;

  const medicines = await db.collection('medicines').find({}).toArray();
  console.log(`Found ${medicines.length} medicines.`);
  let missing = 0;
  for (const m of medicines) {
    if (m.price === undefined || m.price === null) {
      console.log(`MISSING PRICE for medicine: ${m.name} (${m._id})`);
      missing++;
    }
  }
  if (missing === 0) console.log("All medicines have prices.");
  process.exit(0);
}).catch(console.error);
