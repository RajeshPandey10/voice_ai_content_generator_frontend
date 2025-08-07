import fs from "fs";
import path from "path";

// This script will help you generate different icon sizes from your logo
// Run this after you've processed your PNG to be circular

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

console.log("📱 Icon Generation Guide");
console.log("========================");
console.log("");
console.log("To generate all required icons from your logo:");
console.log("");
console.log("1. First, make your logo circular and save as logo-circular.png");
console.log("2. Use an online tool like https://realfavicongenerator.net/");
console.log("3. Or use ImageMagick (if installed):");
console.log("");

iconSizes.forEach((icon) => {
  console.log(
    `convert logo-circular.png -resize ${icon.size}x${icon.size} public/${icon.name}`
  );
});

console.log("");
console.log("4. Generate favicon.ico:");
console.log(
  "convert public/favicon-16x16.png public/favicon-32x32.png public/favicon-48x48.png public/favicon.ico"
);
console.log("");
console.log("5. All icons will be automatically referenced in your HTML!");
