// Renders public/icon.svg to the PNG sizes required by the PWA manifest.
// Uses Playwright's bundled Chromium so no native canvas dependency is needed.
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const svg = readFileSync(resolve('public/icon.svg'), 'utf8');
const sizes = [192, 512];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const size of sizes) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<body style="margin:0"><div style="width:${size}px;height:${size}px">${svg.replace(
      '<svg ',
      `<svg width="${size}" height="${size}" `
    )}</div></body>`
  );
  await page.screenshot({ path: resolve(`public/icon-${size}.png`), omitBackground: true });
  console.log(`wrote public/icon-${size}.png`);
}

// Maskable variant: full-bleed brand background with the artwork scaled into the 80% safe zone.
await page.setViewportSize({ width: 512, height: 512 });
await page.setContent(
  `<body style="margin:0"><div style="width:512px;height:512px;background:#14532d;display:grid;place-items:center">
     <div style="width:410px;height:410px">${svg.replace('<svg ', '<svg width="410" height="410" ')}</div>
   </div></body>`
);
await page.screenshot({ path: resolve('public/icon-512-maskable.png') });
console.log('wrote public/icon-512-maskable.png');
await browser.close();
