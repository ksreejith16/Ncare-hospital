// =========================================================
//   Seed script — creates the first admin user.
//
//   Usage:    npm run seed
//   Reads:    SEED_ADMIN_USERNAME, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME
//   If unset, defaults to:  admin / changeme-now / Hospital Admin
//
//   Run this ONCE per environment, then change the password from the
//   admin dashboard (or via DB).
// =========================================================

import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb, Admin, inMemory } from '../utils/db.js';

const username = process.env.SEED_ADMIN_USERNAME || 'admin';
const password = process.env.SEED_ADMIN_PASSWORD || 'changeme-now';
const name     = process.env.SEED_ADMIN_NAME     || 'Hospital Admin';

(async () => {
  await connectDb();

  if (inMemory.enabled) {
    console.error('\n  ✗ MONGODB_URI is not set — seeding requires a real database.');
    console.error('    Set MONGODB_URI in .env and re-run, or use ENV-based admin login');
    console.error('    by setting ADMIN_USERNAME and ADMIN_PASSWORD in .env directly.\n');
    process.exit(1);
  }

  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`  → Admin "${username}" already exists. No changes made.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ username, passwordHash, name, role: 'superadmin' });

  console.log(`\n  ✓ Created admin user`);
  console.log(`    username: ${username}`);
  console.log(`    password: ${password}`);
  console.log(`    name:     ${name}`);
  console.log(`\n  ⚠  Change the password from the admin dashboard immediately after first login.\n`);

  await mongoose.disconnect();
})();
