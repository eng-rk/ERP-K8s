const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017';

async function run() {
  try {
    await mongoose.connect(uri);
    const adminDb = mongoose.connection.client.db().admin();
    const buildInfo = await adminDb.buildInfo();
    console.log(`Local MongoDB Version: ${buildInfo.version}`);

    const dbsInfo = await adminDb.listDatabases();
    console.log(`\nFound ${dbsInfo.databases.length} databases:`);

    for (const dbInfo of dbsInfo.databases) {
      const db = mongoose.connection.client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      let totalDocs = 0;
      const nonEmpty = [];
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        totalDocs += count;
        if (count > 0) nonEmpty.push(`${col.name}:${count}`);
      }
      const flag = totalDocs > 0 ? '  *** HAS DATA ***' : '';
      console.log(`\nDatabase: ${dbInfo.name} (${collections.length} collections, ${totalDocs} total docs)${flag}`);
      if (nonEmpty.length) nonEmpty.forEach(s => console.log(`   - ${s}`));
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
run();
