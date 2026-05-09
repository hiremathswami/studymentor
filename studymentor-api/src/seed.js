/**
 * @file src/seed.js
 * @description Demo data seeder for initial setup.
 */

const supabase = require('./lib/supabase');

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Cleanup existing demo data (Optional)
    // Note: Be careful with this in production environments

    console.log('✅ Seeding complete!');
  } catch (err) {
    console.error(`❌ Seeding failed: ${err.message}`);
  } finally {
    process.exit();
  }
}

seed();
