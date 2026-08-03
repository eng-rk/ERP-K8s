const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Role = require('../src/models/Role');

const ROLE_NAME_TO_CODE = {
  'Super CRM Administrator': 'SYSTEM_ADMINISTRATOR',
  'Sales Agent': 'SALES_AGENT',
  'Sales Manager': 'SALES_MANAGER',
  'Customer Support Agent': 'SALES_AGENT',
  'Customer Support Manager': 'SALES_MANAGER',
  'Marketing Specialist': 'SALES_AGENT',
  'Marketing Manager': 'SALES_MANAGER',
  'Business Analyst': 'EXECUTIVE',
  'CRM Developer': 'SYSTEM_ADMINISTRATOR',
  'CRM Consultant': 'SYSTEM_ADMINISTRATOR',
  'System Architect': 'SYSTEM_ADMINISTRATOR',
  'Executive User': 'EXECUTIVE',
  'HRM System Administrator': 'HR_MANAGER',
  'HR Manager': 'HR_MANAGER',
  'HR Specialist (Generalist)': 'HR_OFFICER',
  'Recruitment Specialist (Talent Acquisition)': 'HR_OFFICER',
  'Payroll Specialist': 'PAYROLL_SPECIALIST',
  'HR Business Partner': 'HR_OFFICER',
  'Training and Development Specialist': 'HR_OFFICER',
  'Performance Management Specialist': 'HR_OFFICER',
  'Attendance and Time Officer': 'HR_OFFICER',
  'Employee (General User)': 'HR_OFFICER',
  'HR Director / Executive HR User': 'HR_MANAGER',
  'RTM Team Member': 'HR_OFFICER',
  'Inventory Manager': 'WAREHOUSE_MANAGER',
  'Warehouse Manager': 'WAREHOUSE_MANAGER',
  'Receiving Clerk': 'WAREHOUSE_CLERK',
  'Shipping Clerk': 'WAREHOUSE_CLERK',
  'Warehouse Operator': 'WAREHOUSE_CLERK',
  'Inventory Clerk': 'WAREHOUSE_CLERK',
  'Quality Inspector': 'WAREHOUSE_CLERK'
};

const runMigration = async () => {
  const isDryRun = process.argv.includes('--dry-run');

  console.log('====================================================');
  console.log(`[IAM Migration Engine] ${isDryRun ? 'DRY-RUN MODE (No DB Writes)' : 'REAL EXECUTION MODE'}`);
  console.log('====================================================');

  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/super-erp';
    console.log('[Database] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[Database] Connected successfully.');

    // Fetch all roles to build lookup map
    const dbRoles = await Role.find();
    const roleByCode = {};
    const roleByName = {};

    dbRoles.forEach(r => {
      roleByCode[r.code] = r;
      roleByName[r.name] = r;
    });

    console.log(`[Role Lookup Map Built] ${dbRoles.length} Roles cataloged.`);

    // Fetch all users
    const users = await User.find();
    console.log(`[Users Migration] Found ${users.length} user records.`);

    let processed = 0;
    let rolesLinked = 0;
    let skipped = 0;
    let errors = 0;

    for (const user of users) {
      processed++;
      const legacyRole = user.role;

      if (!legacyRole) {
        skipped++;
        console.log(`- User [${user.email}]: Skipped (No legacy role assigned)`);
        continue;
      }

      // Resolve matching Role document
      const targetCode = ROLE_NAME_TO_CODE[legacyRole] || legacyRole.toUpperCase().replace(/\s+/g, '_');
      const matchingRole = roleByCode[targetCode] || roleByName[legacyRole];

      if (!matchingRole) {
        errors++;
        console.warn(`! User [${user.email}]: Warning - No matching Role document found for legacy role '${legacyRole}' (Target Code: ${targetCode})`);
        continue;
      }

      // Check if already linked
      const existingRolesStr = (user.roles || []).map(r => r.toString());
      const roleIdStr = matchingRole._id.toString();

      if (existingRolesStr.includes(roleIdStr)) {
        skipped++;
        console.log(`- User [${user.email}]: Already linked to Role '${matchingRole.name}' (${matchingRole.code})`);
      } else {
        rolesLinked++;
        console.log(`+ User [${user.email}]: Linking legacy role '${legacyRole}' -> Role '${matchingRole.name}' [ID: ${matchingRole._id}]`);

        if (!isDryRun) {
          if (!user.roles) user.roles = [];
          user.roles.push(matchingRole._id);
          await user.save();
        }
      }
    }

    console.log('\n====================================================');
    console.log('[Migration Summary]');
    console.log(`- Total Users Processed: ${processed}`);
    console.log(`- Roles Linked: ${rolesLinked}`);
    console.log(`- Already Linked / Skipped: ${skipped}`);
    console.log(`- Unresolved Errors: ${errors}`);
    console.log(`- Mode: ${isDryRun ? 'DRY-RUN (Simulated)' : 'REAL EXECUTION (Database Updated)'}`);
    console.log('====================================================\n');

    process.exit(0);

  } catch (err) {
    console.error('\n[Fatal Error] Migration failed:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
