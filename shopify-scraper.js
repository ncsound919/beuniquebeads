const { chromium } = require('playwright');
const path = require('path');

const SHOPIFY_ADMIN = 'https://admin.shopify.com/store/beuniquebeads';
const SHOPIFY_PRODUCTS = SHOPIFY_ADMIN + '/products';
const EMAIL = 'mrs.sassy1978@yahoo.com';
const PASSWORD = 'Chloe1978!!!!';

(async () => {
  const userDataDir = path.join(__dirname, '.playwright-state');

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    viewport: { width: 1440, height: 900 },
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();

  try {
    console.log('Navigating to Shopify admin products...');
    await page.goto(SHOPIFY_PRODUCTS, { waitUntil: 'domcontentloaded', timeout: 30000 });

    await page.waitForTimeout(3000);

    let currentUrl = page.url();
    console.log('Current URL:', currentUrl);

    // Handle login if redirected
    if (currentUrl.includes('accounts.shopify.com') || currentUrl.includes('shopify.com/login') || currentUrl.includes('login')) {
      console.log('Login required! Navigating to standard login...');
      await page.goto('https://accounts.shopify.com/lookup?rid=8051af2a-2883-412b-a1a2-a5d1462409b3', { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(3000);

      // Fill in email
      const emailField = page.locator('input[type="email"], input[name="account[email]"], #account_email').first();
      if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Filling email...');
        await emailField.fill(EMAIL);
        await page.waitForTimeout(1000);
        // Look for submit/next button
        const nextBtn = page.locator('button[type="submit"], input[type="submit"], #checkout_submit').first();
        if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await nextBtn.click();
          await page.waitForTimeout(3000);
        }
      }

      // Fill password
      const passwordField = page.locator('input[type="password"], input[name="account[password]"], #account_password').first();
      if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Filling password...');
        await passwordField.fill(PASSWORD);
        await page.waitForTimeout(1000);
        const loginBtn = page.locator('button[type="submit"], input[type="submit"], #checkout_submit').first();
        if (await loginBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
          await loginBtn.click();
          await page.waitForTimeout(5000);
        }
      }

      await page.waitForTimeout(3000);
      currentUrl = page.url();
      console.log('After login URL:', currentUrl);
    }

    // Check if we reached the products page
    if (currentUrl.includes('admin.shopify.com') || currentUrl.includes('shopify.com')) {
      console.log('Successfully reached admin!');

      // Navigate to products if not already there
      if (!currentUrl.includes('/products')) {
        console.log('Navigating to products page...');
        await page.goto(SHOPIFY_PRODUCTS, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(5000);
      }

      console.log('Current URL:', page.url());

      // Extract product data from the admin UI
      // Shopify admin is a React SPA - extract from page data or table

      // Try to get product titles and links from the product list
      const products = await page.evaluate(() => {
        const items = [];
        // Try common selectors for Shopify admin product rows
        const rows = document.querySelectorAll(
          '[data-index], [role="row"], tr, .Polaris-IndexTable__TableRow, [class*="Product"], [class*="product"]'
        );

        // Log what's visible for debugging
        const bodyText = document.body.innerText.substring(0, 500);
        return { bodyPreview: bodyText, rowCount: rows.length };
      });

      console.log('Page preview:', products.bodyPreview);
      console.log('Rows found:', products.rowCount);

      // Take screenshot for debugging
      await page.screenshot({ path: 'shopify-admin-debug.png', fullPage: true });
      console.log('Screenshot saved: shopify-admin-debug.png');

    } else {
      console.log('Could not reach admin. URL:', currentUrl);
      // Take screenshot of current state
      await page.screenshot({ path: 'shopify-login-debug.png', fullPage: true });
      console.log('Screenshot saved: shopify-login-debug.png');
    }

  } catch (err) {
    console.error('Error:', err.message);
    await page.screenshot({ path: 'shopify-error.png', fullPage: true });
    console.log('Error screenshot saved: shopify-error.png');
  } finally {
    await browser.close();
  }
})();
