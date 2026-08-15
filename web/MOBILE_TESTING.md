# 📱 Mobile Testing Guide - AR Draw

## ⚡ QUICK START

### Development Server Status:
✅ Running at: **http://192.168.0.26:5174/**

---

## 🚀 OPTION 1: Direct IP Access (Tanpa Kamera)

### Langkah:
1. **Buka smartphone Anda**
2. **Pastikan terhubung ke WiFi yang sama dengan laptop**
3. **Buka browser** (Chrome/Safari)
4. **Ketik URL:** 
   ```
   http://192.168.0.26:5174/
   ```

### ⚠️ Keterbatasan:
- ❌ Kamera TIDAK akan bekerja (HTTP, bukan HTTPS)
- ✅ Upload gambar BISA
- ✅ Semua fitur transform, filter, grid BISA ditest

### ✅ Yang Bisa Ditest:
- UI/UX responsiveness
- Upload image dari gallery
- Opacity control
- Transform (zoom, rotate, flip)
- Touch gestures (pinch, drag, rotate)
- Filters (8 modes)
- Grid overlay
- Lock mode
- Screenshot
- Library management
- Search & favorites

---

## 🔒 OPTION 2: ngrok untuk HTTPS (Dengan Kamera)

### Cara Cek ngrok:

**1. Buka Browser Desktop**
   - Buka: http://localhost:4040
   - Ini adalah ngrok dashboard

**2. Lihat "Forwarding" URL**
   - Anda akan melihat URL seperti:
   ```
   https://abc123-def456.ngrok-free.app
   ```

**3. Copy URL HTTPS**
   - Copy URL yang dimulai dengan `https://`

**4. Buka di Mobile**
   - Buka URL tersebut di browser mobile
   - **✅ Kamera akan bekerja!**

---

## 🔧 Jika ngrok Tidak Jalan

### Restart ngrok:

**1. Stop ngrok yang sedang running (Ctrl+C)**

**2. Jalankan lagi:**
```bash
ngrok http 5174
```

**3. Tunggu sampai muncul:**
```
Session Status    online
Forwarding        https://xxxx.ngrok-free.app -> http://localhost:5174
```

### Alternatif: Gunakan ngrok Web Interface

1. Buka: http://localhost:4040
2. Lihat URL di "Status" atau "Requests"
3. Copy URL HTTPS
4. Gunakan di mobile

---

## 📱 TESTING CHECKLIST - Mobile

### Home Screen
```
□ Landing page tampil baik
□ Gradient terlihat smooth
□ Button ukuran pas untuk touch
□ Text terbaca jelas
□ Animasi smooth
□ Scroll works (jika perlu)
```

### Image Upload
```
□ Gallery picker terbuka
□ Bisa pilih gambar
□ Gambar load cepat
□ Tidak ada distortion
□ Sharp & clear
```

### Camera (Hanya dengan HTTPS/ngrok)
```
□ Permission prompt muncul
□ "Allow" camera works
□ Camera feed tampil
□ Feed smooth (tidak lag)
□ Switch camera button works
□ Camera resolution baik
```

### Drawing Screen
```
□ Layout fullscreen
□ Reference image tampil di atas camera/background
□ Controls tidak menutupi area penting
□ Bottom toolbar accessible
```

### Opacity Control
```
□ Slider smooth
□ 0% = transparent penuh
□ 100% = opaque penuh
□ Real-time update (tidak lag)
□ Value indicator akurat
```

### Transform Controls
```
□ Scale slider smooth
□ Range 0.1x - 10x
□ Rotate 90° works
□ Flip horizontal works
□ Flip vertical works
□ Reset button restore default
```

### Touch Gestures
```
□ Single finger drag = move image
□ Pinch (2 fingers) = zoom
□ Two finger rotate = rotate image
□ Double tap = reset (optional)
□ Gestures smooth (no jank)
□ Tidak interfere dengan browser gestures
```

### Filters
```
□ Filter button opens panel
□ Panel slides up smoothly
□ All 8 filters listed
□ Filter apply correctly:
  □ Original
  □ Grayscale
  □ High Contrast
  □ Edge Detection
  □ Line Art
  □ Sketch
  □ Invert
  □ Posterize
□ Filter processing < 1 second
□ No crash on filter change
```

### Grid System
```
□ Grid button toggle works
□ Grid appears over image
□ Grid lines clear & visible
□ Grid tidak menghalangi view
□ Grid follows image transform
```

### Lock Mode
```
□ Lock button toggle
□ Locked = controls disabled
□ Lock icon/indicator visible
□ Prevent accidental changes
□ Unlock button accessible
```

### Capture/Screenshot
```
□ Capture button works
□ Screenshot quality good
□ Download works
□ File saved to device
□ Filename descriptive
```

### Library
```
□ Library screen opens
□ Images displayed in grid
□ Search bar works
□ Filter (All/Favorites) works
□ Favorite button toggle
□ Delete confirmation
□ Delete works
□ Back button works
```

### Performance
```
□ Initial load < 3s
□ Smooth 60fps (or close)
□ No lag saat zoom
□ No lag saat rotate
□ Filter apply tidak freeze
□ Touch response instant
□ Memory tidak meledak
```

### Orientation
```
□ Portrait works
□ Landscape works
□ Rotation smooth
□ Layout adjust correctly
□ Controls tetap accessible
```

### Browser Compatibility
```
Test di:
□ Chrome Android
□ Safari iOS
□ Samsung Internet (jika ada)
□ Firefox Mobile (optional)
```

---

## 🐛 COMMON ISSUES & FIXES

### Issue: Camera Permission Denied
**Fix:** 
- Check browser settings → Site permissions
- Allow camera access
- Reload page

### Issue: Gambar Blur
**Fix:**
- Upload gambar resolusi tinggi
- Check devicePixelRatio
- Zoom out then zoom in

### Issue: Gesture Tidak Respond
**Fix:**
- Pastikan touch-action: none
- Coba di browser lain
- Restart browser

### Issue: Filter Slow
**Fix:**
- Normal untuk device low-end
- Edge detection paling lambat
- Try simpler filters (grayscale, invert)

### Issue: Layout Terpotong
**Fix:**
- Check viewport meta tag
- Coba landscape/portrait
- Refresh page

---

## 📊 PERFORMANCE EXPECTATIONS

### High-End Mobile (iPhone 13+, Samsung S21+)
- **FPS:** 60
- **Filter Time:** <300ms
- **Touch Latency:** <50ms
- **Load Time:** <2s

### Mid-Range Mobile (Most Modern Phones)
- **FPS:** 45-60
- **Filter Time:** 300-500ms
- **Touch Latency:** <100ms
- **Load Time:** 2-3s

### Low-End Mobile (Budget Phones)
- **FPS:** 30-45
- **Filter Time:** 500-1000ms
- **Touch Latency:** <150ms
- **Load Time:** 3-5s

---

## 💡 TESTING TIPS

### Best Practices:
1. **Test dengan gambar berbeda:**
   - Foto
   - Line art
   - High contrast image
   - Large file (>5MB)

2. **Test gesture combinations:**
   - Zoom while rotating
   - Move while zoomed
   - Quick gestures

3. **Test edge cases:**
   - Very small zoom (0.1x)
   - Very large zoom (10x)
   - Multiple rotations
   - Rapid filter changes

4. **Test memory:**
   - Upload many images
   - Switch between images
   - Apply filters repeatedly
   - Check if app slows down

5. **Test offline:**
   - Load app first time (online)
   - Close browser
   - Turn off WiFi/mobile data
   - Open app again (should work)

---

## 📸 Screenshot untuk Report

Ambil screenshot jika menemukan:
- Layout issues
- Visual bugs
- Performance problems
- Unexpected behavior

---

## ✅ SUCCESS CRITERIA

App dianggap **READY** jika:
- ✅ All core features work
- ✅ No critical bugs
- ✅ Performance acceptable on target devices
- ✅ UI/UX smooth & intuitive
- ✅ Camera works (on HTTPS)
- ✅ Gestures responsive
- ✅ Filters apply correctly

---

## 🎯 NEXT STEPS

Setelah testing:

1. **Document findings** (bugs, improvements)
2. **Prioritize fixes** (critical → minor)
3. **Iterate** if needed
4. **Deploy** when ready
5. **User testing** with real users

---

## 📞 NEED HELP?

Jika menemukan bug atau issue:
1. Note the steps to reproduce
2. Take screenshots
3. Note device & browser info
4. Check console for errors (if possible)
5. Report untuk fixing

---

**Happy Testing! 🚀**

*Test thoroughly on mobile for best results*
