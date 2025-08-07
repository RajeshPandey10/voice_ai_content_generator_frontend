#!/bin/bash

# 🎨 Voice AI Logo Deployment Script
# This script will help you deploy your circular logo everywhere

echo "🎵 Voice AI Logo Deployment Script"
echo "=================================="
echo ""

# Check if the circular logo exists
if [ ! -f "public/logo_voice_ai.png" ]; then
    echo "❌ Logo not found at public/logo_voice_ai.png"
    echo "Please make sure your logo file is in the public folder"
    exit 1
fi

echo "✅ Logo found at public/logo_voice_ai.png"

# Create circular logo maker if not exists
if [ ! -f "circular-logo-maker.html" ]; then
    echo "📱 Please use the circular-logo-maker.html tool first to create circular versions"
    echo "Open circular-logo-maker.html in your browser and follow the instructions"
else
    echo "📱 Circular logo maker is available at circular-logo-maker.html"
fi

# List of icon sizes and their purposes
declare -a sizes=(
    "16:favicon-16x16.png:Favicon"
    "32:favicon-32x32.png:Favicon"
    "48:favicon-48x48.png:Favicon"
    "57:apple-touch-icon-57x57.png:Apple Touch Icon"
    "60:apple-touch-icon-60x60.png:Apple Touch Icon"
    "72:apple-touch-icon-72x72.png:Apple Touch Icon"
    "76:apple-touch-icon-76x76.png:Apple Touch Icon"
    "114:apple-touch-icon-114x114.png:Apple Touch Icon"
    "120:apple-touch-icon-120x120.png:Apple Touch Icon"
    "144:apple-touch-icon-144x144.png:Apple Touch Icon"
    "152:apple-touch-icon-152x152.png:Apple Touch Icon"
    "167:apple-touch-icon-167x167.png:Apple Touch Icon"
    "180:apple-touch-icon-180x180.png:Apple Touch Icon"
    "192:android-chrome-192x192.png:Android Chrome"
    "512:android-chrome-512x512.png:Android Chrome"
)

echo ""
echo "📋 Required Icon Sizes:"
echo "======================="

for item in "${sizes[@]}"; do
    IFS=':' read -r size filename purpose <<< "$item"
    echo "  🎯 ${size}x${size} px - ${filename} (${purpose})"
done

echo ""
echo "🛠️ Manual Steps Required:"
echo "========================"
echo ""
echo "1. 🎨 Open circular-logo-maker.html in your browser"
echo "2. 📤 Upload your logo_voice_ai.png file"
echo "3. 📥 Download all the generated icon sizes"
echo "4. 📁 Place them in the public/ folder"
echo "5. 🚀 Your logo will appear everywhere!"
echo ""
echo "🎯 Where Your Logo Will Appear:"
echo "==============================="
echo "  ✅ Header navigation logo"
echo "  ✅ Browser favicon"
echo "  ✅ Apple touch icons"
echo "  ✅ Android home screen icons"
echo "  ✅ OAuth sign-in button"
echo "  ✅ PWA app icons"
echo "  ✅ All responsive sizes"
echo ""

# Check if ImageMagick is available for automated processing
if command -v convert &> /dev/null; then
    echo "🎨 ImageMagick detected! Would you like to auto-generate icons? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🔄 Generating circular icons automatically..."
        
        # First create a circular version
        convert public/logo_voice_ai.png \
            \( +clone -threshold 101% -fill white -draw 'circle %[fx:int(w/2)],%[fx:int(h/2)] %[fx:int(w/2)],%[fx:int(h/2-1)]' \) \
            -channel-fx '| gray=>alpha' \
            public/logo-circular.png
        
        echo "✅ Created circular base logo"
        
        # Generate all sizes
        for item in "${sizes[@]}"; do
            IFS=':' read -r size filename purpose <<< "$item"
            convert public/logo-circular.png -resize ${size}x${size} public/${filename}
            echo "  ✅ Generated ${filename}"
        done
        
        # Generate favicon.ico
        convert public/favicon-16x16.png public/favicon-32x32.png public/favicon-48x48.png public/favicon.ico
        echo "  ✅ Generated favicon.ico"
        
        echo ""
        echo "🎉 All icons generated successfully!"
        echo "Your logo is now deployed everywhere!"
        
    else
        echo "👍 Use the manual method with circular-logo-maker.html"
    fi
else
    echo "💡 For automatic generation, install ImageMagick:"
    echo "   macOS: brew install imagemagick"
    echo "   Ubuntu: sudo apt-get install imagemagick"
    echo ""
    echo "👍 Or use the manual method with circular-logo-maker.html"
fi

echo ""
echo "🚀 Deployment Complete!"
echo "Your Voice AI logo is now ready for production!"
