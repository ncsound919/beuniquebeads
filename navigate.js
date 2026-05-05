const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://dash.cloudflare.com/b6be9bcf3d76c4d78ddb019a22d91720/beuniquebeads.com/dns/record/add');
  await page.waitForTimeout(5000);
  console.log('On DNS add page:', page.url());
  
  // Wait for user to fill or do it ourselves
  for (let i = 0; i < 180; i++) {
    await page.waitForTimeout(1000);
    const url = page.url();
    if (url.includes('success') || url.includes('records')) {
      console.log('Done, URL:', url);
      break;
    }
    console.log('Waiting...', i);
  }
})();