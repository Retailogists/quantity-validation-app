import cron from 'node-cron';

// Automated Inventory Sync Script
// This runs automatically to keep metafields in sync with real inventory

const SHOPIFY_DOMAIN = process.env.SHOPIFY_DOMAIN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const MINIMUM_QUANTITY = 3;

class InventorySync {
  constructor() {
    this.baseURL = `https://${SHOPIFY_DOMAIN}/admin/api/2023-10/`;
    this.headers = {
      'X-Shopify-Access-Token': ACCESS_TOKEN,
      'Content-Type': 'application/json',
    };
  }

  async fetchAllProducts() {
    try {
      const response = await fetch(`${this.baseURL}products.json?limit=250`, {
        headers: this.headers,
      });
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getInventoryLevels(variantId, locationId) {
    try {
      const response = await fetch(
        `${this.baseURL}inventory_levels.json?inventory_item_ids=${variantId}&location_ids=${locationId}`,
        { headers: this.headers }
      );
      const data = await response.json();
      return data.inventory_levels?.[0]?.available || 0;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      return 0;
    }
  }

  async getDefaultLocation() {
    try {
      const response = await fetch(`${this.baseURL}locations.json`, {
        headers: this.headers,
      });
      const data = await response.json();
      return data.locations?.[0]?.id || null;
    } catch (error) {
      console.error('Error fetching locations:', error);
      return null;
    }
  }

  async updateMetafield(ownerId, ownerResource, inventoryCount) {
    const metafieldData = {
      metafield: {
        namespace: 'app',
        key: 'inventory_quantity',
        value: inventoryCount.toString(),
        type: 'number_integer',
        owner_id: ownerId,
        owner_resource: ownerResource,
      },
    };

    try {
      const response = await fetch(`${this.baseURL}metafields.json`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(metafieldData),
      });

      if (response.ok) {
        console.log(`✅ Updated ${ownerResource} ${ownerId}: ${inventoryCount} units`);
        return true;
      } else {
        console.error(`❌ Failed to update ${ownerResource} ${ownerId}`);
        return false;
      }
    } catch (error) {
      console.error('Error updating metafield:', error);
      return false;
    }
  }

  async syncAllInventory() {
    console.log('🔄 Starting automated inventory sync...');
    
    const defaultLocation = await this.getDefaultLocation();
    if (!defaultLocation) {
      console.error('❌ No default location found');
      return;
    }

    const products = await this.fetchAllProducts();
    console.log(`📦 Found ${products.length} products to sync`);

    let syncCount = 0;

    for (const product of products) {
      if (product.variants && product.variants.length > 1) {
        // Multi-variant product: sync each variant
        for (const variant of product.variants) {
          const inventory = await this.getInventoryLevels(
            variant.inventory_item_id,
            defaultLocation
          );
          
          const success = await this.updateMetafield(
            variant.id,
            'variant',
            inventory
          );
          
          if (success) syncCount++;
          
          // Rate limiting: wait 100ms between requests
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } else {
        // Single variant: sync at product level
        const variant = product.variants[0];
        const inventory = await this.getInventoryLevels(
          variant.inventory_item_id,
          defaultLocation
        );
        
        const success = await this.updateMetafield(
          product.id,
          'product',
          inventory
        );
        
        if (success) syncCount++;
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    console.log(`✅ Sync complete! Updated ${syncCount} items`);
    console.log(`⏰ Next sync in 5 minutes`);
  }

  startAutomaticSync() {
    console.log('🚀 Starting automated inventory sync system...');
    console.log('📅 Running every 5 minutes');
    
    // Run immediately on startup
    this.syncAllInventory();
    
    // Then run every 5 minutes
    cron.schedule('*/5 * * * *', () => {
      this.syncAllInventory();
    });
  }
}

// Auto-start if run directly
if (process.env.NODE_ENV !== 'test') {
  const sync = new InventorySync();
  sync.startAutomaticSync();
}

export default InventorySync; 