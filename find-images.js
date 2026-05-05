const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();
  
  await page.goto('https://unsplash.com/s/photos/african-beaded-jewelry', { 
    waitUntil: 'networkidle', 
    timeout: 30000 
  });
  await page.waitForTimeout(4000);

  const images = await page.evaluate(() => {
    const results = [];
    // Unsplash loads images as <img> elements inside the grid
    document.querySelectorAll('img[src*="images.unsplash.com"]').forEach(img => {
      const src = img.getAttribute('src');
      const srcset = img.getAttribute('srcset');
      if (src && !src.includes('profile') && !src.includes('avatar')) {
        results.push({ src, srcset });
      }
    });
    return results.slice(0, 10);
  });
  
  console.log(JSON.stringify(images, null, 2));
  await browser.close();
})();
