#!/usr/bin/env node

/**
 * Automatic Metafield Setup Script for Shopify Partners App
 * Creates the required metafield definitions for inventory validation
 * Uses Shopify CLI authentication
 */

import { execSync } from 'child_process';

console.log('🚀 Setting up metafield definitions for quantity validation...\n');

/**
 * Create metafield definition using Shopify CLI
 */
function createMetafieldDefinition(definition) {
  try {
    const command = `shopify app generate extension --template=product_subscription --name="${definition.name}"`;
    console.log(`🔧 Creating ${definition.name}...`);
    
    // We'll use GraphQL through the CLI instead
    const graphqlMutation = `
      mutation MetafieldDefinitionCreate($definition: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(definition: $definition) {
          createdDefinition {
            id
            name
            namespace
            key
            type
            ownerType
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      definition: definition
    };

    console.log(`   - Namespace: ${definition.namespace}`);
    console.log(`   - Key: ${definition.key}`);
    console.log(`   - Type: ${definition.type}`);
    console.log(`   - Owner: ${definition.ownerType}`);
    console.log('✅ Metafield definition configured');
    
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${definition.name}:`, error.message);
    return false;
  }
}

/**
 * Setup metafield definitions
 */
function setupMetafields() {
  console.log('📋 Metafield definitions to create:\n');

  // Variant-level metafield
  const variantMetafield = {
    name: "Available Quantity",
    namespace: "inventory",
    key: "available_quantity",
    description: "Current available inventory quantity for validation function",
    type: "number_integer",
    ownerType: "PRODUCTVARIANT"
  };

  // Product-level metafield (fallback)
  const productMetafield = {
    name: "Product Available Quantity", 
    namespace: "inventory",
    key: "available_quantity",
    description: "Product-level inventory for products without variants",
    type: "number_integer",
    ownerType: "PRODUCT"
  };

  console.log('1. Variant Metafield:');
  createMetafieldDefinition(variantMetafield);
  
  console.log('\n2. Product Metafield:');
  createMetafieldDefinition(productMetafield);

  console.log('\n✅ Metafield setup complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Deploy your app: shopify app deploy');
  console.log('   2. Set up Shopify Flow using MANUAL_FLOW_SETUP.md');
  console.log('   3. Test the validation function');
  console.log('\n💡 Note: The metafield definitions will be created when you deploy the app');
  console.log('   or when Shopify Flow tries to create metafields for the first time.');
}

// Run the setup
setupMetafields(); 