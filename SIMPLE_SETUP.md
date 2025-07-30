# 🚀 Simple Setup Guide (Partners App)

Since you're using **Shopify Partners**, the setup is much simpler!

## ✅ **Current Status**
- ✅ App created in Partners
- ✅ Function deployed to test store
- ✅ App installed on `testb2brl.myshopify.com`

## 🎯 **What's Missing: Just Flow Setup**

Your Function is ready but needs **Flow to create metafields**. Here's the simple 2-step process:

## **Step 1: Set Up Flow (2 minutes)**

1. **Go to**: `testb2brl.myshopify.com/admin/apps/shopify-flow`
2. **Create workflow** named: `Inventory to Metafield Sync`
3. **Add trigger**: "Inventory level changed"
4. **Add action**: "Update metafield" with:
   ```
   Owner resource: Product variant
   Owner: {{ InventoryLevel.InventoryItem.Variant }}
   Namespace: inventory
   Key: available_quantity
   Value: {{ InventoryLevel.Available }}
   Value type: Integer
   ```
5. **Save & activate**

## **Step 2: Test It**

1. **Change inventory** on your "quantity test" product
2. **Flow will automatically create** the metafield definition
3. **Your Function will start working** with real inventory

## 🎉 **That's It!**

**No access tokens needed, no complex scripts** - Flow will handle everything automatically when you set it up.

## 🧪 **Expected Results**

After Flow setup:
- **Products with inventory ≥ 3**: ✅ Allow any cart quantity
- **Products with inventory < 3**: ❌ Block with error message
- **Real-time**: Updates automatically when inventory changes

## 🔧 **If You Want Visual Instructions**

Follow the detailed steps in `MANUAL_FLOW_SETUP.md` for screenshots and exact configuration.

**Ready to set up Flow? It's just a 2-minute visual workflow builder!** 🚀 