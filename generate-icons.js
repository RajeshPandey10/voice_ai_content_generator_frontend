import sharp from "sharp";
import fs from "fs";
import path from "path";

// This script will generate all favicon and icon sizes from your logo
const iconSizes = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 57, name: "apple-touch-icon-57x57.png" },
  { size: 60, name: "apple-touch-icon-60x60.png" },
  { size: 72, name: "apple-touch-icon-72x72.png" },
  { size: 76, name: "apple-touch-icon-76x76.png" },
  { size: 114, name: "apple-touch-icon-114x114.png" },
  { size: 120, name: "apple-touch-icon-120x120.png" },
  { size: 144, name: "apple-touch-icon-144x144.png" },
  { size: 152, name: "apple-touch-icon-152x152.png" },
  { size: 167, name: "apple-touch-icon-167x167.png" },
  { size: 180, name: "apple-touch-icon-180x180.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

async function generateIcons() {
  const logoPath = "public/logo_voice_ai.png";
  const publicDir = "public";

  console.log("🎨 Generating all favicon and icon sizes...");
  console.log("===========================================");

  // Check if logo exists
  if (!fs.existsSync(logoPath)) {
    console.error("❌ Logo not found at:", logoPath);
    process.exit(1);
  }

  try {
    // Create a circular mask for the logo
    const logoBuffer = fs.readFileSync(logoPath);
    const logoImage = sharp(logoBuffer);
    const { width, height } = await logoImage.metadata();

    console.log(`📏 Original logo size: ${width}x${height}`);

    // Create circular mask
    const size = Math.max(width, height);
    const circularMask = Buffer.from(
      `<svg width="${size}" height="${size}">
         <circle cx="${size / 2}" cy="${size / 2}" r="${
        size / 2
      }" fill="white"/>
       </svg>`
    );

    // Create circular logo
    const circularLogo = await logoImage
      .resize(size, size, { fit: "cover", position: "center" })
      .composite([{ input: circularMask, blend: "dest-in" }])
      .png()
      .toBuffer();

    console.log("✅ Created circular base logo");

    // Generate all icon sizes
    for (const icon of iconSizes) {
      const outputPath = path.join(publicDir, icon.name);

      await sharp(circularLogo)
        .resize(icon.size, icon.size, {
          fit: "cover",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);

      console.log(`  ✅ Generated ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate favicon.ico using the 32x32 version (most tools can convert this)
    console.log(
      "💡 To generate favicon.ico, use an online converter with favicon-32x32.png"
    );
    console.log("   Recommended: https://convertio.co/png-ico/");

    console.log("");
    console.log("🎉 All icons generated successfully!");
    console.log("🔗 Your logo will now appear as:");
    console.log("   📱 Favicon in browser tabs");
    console.log("   🍎 Apple touch icons on iOS");
    console.log("   🤖 Android chrome icons");
    console.log("   💻 PWA app icons");
    console.log("");
    console.log("🚀 Ready for deployment!");
  } catch (error) {
    console.error("❌ Error generating icons:", error.message);
    process.exit(1);
  }
}

// Run the icon generation
generateIcons();
