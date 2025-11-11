#!/usr/bin/env node

/**
 * Image optimization script using sharp (Node.js)
 * 
 * Install dependencies:
 * npm install --save-dev sharp
 * 
 * Run:
 * node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('❌ sharp is not installed. Install it with:');
  console.error('   npm install --save-dev sharp');
  process.exit(1);
}

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BACKUP_DIR = path.join(PUBLIC_DIR, 'backup_original_images');

// Create backup directory
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

/**
 * Get file size in human-readable format
 */
function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  const bytes = stats.size;
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Optimize a single image
 */
async function optimizeImage(filePath) {
  const filename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const backupPath = path.join(BACKUP_DIR, filename);
  
  // Get original size
  const originalSize = getFileSize(filePath);
  console.log(`\n📸 Optimizing: ${filename} (${originalSize})`);
  
  // Backup original
  fs.copyFileSync(filePath, backupPath);
  console.log(`   ✅ Backed up to: backup_original_images/${filename}`);
  
  try {
    // Create temporary file path
    const tempPath = filePath + '.tmp';
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Determine optimization settings based on format
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ 
          quality: 80, 
          progressive: true,
          mozjpeg: true 
        })
        .toFile(tempPath);
    } else if (ext === '.png') {
      await image
        .png({ 
          quality: 80,
          compressionLevel: 9,
          adaptiveFiltering: true
        })
        .toFile(tempPath);
    } else {
      console.log(`   ⚠️  Skipping ${ext} format (not optimized)`);
      return;
    }
    
    // Replace original with optimized version
    fs.renameSync(tempPath, filePath);
    
    const newSize = getFileSize(filePath);
    const originalBytes = fs.statSync(backupPath).size;
    const newBytes = fs.statSync(filePath).size;
    const reduction = ((1 - newBytes / originalBytes) * 100).toFixed(1);
    
    console.log(`   ✅ Optimized: ${newSize} (${reduction}% reduction)`);
  } catch (error) {
    console.error(`   ❌ Error optimizing ${filename}:`, error.message);
    // Clean up temp file if it exists
    const tempPath = filePath + '.tmp';
    if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
    // Restore from backup on error
    fs.copyFileSync(backupPath, filePath);
  }
}

/**
 * Find and optimize all images
 */
async function optimizeAllImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  const filesToOptimize = [];
  
  // Find all JPG files in public directory
  const publicFiles = fs.readdirSync(PUBLIC_DIR);
  publicFiles.forEach(file => {
    const filePath = path.join(PUBLIC_DIR, file);
    const ext = path.extname(file).toLowerCase();
    if ((ext === '.jpg' || ext === '.jpeg' || ext === '.png') && fs.statSync(filePath).isFile()) {
      filesToOptimize.push(filePath);
    }
  });
  
  // Find all PNG files in stories directory
  const storiesDir = path.join(PUBLIC_DIR, 'stories');
  if (fs.existsSync(storiesDir)) {
    const storyFiles = fs.readdirSync(storiesDir);
    storyFiles.forEach(file => {
      const filePath = path.join(storiesDir, file);
      const ext = path.extname(file).toLowerCase();
      if (ext === '.png' && fs.statSync(filePath).isFile()) {
        filesToOptimize.push(filePath);
      }
    });
  }
  
  // Optimize each image
  for (const filePath of filesToOptimize) {
    await optimizeImage(filePath);
  }
  
  console.log('\n✨ Optimization complete!');
  console.log(`📁 Original images backed up to: ${path.relative(process.cwd(), BACKUP_DIR)}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Test your site to ensure images still look good');
  console.log('   2. If satisfied, you can delete the backup folder');
  console.log('   3. Commit the optimized images to your repository');
  console.log('   4. Redeploy to Vercel');
}

// Run optimization
optimizeAllImages().catch(console.error);

