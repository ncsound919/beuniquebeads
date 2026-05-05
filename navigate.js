const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://ap.www.namecheap.com/domains/');
  console.log('Navigated to domains');
  
  await page.waitForTimeout(3000);
  
  console.log('Page title:', await page.title());
  
  // Keep open
  await new Promise(() => {});
})();