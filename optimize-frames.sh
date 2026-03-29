#!/bin/bash

# Frame Optimization Script
# Adaptive quality: Snap point frames (1, 125, 250) at quality 85, others at quality 70

echo "🎬 Starting frame optimization..."
echo "📊 Adaptive quality strategy:"
echo "   - Snap frames (1, 125, 250): Quality 85"
echo "   - Other frames: Quality 70"
echo ""

# Create backup directories
mkdir -p assets/frames-backup
mkdir -p assets/frames-mobile-backup

# Backup original frames
echo "💾 Creating backups..."
cp -r assets/frames/* assets/frames-backup/
cp -r assets/frames-mobile/* assets/frames-mobile-backup/
echo "✅ Backups created"
echo ""

# Function to optimize a single frame
optimize_frame() {
    local input=$1
    local output=$2
    local quality=$3
    
    cwebp -q $quality "$input" -o "$output" 2>/dev/null
}

# Optimize desktop frames
echo "🖥️  Optimizing desktop frames (1920x1080)..."
total_frames=250
current=0

for i in $(seq -f "%03g" 1 250); do
    current=$((current + 1))
    input="assets/frames-backup/ezgif-frame-${i}.webp"
    output="assets/frames/ezgif-frame-${i}.webp"
    
    # Determine quality based on frame number
    if [ "$i" = "001" ] || [ "$i" = "125" ] || [ "$i" = "250" ]; then
        quality=85
        marker="⭐"
    else
        quality=70
        marker="  "
    fi
    
    # Optimize frame
    optimize_frame "$input" "$output" $quality
    
    # Progress indicator
    if [ $((current % 25)) -eq 0 ]; then
        echo "   Progress: $current/$total_frames frames"
    fi
done

echo "✅ Desktop frames optimized"
echo ""

# Optimize mobile frames
echo "📱 Optimizing mobile frames (1080x1920)..."
current=0

for i in $(seq -f "%03g" 1 250); do
    current=$((current + 1))
    input="assets/frames-mobile-backup/ezgif-frame-${i}.webp"
    output="assets/frames-mobile/ezgif-frame-${i}.webp"
    
    # Determine quality based on frame number
    if [ "$i" = "001" ] || [ "$i" = "125" ] || [ "$i" = "250" ]; then
        quality=85
    else
        quality=70
    fi
    
    # Optimize frame
    optimize_frame "$input" "$output" $quality
    
    # Progress indicator
    if [ $((current % 25)) -eq 0 ]; then
        echo "   Progress: $current/$total_frames frames"
    fi
done

echo "✅ Mobile frames optimized"
echo ""

# Calculate size reduction
original_desktop=$(du -sh assets/frames-backup | awk '{print $1}')
optimized_desktop=$(du -sh assets/frames | awk '{print $1}')
original_mobile=$(du -sh assets/frames-mobile-backup | awk '{print $1}')
optimized_mobile=$(du -sh assets/frames-mobile | awk '{print $1}')

echo "📊 Optimization Results:"
echo "   Desktop: $original_desktop → $optimized_desktop"
echo "   Mobile:  $original_mobile → $optimized_mobile"
echo ""
echo "✅ Optimization complete!"
echo ""
echo "💡 To restore originals: cp -r assets/frames-backup/* assets/frames/"
echo "💡 To delete backups: rm -rf assets/frames-backup assets/frames-mobile-backup"
