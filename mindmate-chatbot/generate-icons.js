// Simple icon generator for PWA
// This creates basic colored squares as placeholders
// You can replace with actual designed icons later

const fs = require('fs');
const path = require('path');

// Create a simple SVG icon
const createSVGIcon = (size, color = '#B4D4E1') => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="${color}" rx="${size * 0.2}"/>
  <circle cx="${size * 0.5}" cy="${size * 0.35}" r="${size * 0.15}" fill="white" opacity="0.9"/>
  <path d="M ${size * 0.25} ${size * 0.6} Q ${size * 0.5} ${size * 0.8} ${size * 0.75} ${size * 0.6}" 
        stroke="white" stroke-width="${size * 0.05}" fill="none" stroke-linecap="round" opacity="0.9"/>
  <text x="${size * 0.5}" y="${size * 0.9}" text-anchor="middle" fill="white" 
        font-family="Arial, sans-serif" font-size="${size * 0.1}" opacity="0.7">MindMate</text>
</svg>`;
};

// Icon sizes needed for PWA
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('Generating PWA icons...');

sizes.forEach(size => {
  const svg = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(__dirname, 'public', 'icons', filename);
  
  fs.writeFileSync(filepath, svg);
  console.log(`Created ${filename}`);
});

// Create favicon
const favicon = createSVGIcon(32);
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), favicon);
console.log('Created favicon.svg');

console.log('\n✅ PWA icons generated!');
console.log('📝 Note: These are placeholder icons. You can replace them with custom designs later.');
console.log('🎨 Recommended: Use a tool like Figma or Canva to create professional icons.');