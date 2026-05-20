import puppeteer from 'puppeteer';
import path from 'path';

const port = process.argv[2] || '4175';

console.log('Launching browser...');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Set viewport to 603x1350
await page.setViewport({ width: 603, height: 1350, deviceScaleFactor: 1 });

// 1. Capture Call Waiter on landing.html
const landingPath = path.resolve('landing.html');
const landingUrl = `file:///${landingPath.replace(/\\/g, '/')}?table=07`;
console.log(`Navigating to landing page: ${landingUrl}...`);
await page.goto(landingUrl, { waitUntil: 'networkidle0' });

// Wait for burger image to load
await page.waitForFunction(() => {
  const img = document.querySelector('img');
  return img && img.complete && img.naturalWidth > 0;
}, { timeout: 5000 }).catch(() => {});

console.log('Clicking Call Waiter button on landing...');
// Click button with onclick="callWaiter()"
await page.click('button[onclick="callWaiter()"]');
await page.waitForSelector('#waiter-modal:not(.opacity-0)');
await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition

console.log('Taking screenshot of landing page Call Waiter modal...');
await page.screenshot({ path: 'ss-waiter-landing.png' });

// 2. Capture Call Waiter in dine.html (Menu screen)
const menuUrl = `http://localhost:${port}/dine.html?table=T07`;
console.log(`Navigating to menu page: ${menuUrl}...`);
await page.goto(menuUrl, { waitUntil: 'networkidle0' });

// Wait for Welcome screen to render
await page.waitForSelector('#btnBrowse');

// Click Browse Menu
console.log('Entering Menu...');
await page.click('#btnBrowse');

// Wait for Menu screen
await page.waitForSelector('#menuGrid .item-card');

// Wait for images to load
await page.waitForFunction(() => {
  const imgs = Array.from(document.querySelectorAll('.item-card-img'));
  return imgs.every(img => img.complete);
}, { timeout: 5000 }).catch(() => {});

console.log('Clicking Call Waiter header button...');
await page.click('.btn-call-waiter-header');
await page.waitForSelector('#waiterSheet.open');
await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition

console.log('Taking screenshot of menu page Call Waiter bottom sheet...');
await page.screenshot({ path: 'ss-waiter-menu.png' });

console.log('All waiter screenshots captured successfully!');
await browser.close();
