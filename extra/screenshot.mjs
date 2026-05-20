import puppeteer from 'puppeteer';

const [,, url, output, width = '603', height = '1350'] = process.argv;

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: parseInt(width), height: parseInt(height), deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: 'networkidle0' });

// Wait for menu grid to have items if on menu screen
const hasGrid = await page.$('#menuGrid');
if (hasGrid) {
  await page.waitForFunction(() => document.querySelectorAll('#menuGrid .item-card').length > 0, { timeout: 5000 }).catch(() => {});
}

await page.screenshot({ path: output, fullPage: false });
await browser.close();
console.log(`Saved: ${output}`);
