/**
 * export-super-crm.js
 * Exports all collections from local super-crm database
 * to a JSON archive file that mongoimport can restore.
 * 
 * Output: C:\Users\Admin\Desktop\super-crm-export.json
 */
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const SOURCE_URI = 'mongodb://localhost:27017/super-crm';
// Output to the project root — will also copy to the OneDrive Desktop for VM access
const OUTPUT_FILE = path.join('C:\\Users\\Admin\\OneDrive\\Desktop', 'super-crm-export.json');

async function exportDatabase() {
  try {
    console.log('Connecting to local MongoDB super-crm...');
    await mongoose.connect(SOURCE_URI);
    console.log('Connected successfully.\n');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections in super-crm.\n`);

    const exportData = {};
    let totalDocs = 0;

    for (const col of collections) {
      const name = col.name;
      const docs = await db.collection(name).find({}).toArray();
      exportData[name] = docs;
      totalDocs += docs.length;
      if (docs.length > 0) {
        console.log(`  ✓ ${name}: ${docs.length} documents`);
      }
    }

    console.log(`\nTotal documents to export: ${totalDocs}`);
    console.log(`Writing to: ${OUTPUT_FILE}`);

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(exportData, null, 0));
    const stats = fs.statSync(OUTPUT_FILE);
    console.log(`\n✅ Export complete!`);
    console.log(`   File: ${OUTPUT_FILE}`);
    console.log(`   Size: ${(stats.size / 1024).toFixed(1)} KB`);
    console.log(`   Collections: ${Object.keys(exportData).length}`);
    console.log(`   Documents: ${totalDocs}`);
    console.log('\nNext step: run the import commands in the Ubuntu VM terminal:');
    console.log('  File is at OneDrive Desktop: C:\\Users\\Admin\\OneDrive\\Desktop\\super-crm-export.json');

    process.exit(0);
  } catch (err) {
    console.error('❌ Export failed:', err.message);
    process.exit(1);
  }
}

exportDatabase();
