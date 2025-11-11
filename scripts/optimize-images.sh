#!/bin/bash

# Image optimization script for reducing Fast Data Transfer usage
# This script compresses images using ImageMagick or similar tools
# 
# Prerequisites:
# - ImageMagick: sudo apt-get install imagemagick (or brew install imagemagick on Mac)
# - Or use: npm install -g sharp-cli (alternative)

echo "🖼️  Starting image optimization..."

# Directory containing images
PUBLIC_DIR="public"
BACKUP_DIR="public/backup_original_images"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to optimize image
optimize_image() {
    local file="$1"
    local filename=$(basename "$file")
    
    echo "Optimizing: $filename"
    
    # Backup original
    cp "$file" "$BACKUP_DIR/$filename"
    
    # Check if ImageMagick is available
    if command -v convert &> /dev/null; then
        # Use ImageMagick to optimize
        # Reduce quality to 80% and optimize
        convert "$file" -strip -quality 80 -interlace Plane "$file"
        echo "✅ Optimized $filename using ImageMagick"
    elif command -v sharp &> /dev/null; then
        # Use sharp-cli if available
        sharp -i "$file" -o "$file" --quality 80
        echo "✅ Optimized $filename using sharp"
    else
        echo "⚠️  No optimization tool found. Install ImageMagick or sharp-cli"
        echo "   ImageMagick: sudo apt-get install imagemagick"
        echo "   sharp-cli: npm install -g sharp-cli"
        return 1
    fi
}

# Optimize large JPG files
echo "📦 Optimizing large JPG files..."
for file in "$PUBLIC_DIR"/*.jpg; do
    if [ -f "$file" ]; then
        # Get file size
        size=$(du -h "$file" | cut -f1)
        echo "  Found: $(basename "$file") ($size)"
        optimize_image "$file"
    fi
done

# Optimize PNG files in stories folder
echo "📦 Optimizing PNG files in stories folder..."
for file in "$PUBLIC_DIR/stories"/*.png; do
    if [ -f "$file" ]; then
        size=$(du -h "$file" | cut -f1)
        echo "  Found: stories/$(basename "$file") ($size)"
        optimize_image "$file"
    fi
done

echo ""
echo "✨ Optimization complete!"
echo "📁 Original images backed up to: $BACKUP_DIR"
echo ""
echo "💡 Next steps:"
echo "   1. Test your site to ensure images still look good"
echo "   2. If satisfied, you can delete the backup folder"
echo "   3. Commit the optimized images to your repository"
echo "   4. Redeploy to Vercel"

