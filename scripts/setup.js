#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Quantity Validation App - Automated Setup');
console.log('===============================================\n');

// Check for required environment variables
const requiredEnvVars = ['SHOPIFY_DOMAIN', 'ACCESS_TOKEN'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Please set these environment variables:');
  console.log('   export SHOPIFY_DOMAIN=your-store.myshopify.com');
  console.log('   export ACCESS_TOKEN=your-private-app-access-token\n');
  console.log('💡 Or create a .env file with these values');
  process.exit(1);
}

console.log('✅ Environment variables configured');
console.log(`🏪 Store: ${process.env.SHOPIFY_DOMAIN}`);
console.log(`🔑 Access token: ${process.env.ACCESS_TOKEN?.substring(0, 8)}...`);

// Import and start the inventory sync
try {
  console.log('\n🔄 Starting automated inventory sync...');
  
  const { default: InventorySync } = await import('./sync-inventory.js');
  const sync = new InventorySync();
  
  console.log('✅ Sync system initialized');
  console.log('📅 Inventory will sync every 5 minutes automatically');
  console.log('🎯 Function will validate based on real inventory levels');
  console.log('\n🚀 Your app is now fully automated! No human interaction needed.');
  console.log('💡 The app will:');
  console.log('   • Automatically sync inventory every 5 minutes');
  console.log('   • Block checkout when inventory < 3 units');
  console.log('   • Allow purchases when inventory ≥ 3 units');
  console.log('   • Work with both single variants and multi-variant products');
  
  // Start the sync
  sync.startAutomaticSync();
  
} catch (error) {
  console.error('❌ Failed to start sync system:', error.message);
  process.exit(1);
}

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down inventory sync...');
  console.log('✅ Goodbye!');
  process.exit(0);
}); 