import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import path from 'path';
import { connectDB } from './config/db.js';
import { Unit } from './models/Unit.js';
import { User } from './models/User.js';
import { units } from '../src/data/unitsData.js';
import { models } from '../src/data/modelsData.js';

dotenv.config();

export async function seedDatabase() {
  await connectDB();
  console.log('[Seed] Starting database seed...');

  // 1. Seed Units (Idempotent)
  const existingUnitsCount = await Unit.countDocuments();
  if (existingUnitsCount === 0) {
    console.log(`[Seed] Populating ${units.length} units from static data...`);

    const unitsToInsert = units.map((u) => {
      const modelInfo = models.find((m) => m.code === u.model) || models[0];

      return {
        unitCode: `U-${u.id}`,
        model: u.model,
        type: 'townhouse',
        area: u.area,
        facade: u.model === 'D' ? 'زاوية شرقية جنوبية' : 'شمالية عصرية',
        price: u.price,
        status: u.status,
        floorPlanSpecs: {
          builtArea: modelInfo.builtArea || 0,
          extraArea: modelInfo.extraArea || 0,
          totalArea: modelInfo.totalArea || 0,
          floors: modelInfo.floors || '',
          rooms: modelInfo.rooms || '',
          baths: modelInfo.baths || 4,
        },
        media: (modelInfo.gallery || []).map((g) => ({
          type: 'image',
          url: g.url,
          title: g.title,
        })),
      };
    });

    await Unit.insertMany(unitsToInsert);
    console.log(`[Seed] Successfully inserted ${unitsToInsert.length} units.`);
  } else {
    console.log(`[Seed] Units already seeded (${existingUnitsCount} records found). Skipping.`);
  }

  // 2. Seed Default Admin User (Idempotent)
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@muyassar-ra.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    console.log(`[Seed] Creating default admin user: ${adminEmail}...`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await User.create({
      name: 'مدير النظام الرئيسي',
      email: adminEmail,
      passwordHash,
      role: 'admin',
    });
    console.log(`[Seed] Default admin created successfully.`);
  } else {
    console.log(`[Seed] Admin user already exists (${adminEmail}). Skipping.`);
  }

  console.log('[Seed] Database seed completed successfully.');
}

// Allow direct CLI execution: node server/seed.js
const currentFile = fileURLToPath(import.meta.url);
const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFile);

if (isDirectExecution) {
  seedDatabase()
    .then(async () => {
      await mongoose.disconnect();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error('[Seed Error]', err);
      await mongoose.disconnect();
      process.exit(1);
    });
}
