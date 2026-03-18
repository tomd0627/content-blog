/**
 * Generates simple SVG placeholder cover images for blog seed posts.
 * Run once: node scripts/generate-placeholders.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "../public/images/posts");

const posts = [
  {
    filename: "accessible-react-components.svg",
    title: "Accessibility",
    subtitle: "React + ARIA",
    bg1: "#2d6a4f",
    bg2: "#1c2b1c",
    icon: "♿",
  },
  {
    filename: "gsap-scroll-trigger-lessons.svg",
    title: "GSAP",
    subtitle: "ScrollTrigger",
    bg1: "#5f4020",
    bg2: "#2d1a08",
    icon: "↕",
  },
  {
    filename: "optimizing-core-web-vitals.svg",
    title: "Performance",
    subtitle: "Core Web Vitals",
    bg1: "#1a3a5c",
    bg2: "#0d1f33",
    icon: "⚡",
  },
  {
    filename: "css-custom-properties-2026.svg",
    title: "CSS",
    subtitle: "Custom Properties",
    bg1: "#4a2d6a",
    bg2: "#1e1030",
    icon: "✦",
  },
  {
    filename: "typescript-changed-how-i-think.svg",
    title: "TypeScript",
    subtitle: "Type Safety",
    bg1: "#1c3a6a",
    bg2: "#0d1e36",
    icon: "TS",
  },
  {
    filename: "headless-cms-vs-traditional.svg",
    title: "Architecture",
    subtitle: "Headless CMS",
    bg1: "#3a2d1c",
    bg2: "#1a1408",
    icon: "⬡",
  },
  {
    filename: "og-default.svg",
    title: "Field Notes",
    subtitle: "A Developer Blog",
    bg1: "#c4622d",
    bg2: "#7a3818",
    icon: "✎",
  },
];

function makeSvg({ title, subtitle, bg1, bg2, icon }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${bg2};stop-opacity:1" />
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="60"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Decorative circles -->
  <circle cx="900" cy="150" r="300" fill="rgba(255,255,255,0.04)" filter="url(#blur)"/>
  <circle cx="200" cy="500" r="200" fill="rgba(255,255,255,0.03)" filter="url(#blur)"/>

  <!-- Grain texture simulation via small dots -->
  <rect x="0" y="0" width="1200" height="630" fill="url(#bg)" opacity="0.05"/>

  <!-- Icon -->
  <text x="100" y="280" font-family="Georgia, serif" font-size="120" fill="rgba(255,255,255,0.15)">${icon}</text>

  <!-- Site name -->
  <text x="100" y="430" font-family="Georgia, serif" font-size="22" fill="rgba(255,255,255,0.5)" letter-spacing="4">FIELD NOTES</text>

  <!-- Title -->
  <text x="100" y="500" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="white">${title}</text>

  <!-- Subtitle -->
  <text x="100" y="555" font-family="Georgia, serif" font-size="32" fill="rgba(255,255,255,0.7)">${subtitle}</text>

  <!-- Bottom rule -->
  <line x1="100" y1="590" x2="400" y2="590" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
</svg>`;
}

fs.mkdirSync(outputDir, { recursive: true });

for (const post of posts) {
  const svg = makeSvg(post);
  const outPath = path.join(outputDir, post.filename);
  fs.writeFileSync(outPath, svg, "utf-8");
  console.log(`✓ ${post.filename}`);
}

console.log("\nDone! SVG placeholders written to public/images/posts/");
