const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Permission = require('../src/models/Permission');
const Role = require('../src/models/Role');
const { SCOPES, SCOPE_HIERARCHY } = require('../src/utils/permissionScopes');
const { PERMISSIONS } = require('../src/utils/permissionConstants');
const { ROLE_TEMPLATES } = require('../src/utils/roleTemplateConstants');

const validateData = () => {
  console.log('[Validation] Running integrity checks...');

  // 1. Check duplicate permission IDs
  const permIds = new Set();
  for (const p of PERMISSIONS) {
    if (permIds.has(p.permissionId)) {
      throw new Error(`[Validation Error] Duplicate permissionId found: ${p.permissionId}`);
    }
    permIds.add(p.permissionId);

    // Validate scope
    if (!SCOPE_HIERARCHY.includes(p.defaultScope)) {
      throw new Error(`[Validation Error] Invalid defaultScope '${p.defaultScope}' in permission: ${p.permissionId}`);
    }
  }

  // 2. Check duplicate role codes
  const roleCodes = new Set();
  for (const r of ROLE_TEMPLATES) {
    if (roleCodes.has(r.roleCode)) {
      throw new Error(`[Validation Error] Duplicate roleCode found: ${r.roleCode}`);
    }
    roleCodes.add(r.roleCode);

    // Validate permission references & scopes
    for (const entry of r.permissions) {
      if (!permIds.has(entry.permissionId)) {
        throw new Error(`[Validation Error] Role '${r.roleCode}' references non-existent permissionId: ${entry.permissionId}`);
      }
      if (!SCOPE_HIERARCHY.includes(entry.scope)) {
        throw new Error(`[Validation Error] Role '${r.roleCode}' references invalid scope '${entry.scope}' for permission: ${entry.permissionId}`);
      }
    }
  }

  console.log(`[Validation Passed] ${PERMISSIONS.length} Permissions and ${ROLE_TEMPLATES.length} Role Templates verified clean.`);
};

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/super-erp';
    console.log(`[Database] Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log('[Database] Connected successfully.');

    // Run Validation
    validateData();

    // Ensure Indexes
    console.log('[Indexes] Ensuring indexes on Permission & Role models...');
    await Permission.createIndexes();
    await Role.createIndexes();

    // 1. Upsert Permissions via bulkWrite
    console.log('[Seeding] Bulk upserting Permissions...');
    const permissionOps = PERMISSIONS.map(p => ({
      updateOne: {
        filter: { permissionId: p.permissionId },
        update: { $set: p },
        upsert: true
      }
    }));

    const permResult = await Permission.bulkWrite(permissionOps);
    console.log(`[Seeding] Permissions -> Inserted: ${permResult.upsertedCount}, Modified/Matched: ${permResult.modifiedCount || permResult.matchedCount}`);

    // 2. Upsert Roles via bulkWrite
    console.log('[Seeding] Bulk upserting System Role Templates...');
    const roleOps = ROLE_TEMPLATES.map(r => ({
      updateOne: {
        filter: { code: r.roleCode },
        update: {
          $set: {
            name: r.displayName,
            code: r.roleCode,
            description: r.description,
            isSystemRole: r.isSystemRole,
            permissions: r.permissions
          }
        },
        upsert: true
      }
    }));

    const roleResult = await Role.bulkWrite(roleOps);
    console.log(`[Seeding] Roles -> Inserted: ${roleResult.upsertedCount}, Modified/Matched: ${roleResult.modifiedCount || roleResult.matchedCount}`);

    console.log('\n[Success] Permission Registry & System Roles successfully seeded!');
    process.exit(0);

  } catch (err) {
    console.error('\n[Error] Seeding failed:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = {
  validateData,
  seedDatabase
};
