#!/usr/bin/env node
/**
 * import-to-k8s.js
 * 
 * Phases 3-5: Transfer + Restore super-crm data into Kubernetes super-erp.
 * 
 * Run this script INSIDE the Ubuntu VM terminal:
 *   node import-to-k8s.js
 * 
 * Prerequisites inside the VM:
 *   - kubectl configured for the minikube cluster
 *   - mongosh available (for verification)
 *   - access to this script file
 * 
 * The script:
 *   1. Copies super-crm-export.json into the Mongo pod
 *   2. Runs a mongosh script inside the pod to import all collections
 *   3. Verifies document counts after restore
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');

const NAMESPACE = 'super-erp';
const MONGO_POD = 'mongo-deployment-5965f4f4d6-zx44l';
const SOURCE_JSON = '/media/sf_Desktop/super-crm-export.json';
const POD_DEST = '/tmp/super-crm-export.json';
const TARGET_DB = 'super-erp';

function run(cmd, opts = {}) {
  console.log(`\n$ ${cmd}`);
  try {
    const out = execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts });
    if (out) process.stdout.write(out);
    return out;
  } catch (e) {
    console.error(e.stderr || e.message);
    if (!opts.ignoreError) throw e;
    return '';
  }
}

async function main() {
  console.log('=================================================');
  console.log('  Super ERP - Kubernetes MongoDB Migration Tool  ');
  console.log('=================================================\n');

  // --- PHASE 3: Copy export file into pod ---
  console.log('PHASE 3: Copying export file into Mongo pod...');
  if (!fs.existsSync(SOURCE_JSON)) {
    // Try Windows-mounted path via /mnt or Windows shares
    console.error(`ERROR: Export file not found at: ${SOURCE_JSON}`);
    console.error('Please copy the file from Windows:');
    console.error('  cp /mnt/c/Users/Admin/OneDrive/Desktop/super-crm-export.json /tmp/');
    console.error('  Then re-run this script with SOURCE_JSON=/tmp/super-crm-export.json');
    process.exit(1);
  }

  run(`kubectl cp ${SOURCE_JSON} ${NAMESPACE}/${MONGO_POD}:${POD_DEST}`);
  run(`kubectl exec -n ${NAMESPACE} ${MONGO_POD} -- ls -lh ${POD_DEST}`);

  // --- PHASE 4: Import all collections via mongosh ---
  console.log('\nPHASE 4: Importing collections into super-erp database...');

  // Build the mongosh inline script
  const mongoshScript = `
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync('${POD_DEST}', 'utf8'));
    const db = db.getSiblingDB('${TARGET_DB}');
    const results = {};
    for (const [colName, docs] of Object.entries(data)) {
      if (!docs || docs.length === 0) continue;
      try {
        const res = db.getCollection(colName).insertMany(docs, { ordered: false });
        results[colName] = res.insertedCount;
        print('  ✓ ' + colName + ': inserted ' + res.insertedCount);
      } catch(e) {
        print('  ⚠ ' + colName + ': ' + e.message);
      }
    }
    print('\\nImport complete.');
  `.replace(/\n/g, ' ');

  run(`kubectl exec -n ${NAMESPACE} ${MONGO_POD} -- mongosh --quiet --eval "${mongoshScript.replace(/"/g, '\\"')}"`);

  // --- PHASE 5: Verify counts ---
  console.log('\nPHASE 5: Verifying restored document counts...');

  const verifyScript = `
    const db = db.getSiblingDB('${TARGET_DB}');
    const collections = ['leads','campaigns','users','contracts','payrollentries','employeebankaccounts','paymenttransactions','payrollruns','govdoctemplates','trainings','emails','companybankaccounts','paymentmethods','paymentgateways','auxlogs','detailedschedules'];
    print('\\n=== Document Counts in Kubernetes super-erp ===');
    let total = 0;
    collections.forEach(c => {
      try {
        const n = db.getCollection(c).countDocuments();
        total += n;
        print('  ' + c + ': ' + n);
      } catch(e) {
        print('  ' + c + ': ERROR - ' + e.message);
      }
    });
    print('\\nTotal documents: ' + total);
    const stats = db.stats();
    print('DB objects: ' + stats.objects);
    print('DB dataSize: ' + stats.dataSize + ' bytes');
  `.replace(/\n/g, ' ');

  run(`kubectl exec -n ${NAMESPACE} ${MONGO_POD} -- mongosh --quiet --eval "${verifyScript.replace(/"/g, '\\"')}"`);

  // --- PHASE 6: Restart backend ---
  console.log('\nPHASE 6: Restarting backend deployment...');
  run(`kubectl rollout restart deployment/backend-deployment -n ${NAMESPACE}`);
  run(`kubectl rollout status deployment/backend-deployment -n ${NAMESPACE} --timeout=60s`);
  run(`kubectl logs -n ${NAMESPACE} deployment/backend-deployment --tail=30`);

  console.log('\n✅ Migration complete. Check logs above for any errors.');
}

main().catch(err => {
  console.error('\n❌ Migration failed:', err.message);
  process.exit(1);
});
