# 🚀 Automated Quantity Validation App

**Zero human interaction needed after initial setup!**

This app automatically validates minimum quantities based on **real inventory levels** with automatic metafield creation.

## ✨ Features

- ✅ **Fully Automated** - Automatic metafield setup, no manual configuration
- ✅ **Real-time Sync** - Inventory synced automatically via Flow  
- ✅ **Smart Validation** - Blocks checkout when inventory < 3
- ✅ **Multi-variant Support** - Works with single & multi-variant products
- ✅ **Zero Maintenance** - Runs continuously in background

## 🎯 How It Works

1. **App creates metafields** - Automatically sets up required metafield definitions
2. **Flow syncs inventory** - Populates metafields when inventory changes
3. **Function validates** - Checks inventory levels during cart/checkout
4. **Smart blocking** - Only blocks when product inventory < 3 units

## ⚡ **Quick Setup (5 Minutes)**

### **Step 1: Install Dependencies**
```bash
npm install
```

### **Step 2: Set Up Environment**
Create a `.env` file with:
```env
SHOPIFY_DOMAIN=testb2brl.myshopify.com
SHOPIFY_ACCESS_TOKEN=shppa_your_private_app_token_here
```

**To get your access token:**
1. **Shopify Admin** → **Apps** → **App and sales channel settings**
2. **Develop apps** → **Create an app**
3. **Configure Admin API scopes**: `read_products`, `write_products`
4. **Install app** → **Get access token**

### **Step 3: Automatic Metafield Setup**
```bash
npm run setup-metafields
```

This automatically creates:
- **Variant metafield**: `inventory.available_quantity`
- **Product metafield**: `inventory.available_quantity` (fallback)

### **Step 4: Deploy Function**
```bash
shopify app deploy
```

### **Step 5: Set Up Flow (Manual - 2 minutes)**
Follow **`MANUAL_FLOW_SETUP.md`** to create the Flow workflow that populates the metafields.

## 🧪 **Testing**

### **Test Complete Flow:**
1. **Change inventory** on any product
2. **Check metafields** are populated
3. **Test validation**: 
   - Products with inventory ≥ 3 → ✅ Allow purchase
   - Products with inventory < 3 → ❌ Block with error

## 🔧 **Troubleshooting**

### **Metafield Setup Issues:**
```bash
# Check if metafields were created
npm run setup-metafields
```

### **Flow Not Working:**
- Ensure Flow workflow is **active**
- Test by changing inventory levels
- Check **Flow runs** in Shopify Flow dashboard

### **Function Not Validating:**
- Verify latest function is deployed
- Check metafields exist on products
- Test in clean browser session

## 📊 **Architecture**

```
[Inventory Change] 
       ↓
[Shopify Flow] → Updates metafields
       ↓  
[Validation Function] → Reads metafields
       ↓
[Block/Allow Purchase]
```

## 🎉 **Benefits**

- **🔄 Automatic**: App creates metafields, Flow syncs data
- **⚡ Real-time**: Always reflects current inventory
- **🚀 Scalable**: Works for unlimited products  
- **🛡️ Server-side**: Cannot be bypassed
- **🎯 Accurate**: Based on real inventory levels

## 📞 **Support**

If you need help:
1. Check the troubleshooting section above
2. Review `MANUAL_FLOW_SETUP.md` for Flow setup
3. Verify environment variables are correct
4. Test with a simple inventory change

**Your app now automatically handles everything except the Flow setup!** 🚀 