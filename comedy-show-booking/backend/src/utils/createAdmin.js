/**
 * Admin Seed Script
 * Run with: npm run create-admin
 *
 * Creates an admin user in the database.
 * Set ADMIN_EMAIL and ADMIN_PASSWORD as environment variables before running.
 * Example:
 *   ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=YourSecurePass1! npm run create-admin
 */

const bcrypt = require('bcryptjs');
require('dotenv').config();

const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@comedyshow.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('❌ ADMIN_PASSWORD environment variable is required.');
  console.error('   Set it before running: ADMIN_PASSWORD=YourSecurePass1! npm run create-admin');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI environment variable is not set.');
  console.error('   Copy .env.example to .env and configure your MongoDB connection string.');
  process.exit(1);
}

// Use the shared User model to avoid schema duplication
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');

async function createAdmin() {
  try {
    await connectDB();

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role === 'admin') {
        console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
      } else {
        existing.role = 'admin';
        existing.password = ADMIN_PASSWORD; // pre-save hook will hash it
        await existing.save();
        console.log(`✅ Existing user promoted to admin: ${ADMIN_EMAIL}`);
      }
    } else {
      await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD, // pre-save hook will hash it
        role: 'admin'
      });
      console.log('✅ Admin user created successfully!');
    }

    console.log('');
    console.log('─────────────────────────────────');
    console.log('  Admin Login Credentials');
    console.log('─────────────────────────────────');
    console.log(`  Email   : ${ADMIN_EMAIL}`);
    console.log('  Password: (as provided via ADMIN_PASSWORD)');
    console.log('─────────────────────────────────');
    console.log('  ⚠️  This script is for development/setup use only.');
    console.log('  ⚠️  Change the password after first login!');
    console.log('');
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createAdmin();
