# 🔧 Manual Shopify Flow Setup (5 Minutes)

## ✅ **Guaranteed Working Method**

Since Flow imports are complex, here's the **reliable manual setup**:

## 🚀 **Step-by-Step Setup**

### **Step 1: Access Flow**
1. Go to: `testb2brl.myshopify.com/admin/apps`
2. Find **"Shopify Flow"** → Click **"Manage"**
3. Click **"Create workflow"**

### **Step 2: Name Your Workflow**
- **Name**: `Inventory to Metafield Sync`
- **Description**: `Auto-sync inventory for quantity validation`

### **Step 3: Add Trigger**
1. Click **"Add trigger"** (big + button)
2. **Search**: `inventory level`
3. **Select**: **"Inventory level changed"**
4. **Settings**: Leave default (all locations, all products)

### **Step 4: Add Action**
1. Click the **"+"** button **after** the trigger step
2. **Search**: `update metafield`
3. **Select**: **"Update metafield"**

### **Step 5: Configure Metafield Action**
**EXACT Configuration:**
```
Owner resource: Product variant
Owner: {{ InventoryLevel.InventoryItem.Variant }}
Namespace: inventory
Key: available_quantity  
Value: {{ InventoryLevel.Available }}
Value type: Integer
```

**Important Notes:**
- Type the variables **exactly** as shown (with double braces)
- The namespace MUST be `inventory`
- The key MUST be `available_quantity`

### **Step 6: Save & Activate**
1. Click **"Save"**
2. Click **"Turn on workflow"**  
3. **Confirm** activation

## 🧪 **Test Your Setup**

### **Immediate Test:**
1. **Go to Products** in admin
2. **Edit any product** 
3. **Change inventory** (e.g., 5 → 4)
4. **Save changes**

### **Verify Success:**
1. **Go back to Flow** → Check **"Workflow runs"** tab
2. **Should see recent run** with your product
3. **Check product metafields**:
   - **Products** → Select test product → **Metafields**
   - **Look for**: Namespace `inventory`, Key `available_quantity`

## ✅ **Expected Results**

After setup:
- **Any inventory change** → Flow runs automatically
- **Metafield updates** with current inventory level
- **Function validates** real inventory (not cart quantities)
- **Blocks orders** when inventory < 3

## 🎯 **Visual Guide**

**Your Flow should look like:**
```
[Inventory level changed] → [Update metafield]
```

**In the metafield action, you'll see:**
- Dropdown for "Owner resource" = Product variant
- Text field for "Owner" = {{ InventoryLevel.InventoryItem.Variant }}
- Text field for "Namespace" = inventory
- Text field for "Key" = available_quantity
- Text field for "Value" = {{ InventoryLevel.Available }}
- Dropdown for "Value type" = Integer

## 🔧 **Troubleshooting**

**❌ Trigger not working?**
- Check workflow is **"On"** (green toggle)
- Test with obvious inventory change (5 → 1)

**❌ Metafield not created?**
- Double-check the configuration exactly matches above
- Verify the variable syntax has double braces: `{{ }}`

**❌ Function not using metafields?**
- Function deployment may be in progress
- Test again in 2-3 minutes 