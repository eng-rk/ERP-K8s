#!/bin/bash
# =============================================================
# Super ERP - Kubernetes MongoDB Migration Script
# Run this INSIDE the Ubuntu VM terminal (where kubectl works)
# =============================================================
# 
# This script performs Phases 3-6 of the migration plan.
# The export file was already created on the Windows host at:
#   C:\Users\Admin\OneDrive\Desktop\super-crm-export.json
#
# Inside the Ubuntu VM the Windows OneDrive Desktop is accessible at:
#   /media/sf_Desktop/super-crm-export.json   (VirtualBox shared folder)
# OR copy it manually with:
#   cp /mnt/c/Users/Admin/OneDrive/Desktop/super-crm-export.json /tmp/
# =============================================================

set -e

NAMESPACE="super-erp"
MONGO_POD="mongo-deployment-5965f4f4d6-zx44l"
TARGET_DB="super-erp"

# Try to find the export file
EXPORT_FILE=""
if [ -f "/media/sf_Desktop/super-crm-export.json" ]; then
  EXPORT_FILE="/media/sf_Desktop/super-crm-export.json"
elif [ -f "/mnt/c/Users/Admin/OneDrive/Desktop/super-crm-export.json" ]; then
  EXPORT_FILE="/mnt/c/Users/Admin/OneDrive/Desktop/super-crm-export.json"
elif [ -f "/tmp/super-crm-export.json" ]; then
  EXPORT_FILE="/tmp/super-crm-export.json"
else
  echo "❌ ERROR: super-crm-export.json not found."
  echo "   Copy it from Windows to: /tmp/super-crm-export.json"
  echo "   Then rerun this script."
  exit 1
fi

echo "✅ Found export file at: $EXPORT_FILE"
ls -lh "$EXPORT_FILE"

echo ""
echo "=================================================="
echo "PHASE 1: Verifying Kubernetes target state..."
echo "=================================================="
kubectl get pods -n $NAMESPACE
kubectl exec -n $NAMESPACE $MONGO_POD -- mongosh --quiet --eval "
  const db = db.getSiblingDB('$TARGET_DB');
  const stats = db.stats();
  print('Current K8s super-erp: ' + stats.objects + ' documents, ' + stats.collections + ' collections');
  print('leads: ' + db.leads.countDocuments());
  print('users: ' + db.users.countDocuments());
"

echo ""
echo "=================================================="
echo "PHASE 3: Copying export file into Mongo pod..."
echo "=================================================="
kubectl cp "$EXPORT_FILE" "$NAMESPACE/$MONGO_POD:/tmp/super-crm-export.json"
echo "Verifying file inside pod:"
kubectl exec -n $NAMESPACE $MONGO_POD -- ls -lh /tmp/super-crm-export.json

echo ""
echo "=================================================="
echo "PHASE 4: Importing data into super-erp database..."
echo "=================================================="
kubectl exec -n $NAMESPACE $MONGO_POD -- mongosh --quiet "$TARGET_DB" --eval "
  const fs = require('fs');
  const raw = fs.readFileSync('/tmp/super-crm-export.json', 'utf8');
  const data = JSON.parse(raw);
  let totalInserted = 0;
  for (const [colName, docs] of Object.entries(data)) {
    if (!Array.isArray(docs) || docs.length === 0) continue;
    try {
      const res = db.getCollection(colName).insertMany(docs, { ordered: false });
      totalInserted += res.insertedCount;
      print('  ✓ ' + colName + ': inserted ' + res.insertedCount + ' documents');
    } catch(e) {
      if (e.code === 11000) {
        print('  ⚠ ' + colName + ': some duplicates skipped (data already exists)');
      } else {
        print('  ✗ ' + colName + ': ERROR - ' + e.message);
      }
    }
  }
  print('\nTotal inserted: ' + totalInserted);
"

echo ""
echo "=================================================="
echo "PHASE 5: Verifying restored document counts..."
echo "=================================================="
kubectl exec -n $NAMESPACE $MONGO_POD -- mongosh --quiet "$TARGET_DB" --eval "
  const collections = [
    'leads','campaigns','users','contracts','payrollentries',
    'employeebankaccounts','paymenttransactions','payrollruns',
    'govdoctemplates','trainings','emails','companybankaccounts',
    'paymentmethods','paymentgateways','auxlogs','detailedschedules',
    'products','inventoryitems','warehouses','stocklevels','shipments'
  ];
  print('\n=== Final Document Counts in K8s super-erp ===');
  let total = 0;
  collections.forEach(c => {
    const n = db.getCollection(c).countDocuments();
    total += n;
    if (n > 0) print('  ✅ ' + c + ': ' + n);
    else print('  -  ' + c + ': 0');
  });
  print('\nTotal business documents: ' + total);
  const st = db.stats();
  print('DB total objects: ' + st.objects);
  print('DB dataSize: ' + (st.dataSize/1024).toFixed(1) + ' KB');
"

echo ""
echo "=================================================="
echo "PHASE 6: Restarting backend deployment..."
echo "=================================================="
kubectl rollout restart deployment/backend-deployment -n $NAMESPACE
kubectl rollout status deployment/backend-deployment -n $NAMESPACE --timeout=90s
echo ""
echo "Last 30 lines of backend logs:"
kubectl logs -n $NAMESPACE deployment/backend-deployment --tail=30

echo ""
echo "✅ Migration complete!"
echo "   Super ERP now has real CRM + HRM + Finance data in Kubernetes."
