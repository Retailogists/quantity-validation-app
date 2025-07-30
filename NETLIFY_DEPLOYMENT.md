# 🌐 Netlify Deployment Guide

Your Quantity Validation app is now configured for **Netlify deployment** with serverless functions!

## 🚀 Quick Deploy to Netlify

### Option 1: GitHub Auto-Deploy (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "Add new site" → "Import from Git"
   - Connect your GitHub repository
   - Configure build settings:
     - **Build command**: `echo 'Netlify build complete'`
     - **Publish directory**: `public`
     - **Functions directory**: `netlify/functions`

3. **Set Environment Variables** in Netlify:
   - Go to Site Settings → Environment Variables
   - Add: `SHOPIFY_API_SECRET=your_secret_key`
   - Get secret from Partner Dashboard → Your App → App Setup

4. **Deploy**: Netlify will auto-deploy your app!

### Option 2: Netlify CLI Deploy

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login and Deploy**:
   ```bash
   netlify login
   netlify init
   netlify deploy --prod
   ```

3. **Set Environment Variables**:
   ```bash
   netlify env:set SHOPIFY_API_SECRET your_secret_key
   ```

## 🔧 Configuration

### 1. Update URLs in Your App
Once deployed, get your Netlify URL (e.g., `https://amazing-app-123.netlify.app`) and update:

**In `shopify.app.toml`:**
```toml
application_url = "https://your-actual-app.netlify.app"

[auth]
redirect_urls = [
  "https://your-actual-app.netlify.app/auth/callback"
]
```

### 2. Deploy App Configuration
```bash
shopify app deploy
```

### 3. Update Partner Dashboard
In your Shopify Partner Dashboard:
- Go to Apps → Your App → App Setup
- Update "App URL" to your Netlify URL
- Update "Allowed redirection URL(s)" to include your callback URL

## 🛠️ Netlify Features Used

### Serverless Functions
- **`/auth`**: OAuth initiation
- **`/auth/callback`**: OAuth token exchange  
- **`/health`**: Health check endpoint

### Static Hosting
- **Frontend**: Responsive dashboard with App Bridge integration
- **Auto-routing**: Handles shop parameters dynamically
- **CDN**: Global content delivery

### Environment Variables
- **`SHOPIFY_API_SECRET`**: Required for OAuth flow
- **`URL`**: Auto-set by Netlify (your app domain)

## 📱 Testing Your Deployed App

### 1. Direct Access
Visit your Netlify URL to see the installation instructions.

### 2. Installation Test
Use the installation link:
```
https://your-app.netlify.app/auth?shop=your-store.myshopify.com
```

### 3. Shopify Admin Access
Once installed, the app should appear in your store's Apps section.

### 4. Health Check
Test the health endpoint:
```
https://your-app.netlify.app/health
```

## 🎯 Current Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Shopify       │───▶│   Netlify App    │───▶│  Shopify        │
│   Admin         │    │                  │    │  Functions      │
│                 │    │  ┌─────────────┐ │    │                 │
│                 │    │  │  Frontend   │ │    │  ┌────────────┐ │
│                 │    │  │  (Static)   │ │    │  │ Quantity   │ │
│                 │    │  └─────────────┘ │    │  │ Validation │ │
│                 │    │                  │    │  │ (WASM)     │ │
│                 │    │  ┌─────────────┐ │    │  └────────────┘ │
│                 │    │  │ Functions   │ │    │                 │
│   OAuth Flow    │◀───│  │ (Auth/API)  │ │    │                 │
│                 │    │  └─────────────┘ │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🔄 Continuous Deployment

Every push to your `main` branch will automatically:
1. ✅ Deploy updated frontend
2. ✅ Deploy updated functions
3. ✅ Update environment variables (if configured)

To update your Shopify Function:
```bash
shopify app deploy
```

## 🐛 Troubleshooting

### Function Not Working
- Check Netlify Functions logs in dashboard
- Verify environment variables are set
- Test functions locally: `netlify dev`

### OAuth Issues
- Verify `SHOPIFY_API_SECRET` is correct
- Check redirect URLs match in all places
- Ensure HTTPS is used (Netlify provides this automatically)

### App Not Loading
- Check browser console for errors
- Verify App Bridge initialization
- Test health endpoint

## 🚨 Security Notes

- ✅ **HTTPS**: Automatically provided by Netlify
- ✅ **Environment Variables**: Secure server-side storage
- ✅ **OAuth Flow**: Proper token exchange
- ⚠️ **API Secret**: Never expose in frontend code

## 🎉 You're Done!

Your Quantity Validation app is now:
- ✅ **Deployed on Netlify**
- ✅ **OAuth-enabled**
- ✅ **Function active** (Version 39)
- ✅ **Auto-scaling**
- ✅ **Global CDN**

Test your validation function and enjoy zero maintenance! 🚀 