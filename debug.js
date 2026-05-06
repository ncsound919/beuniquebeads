const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[PAGE ERROR] ${err.message}`));
  page.on('requestfailed', req => logs.push(`[FAILED] ${req.url()} - ${req.failure()?.errorText}`));
  
  await page.goto('https://beuniquebeads.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'beuniquebeads-debug.png', fullPage: true });
  
  console.log('=== CONSOLE / NETWORK LOGS ===');
  logs.forEach(l => console.log(l));
  
  // Check which imgs loaded
  const imgStatus = await page.$$eval('img', imgs => imgs.map(img => ({
    src: img.src || img.getAttribute('src'),
    naturalWidth: img.naturalWidth,
    visible: img.offsetParent !== null
  })));
  console.log('\n=== IMAGE STATUS ===');
  imgStatus.forEach(i => console.log(`${i.src} | w:${i.naturalWidth} | visible:${i.visible}`));
  
  console.log('\nFull screenshot saved: beuniquebeads-debug.png');
  await page.waitForTimeout(60000);
  await browser.close();
})();