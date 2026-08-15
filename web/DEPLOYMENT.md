# AR Draw - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Git (optional)
- HTTPS domain (required for camera access in production)

## Build for Production

```bash
# Install dependencies
npm install

# Build optimized production bundle
npm run build
```

This creates an optimized build in the `dist/` folder.

## Deployment Options

### 1. Vercel (Recommended)

#### Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Via GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

**Configuration:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

#### Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### Via GitHub Integration

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

### 3. GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "vite build && gh-pages -d dist"

# Deploy
npm run deploy
```

**Note:** Update `vite.config.js` base path:
```javascript
export default defineConfig({
  base: '/repo-name/',
  // ...
})
```

### 4. Cloudflare Pages

1. Push code to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Pages → Create a project
4. Connect Git repository
5. Configure:
   - Framework: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`

### 5. AWS S3 + CloudFront

```bash
# Build
npm run build

# Install AWS CLI
# Configure AWS credentials
aws configure

# Create S3 bucket
aws s3 mb s3://ar-draw-app

# Upload files
aws s3 sync dist/ s3://ar-draw-app --delete

# Configure bucket for static website hosting
aws s3 website s3://ar-draw-app --index-document index.html

# Set up CloudFront for HTTPS (required for camera)
```

### 6. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Configure:
# - Public directory: dist
# - Single-page app: Yes
# - GitHub actions: Optional

# Build
npm run build

# Deploy
firebase deploy
```

## HTTPS Configuration

**Critical:** Camera access requires HTTPS in production.

### Free SSL Options

1. **Let's Encrypt** - Free SSL certificates
2. **Cloudflare** - Free SSL with CDN
3. **Vercel/Netlify** - Automatic HTTPS
4. **Firebase** - Free HTTPS on *.web.app domain

## Environment Variables

Create `.env.production`:

```bash
VITE_APP_NAME="AR Draw"
VITE_APP_TAGLINE="See it. Trace it. Draw it."
VITE_ENABLE_PWA=true
VITE_ENABLE_INDEXEDDB=true
```

## Performance Optimization

### 1. Enable Compression

Most hosting providers enable gzip/brotli by default. Verify:

```bash
curl -H "Accept-Encoding: gzip" -I https://your-domain.com
```

### 2. CDN Configuration

Use CDN for static assets:
- Cloudflare
- AWS CloudFront
- Netlify CDN (automatic)
- Vercel Edge Network (automatic)

### 3. Caching Headers

Add to your hosting configuration:

**Netlify (`netlify.toml`):**
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Vercel (`vercel.json`):**
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## PWA Configuration

Ensure these files are accessible:
- `/manifest.json`
- `/sw.js`
- `/favicon.svg`

Test PWA:
1. Open Chrome DevTools
2. Go to Application tab
3. Check:
   - Manifest
   - Service Workers
   - Cache Storage

## Post-Deployment Checklist

- [ ] HTTPS working
- [ ] Camera permission prompt appears
- [ ] Camera feed displays correctly
- [ ] Image upload works
- [ ] IndexedDB stores images
- [ ] Service Worker registers
- [ ] PWA installable
- [ ] Responsive on mobile
- [ ] Gestures work correctly
- [ ] Filters apply properly
- [ ] Performance acceptable (Lighthouse score >90)

## Testing Deployment

```bash
# Build and preview locally
npm run build
npm run preview

# Test on mobile
# Use ngrok or local network IP with HTTPS
```

## Monitoring

### Analytics (Optional)

Add privacy-friendly analytics:

1. **Plausible Analytics** (privacy-friendly)
2. **Simple Analytics** (privacy-friendly)
3. **Google Analytics** (requires consent)

### Error Tracking

Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay

## Performance Monitoring

Use:
- **Lighthouse** - Chrome DevTools
- **WebPageTest** - webpagetest.org
- **GTmetrix** - gtmetrix.com

Target scores:
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90
- PWA: ✓ (all checks)

## Troubleshooting

### Issue: Camera not working after deployment

**Solution:**
- Verify HTTPS is enabled
- Check browser console for errors
- Test on different browsers/devices
- Ensure correct permissions in manifest

### Issue: Service Worker not registering

**Solution:**
- Check `/sw.js` is accessible
- Verify HTTPS
- Clear browser cache
- Check DevTools → Application → Service Workers

### Issue: PWA not installable

**Solution:**
- Verify `manifest.json` is correct
- Ensure HTTPS
- Check all icons are accessible
- Test with Lighthouse PWA audit

### Issue: IndexedDB quota exceeded

**Solution:**
- Implement storage quota management
- Compress images before storage
- Add cleanup for old images
- Request persistent storage

## Security Headers

Add security headers to hosting config:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()
```

**Note:** Allow camera for your domain in Permissions-Policy.

## Custom Domain

### Vercel
```bash
vercel domains add your-domain.com
```

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS

### Cloudflare Pages
1. Add custom domain
2. Update DNS to Cloudflare nameservers

## Costs

### Free Tier Limits

**Vercel:**
- 100 GB bandwidth/month
- Unlimited projects
- Free SSL

**Netlify:**
- 100 GB bandwidth/month
- 300 build minutes/month
- Free SSL

**Cloudflare Pages:**
- Unlimited bandwidth
- 500 builds/month
- Free SSL

**Firebase:**
- 10 GB storage
- 360 MB/day download
- Free SSL

## Backup & Rollback

### Vercel
- Automatic deployments saved
- Rollback via dashboard

### Netlify
- Deploy history preserved
- Rollback with one click

### GitHub Pages
- Git history = deployment history
- Rollback by reverting commit

## CI/CD Pipeline

Example GitHub Actions (`.github/workflows/deploy.yml`):

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run lint
      # Deploy step (platform-specific)
```

## Domain Recommendations

Suggested domains:
- `ardraw.app`
- `tracedraw.io`
- `drawassist.app`
- `cameradraw.app`

---

**Need Help?** Open an issue or check the documentation.
