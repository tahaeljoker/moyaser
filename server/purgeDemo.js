import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { Unit } from './models/Unit.js';
import { User } from './models/User.js';
import { SiteSettings } from './models/SiteSettings.js';

dotenv.config();

async function purgeDemoData() {
  console.log('[Purge Demo] Starting demo data purge...');
  await connectDB();

  // 1. Delete seeded demo units U-01 to U-24
  const demoRegex = /^U-(0[1-9]|1[0-9]|2[0-4])$/;
  const deleteResult = await Unit.deleteMany({ unitCode: demoRegex });
  console.log(`[Purge Demo] Deleted ${deleteResult.deletedCount} demo units (U-01 to U-24).`);

  // 2. Upgrade default developer admin account to super_admin
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@muyassar-ra.com').toLowerCase().trim();
  const updatedUser = await User.findOneAndUpdate(
    { email: adminEmail },
    { $set: { role: 'super_admin', name: 'المطور ومالك النظام الرئيسي' } },
    { new: true }
  );

  if (updatedUser) {
    console.log(`[Purge Demo] Upgraded ${adminEmail} to super_admin successfully.`);
  } else {
    console.log(`[Purge Demo] Admin user ${adminEmail} not found. Skipping upgrade.`);
  }

  // 3. Mark SiteSettings as isDemoPurged = true
  await SiteSettings.findOneAndUpdate(
    {},
    { $set: { isDemoPurged: true } },
    { upsert: true }
  );
  console.log('[Purge Demo] SiteSettings updated: isDemoPurged = true.');

  console.log('[Purge Demo] Demo purge completed successfully.');
  await mongoose.disconnect();
}

purgeDemoData()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[Purge Demo Error]', err);
    process.exit(1);
  });
