# 🔄 Shopify Flow Import & Setup Guide

## ✅ **Flow Import IS Supported!**

Based on the exported Flow example, Shopify Flow **DOES support imports** using properly formatted `.flow` files.

## 📁 **Available Template**

**`inventory-sync.flow`** - Properly formatted Flow template for inventory-to-metafield synchronization

## 🚀 **Import Methods**

### **Method 1: Direct Import (Try This First)**

1. **Go to Shopify Flow**: `Admin → Apps → Shopify Flow`
2. **Look for**: "Import workflow" or "Upload" button 
3. **Select**: `inventory-sync.flow`
4. **Click**: "Import" or "Upload"
5. **Activate** the imported workflow

### **Method 2: Drag & Drop**

1. **Open Shopify Flow** in your browser
2. **Drag** the `inventory-sync.flow` file directly into the Flow interface
3. **Confirm** import and activate

### **Method 3: Manual Setup (Fallback)**

If import doesn't work, create manually:

#### **Step 1: Add Trigger**
- **Type**: `Inventory level changed`
- **Settings**: All locations, all products

#### **Step 2: Add Action**
- **Type**: `Update metafield`
- **Owner resource**: `Product variant`
- **Owner**: `{{ InventoryLevel.InventoryItem.Variant }}`
- **Namespace**: `inventory`
- **Key**: `available_quantity`
- **Value**: `{{ InventoryLevel.Available }}`
- **Type**: `integer`

## 🧪 **Testing After Import**

1. **Activate** the workflow
2. **Change inventory** on any product
3. **Check Flow runs** in workflow dashboard
4. **Verify metafields** created on products:
   - **Namespace**: `inventory`
   - **Key**: `available_quantity`
5. **Test validation function** with real inventory

## 🔧 **Troubleshooting**

**❌ Import fails?**
- Check file format is exactly `.flow`
- Try manual setup (Method 3)
- Ensure you're using Shopify Plus (some features require Plus)

**❌ Flow not triggering?**
- Check workflow is **active**
- Verify trigger settings
- Test with small inventory change

**❌ Metafields not updating?**
- Check namespace: `inventory`
- Check key: `available_quantity`
- Verify variable syntax in Flow

**❌ Function not reading metafields?**
- Function deployment may be in progress
- Test again in a few minutes
- Check GraphQL query matches metafield namespace/key 