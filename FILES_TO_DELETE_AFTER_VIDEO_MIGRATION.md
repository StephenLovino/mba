# Files to Delete After Video Migration

## ⚠️ IMPORTANT: Test First!

**Before deleting these files**, make sure to:
1. Deploy the updated code to Vercel
2. Test that the video loads correctly from cloud storage
3. Verify on multiple devices (desktop, mobile, tablet)
4. Check browser console for any errors

---

## 🗑️ Files to Delete

### From `public/` folder:

```bash
public/PMA-EVENT-2025.mp4
public/PMA- EVENT-2025.mp4
```

**How to delete:**
```bash
# From project root
rm public/PMA-EVENT-2025.mp4
rm "public/PMA- EVENT-2025.mp4"
```

Or manually delete using your file explorer.

---

### From `build/` folder (Optional):

```bash
build/hero_video.mp4
```

**Note**: The `build/` folder is automatically regenerated on each build, so you can either:
- Delete it manually now
- Let it be removed on the next build
- Delete the entire `build/` folder (it will be recreated)

**How to delete:**
```bash
# From project root
rm build/hero_video.mp4

# Or delete entire build folder (recommended)
rm -rf build/
```

---

## 📊 Expected Storage Savings

Deleting these files will free up approximately:
- **PMA-EVENT-2025.mp4**: ~10-50 MB (depends on video size)
- **PMA- EVENT-2025.mp4**: ~10-50 MB (duplicate)
- **build/hero_video.mp4**: ~10-50 MB (build artifact)

**Total Savings**: ~30-150 MB (depending on actual video file sizes)

---

## ✅ Verification Steps

After deleting the files:

1. **Commit the changes**:
   ```bash
   git add .
   git commit -m "Remove local video files after migration to cloud storage"
   git push
   ```

2. **Verify deployment**:
   - Check that Vercel deployment succeeds
   - Verify deployment size is smaller
   - Test video loads from cloud storage

3. **Monitor**:
   - Check Vercel bandwidth usage over next few days
   - Verify no 404 errors for video files
   - Ensure video loads consistently

---

## 🚨 If Something Goes Wrong

If the video stops working after deletion:

1. **Don't panic** - you can restore from git history
2. **Check the cloud URL** is accessible in browser
3. **Restore files if needed**:
   ```bash
   git checkout HEAD~1 -- public/PMA-EVENT-2025.mp4
   git checkout HEAD~1 -- "public/PMA- EVENT-2025.mp4"
   ```

---

## 📝 Checklist

- [ ] Code deployed to Vercel
- [ ] Video tested on desktop
- [ ] Video tested on mobile
- [ ] Video tested on tablet
- [ ] No console errors
- [ ] Video loads from cloud storage URL
- [ ] Ready to delete local files
- [ ] Files deleted from `public/` folder
- [ ] Changes committed and pushed
- [ ] Deployment verified
- [ ] Bandwidth usage monitored

---

**Last Updated**: 2025-10-11

