import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 603, height: 1350, deviceScaleFactor: 1 });

page.on('console', msg => console.log('PAGE:', msg.text()));
page.on('pageerror', err => console.log('ERROR:', err.message, err.stack));

await page.goto('http://localhost:4173/dine.html?screen=menu', { waitUntil: 'networkidle0' });

const info = await page.evaluate(() => {
  const grid = document.getElementById('menuGrid');
  return {
    gridChildren: grid?.children.length ?? -1,
    gridHTML: grid?.innerHTML.slice(0, 200) ?? 'NO GRID',
    noResultsExists: !!document.getElementById('noResults'),
    menuTopExists: !!document.querySelector('#screen-menu .menu-top'),
    menuScrollExists: !!document.querySelector('#screen-menu .menu-scroll'),
  };
});

console.log(JSON.stringify(info, null, 2));
await browser.close();
