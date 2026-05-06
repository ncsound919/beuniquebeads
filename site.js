const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://beuniquebeads.com');
  console.log('Site opened in COMET');
  
  await page.waitForTimeout(60000);
})();