const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017';

async function run() {
  try {
    await mongoose.connect(uri);
    const adminDb = mongoose.connection.client.db().admin();
    const buildInfo = await adminDb.buildInfo();
    console.log(`Local MongoDB Version: ${buildInfo.version}`);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
