const mongoose = require('mongoose');

async function main() {
  const uri = 'mongodb://localhost:27017/super-erp';
  try {
    await mongoose.connect(uri);
    console.log('Connected.');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const name = col.name;
      const count = await db.collection(name).countDocuments();
      console.log(`- Collection: ${name} (${count} docs)`);
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
  }
}

main();
