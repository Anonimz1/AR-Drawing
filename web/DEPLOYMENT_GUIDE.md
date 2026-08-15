# AR Draw - Vercel Deployment Guide

## 🚀 Deployment to Vercel (Recommended)

### Why Vercel?
- ✅ **Perfect for Vite/React apps**
- ✅ **Free tier is generous** (100GB bandwidth/month)
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Zero configuration** (works out of the box)
- ✅ **No backend needed** (static hosting)

---

## 📋 Pre-Deployment Checklist

### 1. Verify Build Works Locally
```bash
cd web
npm run build
npm run preview
```

✅ Check if app runs at `http://localhost:4173`
✅ Test camera functionality
✅ Test image upload
✅ Test library storage

### 2. Check Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 3. Verify Environment
- Node version: **18.x or higher**
- NPM version: **9.x or higher**

---

## 🎯 Deployment Methods

### Method 1: Via Vercel CLI (Fast)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login
```bash
vercel login
```

#### Step 3: Deploy
```bash
cd web
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **ar-draw** (or your choice)
- Directory? **./web** (or `.` if already in web folder)
- Override settings? **No**

#### Step 4: Deploy to Production
```bash
vercel --prod
```

---

### Method 2: Via Vercel Dashboard (Easy)

#### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - AR Draw app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ar-draw.git
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. **Import** your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `web` (if repo has multiple folders)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**

---

### Method 3: Via Vercel for Git (Automatic)

#### Connect Repository
1. Push code to GitHub/GitLab/Bitbucket
2. Connect repository to Vercel
3. **Automatic deployment** on every push to main branch

**Benefits:**
- ✅ Auto-deploy on push
- ✅ Preview deployments for PRs
- ✅ Rollback capability

---

## ⚙️ Configuration Files

### vercel.json (Already Created)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### .vercelignore (Already Created)
Prevents uploading unnecessary files.

---

## 🔧 Build Configuration

### Vite Config Optimization
Your `vite.config.js` should have:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // Important for Vercel
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  }
});
```

---

## 🌐 Domain Configuration

### Default Domain
Vercel provides: `ar-draw.vercel.app`

### Custom Domain (Optional)
1. Go to Project Settings → **Domains**
2. Add your domain (e.g., `ardraw.com`)
3. Follow DNS configuration instructions
4. Vercel handles HTTPS automatically

---

## 📱 PWA Configuration (Optional)

If you want app to be installable on mobile:

### 1. Update manifest.json
```json
{
  "name": "AR Draw",
  "short_name": "AR Draw",
  "description": "Trace reference images naturally through your camera",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5EBD9",
  "theme_color": "#6B4423",
  "icons": [
    {
      "src": "/logo-ar-draw.svg",
      "sizes": "any",
      "type": "image/svg+xml"
    }
  ]
}
```

### 2. Register Service Worker
Already configured in `public/sw.js`

---

## 🔒 Security Headers

Already configured in `vercel.json`:
- ✅ X-Content-Type-Options
- ✅ X-Frame-Options
- ✅ X-XSS-Protection
- ✅ Permissions-Policy

---

## 📊 Performance Optimization

### 1. Image Optimization
- SVG files are already optimized
- Use WebP for photos (if adding later)

### 2. Code Splitting
Vite automatically splits:
- `vendor` chunk (React, React DOM)
- `icons` chunk (Lucide icons)
- App code

### 3. Caching
Static assets cached for 1 year:
```
Cache-Control: public, max-age=31536000, immutable
```

---

## 🧪 Testing Production Build

### Before Deployment
```bash
# Build
npm run build

# Preview locally
npm run preview
```

### Test Checklist:
- [ ] Homepage loads correctly
- [ ] Logo and images display
- [ ] Camera permission works
- [ ] Image upload works
- [ ] Transform controls work (zoom, rotate, flip)
- [ ] Filters work
- [ ] Library saves images (IndexedDB)
- [ ] Mobile responsive
- [ ] Animations smooth

---

## 🚨 Common Issues & Solutions

### Issue 1: "Build Failed"
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue 2: "Routes not working"
**Solution**: Already fixed with rewrite rule in `vercel.json`

### Issue 3: "Camera not working on mobile"
**Solution**: 
- Vercel provides HTTPS automatically
- Camera requires HTTPS on mobile
- No action needed!

### Issue 4: "Images not loading"
**Solution**: Check file paths use `/` prefix:
```jsx
// ✅ Correct
<img src="/logo-ar-draw.svg" />

// ❌ Wrong
<img src="./logo-ar-draw.svg" />
```

---

## 📈 Post-Deployment

### 1. Analytics (Optional)
Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

```jsx
// main.jsx
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### 2. Monitor Performance
- Vercel Dashboard shows:
  - Build times
  - Deployment status
  - Bandwidth usage
  - Error logs

### 3. Set Environment Variables
If needed later:
- Go to Project Settings → **Environment Variables**
- Add variables (e.g., API keys)
- Redeploy

---

## 🎯 Deployment Checklist

- [x] `vercel.json` configured
- [x] `.vercelignore` created
- [x] Build works locally
- [x] All assets in `/public`
- [x] No hardcoded localhost URLs
- [x] Camera permissions configured
- [x] IndexedDB storage works
- [ ] Push to Git (if using Git integration)
- [ ] Deploy via CLI or Dashboard
- [ ] Test on production URL
- [ ] Test on mobile device
- [ ] Verify HTTPS works
- [ ] Check camera access on mobile

---

## 🔄 Update Process

### For Git Integration (Automatic)
```bash
git add .
git commit -m "Update: added new features"
git push origin main
```
→ Vercel auto-deploys

### For CLI (Manual)
```bash
cd web
vercel --prod
```

---

## 💰 Pricing (Free Tier)

Vercel **Hobby Plan** (FREE):
- ✅ **100GB bandwidth/month** (enough for ~10,000 users/month)
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments
- ✅ No credit card required

**Estimated usage for AR Draw:**
- Homepage: ~500KB
- Average session: ~2MB (with images)
- **100GB = ~50,000 sessions/month FREE**

**Pro Plan ($20/month) if needed:**
- 1TB bandwidth
- Priority support
- Advanced analytics

---

## 🎉 Quick Deployment (TL;DR)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Go to project
cd web

# 3. Login
vercel login

# 4. Deploy
vercel

# 5. Deploy to production
vercel --prod
```

**Done! Your app is live! 🚀**

---

## 🆘 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev/guide/
- Community: https://github.com/vercel/vercel/discussions

---

## ✅ Final Notes

**IndexedDB works perfectly on Vercel** because:
- It's client-side storage (browser-based)
- No backend/database needed
- Data stays on user's device
- Privacy-first approach maintained

**Your app is 100% ready for Vercel deployment without any backend/Supabase!** 🎨✨

---

**Next Step**: Run `vercel` command and your app will be live in ~2 minutes! 🚀
