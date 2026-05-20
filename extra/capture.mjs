import puppeteer from 'puppeteer';

const port = process.argv[2] || '4175';

console.log('Launching browser...');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// Set viewport to 603x1350
await page.setViewport({ width: 603, height: 1350, deviceScaleFactor: 1 });

const url = `http://localhost:${port}/dine.html?table=T07`;
console.log(`Navigating to ${url}...`);
await page.goto(url, { waitUntil: 'networkidle0' });

// Wait for the Welcome screen to render
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

// 1. Capture Menu screen
console.log('Taking screenshot of Menu screen...');
await page.screenshot({ path: 'ss-menu.png' });

// Click first item card to open details
console.log('Opening item detail sheet...');
const cards = await page.$$('#menuGrid .item-card');
await cards[0].click();
await page.waitForSelector('#itemSheet.open');

// Wait for the detail image to load
await page.waitForFunction(() => {
  const img = document.getElementById('itemSheetImg');
  return img && img.complete && img.naturalWidth > 0;
}, { timeout: 5000 }).catch(() => {});
await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition

// 2. Capture Item Selected screen
console.log('Taking screenshot of Item Selected sheet...');
await page.screenshot({ path: 'ss-item-selected.png' });

// Click Add to Cart
console.log('Adding item to cart...');
await page.click('#btnAddToCart');
await page.waitForSelector('#itemSheet:not(.open)');
await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition

// Quick-add the second item to have multiple items in cart
console.log('Quick-adding second item...');
const quickAddBtns = await page.$$('#menuGrid .item-card .item-add-btn');
if (quickAddBtns.length > 1) {
  await quickAddBtns[1].click();
  await new Promise(resolve => setTimeout(resolve, 500)); // wait for toast
}

// Navigate to Cart
console.log('Navigating to Cart...');
await page.click('.nav-item[data-screen="cart"]');
await page.waitForSelector('#cartScreenBody:not([hidden])');

// 3. Capture Cart screen
console.log('Taking screenshot of Cart...');
await page.screenshot({ path: 'ss-cart.png' });

// Click Place Order to open Confirmation Sheet
console.log('Opening order confirmation sheet...');
await page.click('#btnPlaceOrderScreen');
await page.waitForSelector('#confirmSheet.open');
await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition

// 4. Capture Order Confirmation screen
console.log('Taking screenshot of Order Confirmation sheet...');
await page.screenshot({ path: 'ss-order-confirm.png' });

// Confirm Order (takes to tracker)
console.log('Confirming order...');
await page.click('#btnConfirmOrder');
await page.waitForSelector('#screen-tracker:not([hidden])');
await new Promise(resolve => setTimeout(resolve, 500));

// 5. Capture Order Tracker screen
console.log('Taking screenshot of Order Tracker...');
await page.screenshot({ path: 'ss-orders-tracker.png' });

// Navigate to Bill
console.log('Navigating to Bill...');
await page.click('.nav-item[data-screen="bill"]');
await page.waitForSelector('#billContent:not([hidden])');

// 6. Capture Bill screen
console.log('Taking screenshot of Bill...');
await page.screenshot({ path: 'ss-bill.png' });

// Click Pay Now
console.log('Opening payment sheet...');
await page.click('#btnPayNow');
await page.waitForSelector('#paySheet.open');
await new Promise(resolve => setTimeout(resolve, 500)); // wait for transition

// 7. Capture Pay Bill screen
console.log('Taking screenshot of Pay Bill sheet...');
await page.screenshot({ path: 'ss-pay-bill.png' });

// Fill payment details
console.log('Filling payment details...');
await page.type('#payCardNum', '4111 1111 1111 1111');
await page.type('#payExpiry', '12/28');
await page.type('#payCvv', '123');
await page.type('#payName', 'John Doe');
await new Promise(resolve => setTimeout(resolve, 200));

// Click Pay
console.log('Submitting payment...');
await page.click('#btnPay');

// Wait 2.5 seconds (processing is 1.8s in JS)
console.log('Waiting for payment confirmation...');
await new Promise(resolve => setTimeout(resolve, 2500));

// 8. Capture Bill Paid screen
console.log('Taking screenshot of Bill Paid screen...');
await page.screenshot({ path: 'ss-bill-paid.png' });

console.log('All screenshots captured successfully!');

await browser.close();
