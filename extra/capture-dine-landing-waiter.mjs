import puppeteer from 'puppeteer';

const port = process.argv[2] || '4175';

console.log('Launching browser...');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Set viewport to 603x1350
await page.setViewport({ width: 603, height: 1350, deviceScaleFactor: 1 });

const url = `http://localhost:${port}/dine.html?table=T07`;
console.log(`Navigating to dine landing page: ${url}...`);
await page.goto(url, { waitUntil: 'networkidle0' });

// Wait for Welcome screen to render
await page.waitForSelector('#btnCallWaiterWelcome');

console.log('Clicking Call Waiter button on Welcome/Landing screen...');
await page.click('#btnCallWaiterWelcome');

// Wait for the waiter bottom sheet to slide up
await page.waitForSelector('#waiterSheet.open');
await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition

console.log('Taking screenshot of Call Waiter bottom sheet over Welcome page...');
await page.screenshot({ path: 'ss-waiter-dine-landing.png' });

console.log('Screenshot captured successfully!');
await browser.close();
