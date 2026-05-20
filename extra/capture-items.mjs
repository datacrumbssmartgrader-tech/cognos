import puppeteer from 'puppeteer';

const port = process.argv[2] || '4175';

console.log('Launching browser...');
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 603, height: 1350, deviceScaleFactor: 1 });

const url = `http://localhost:${port}/dine.html?table=T07`;
console.log(`Navigating to ${url}...`);
await page.goto(url, { waitUntil: 'networkidle0' });

// Enter menu
await page.waitForSelector('#btnBrowse');
await page.click('#btnBrowse');
await page.waitForSelector('#menuGrid .item-card');

// Wait for all card images to load
await page.waitForFunction(() => {
  const imgs = Array.from(document.querySelectorAll('.item-card-img'));
  return imgs.every(img => img.complete);
}, { timeout: 8000 }).catch(() => {});

// Helper: open item sheet by item name, screenshot, then close
async function captureItemByName(itemName, filename) {
  const cardFound = await page.evaluate((name) => {
    const cards = Array.from(document.querySelectorAll('.item-card'));
    const targetCard = cards.find(c => c.querySelector('.item-card-name')?.textContent === name);
    if (targetCard) {
      targetCard.click();
      return true;
    }
    return false;
  }, itemName);

  if (!cardFound) {
    console.warn(`Card with name "${itemName}" not found, skipping.`);
    return;
  }
  
  await page.waitForSelector('#itemSheet.open');

  // Wait for image to fully load
  await page.waitForFunction(() => {
    const img = document.getElementById('itemSheetImg');
    return img && img.complete && img.naturalWidth > 0;
  }, { timeout: 6000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 500)); // transition settle

  console.log(`Taking screenshot: ${filename}`);
  await page.screenshot({ path: filename });

  // Close the sheet
  await page.click('#itemSheetClose');
  await page.waitForSelector('#itemSheet:not(.open)');
  await new Promise(r => setTimeout(r, 400));
}

// 4 items from 4 different categories
await captureItemByName('Seekh Kebab',  'ss-item-starters-seekh-kebab.png');    // Starters
await captureItemByName('Chicken Karahi',  'ss-item-karahi-chicken.png');           // Karahi
await captureItemByName('Sindhi Mutton Biryani',  'ss-item-biryani-mutton.png');           // Biryani
await captureItemByName('Gulab Jamun',  'ss-item-desserts-gulab-jamun.png');     // Desserts

console.log('All item screenshots captured!');
await browser.close();
