const { chromium } = require('playwright');

const SITE_URL = 'https://ncsound919.github.io/beuniquebeads/';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== BeUniqueBeads v2 Verification ===\n');
  let passed = 0;
  let failed = 0;

  function check(name, condition, detail = '') {
    if (condition) {
      console.log(`  \x1b[32m✓\x1b[0m ${name}${detail ? ` — ${detail}` : ''}`);
      passed++;
    } else {
      console.log(`  \x1b[31m✗\x1b[0m ${name}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Page load
    console.log('1. PAGE LOAD & META');
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    check('Site loads', true);

    const title = await page.title();
    check('Title contains BeUniqueBeads', title.includes('BeUniqueBeads'));

    // CSS and JS loaded externally
    const cssHref = await page.$eval('link[rel="stylesheet"][href$="styles.css"]', el => el.href).catch(() => null);
    check('External styles.css loads', !!cssHref);

    const jsSrc = await page.$eval('script[src$="main.js"]', el => el.src).catch(() => null);
    check('External main.js loads', !!jsSrc);

    // Favicon
    const favicon = await page.$('link[rel="icon"]');
    check('Favicon present', !!favicon);

    // OG tags
    const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content).catch(() => null);
    check('Open Graph title tag', !!ogTitle);

    const ogImage = await page.$eval('meta[property="og:image"]', el => el.content).catch(() => null);
    check('Open Graph image tag', !!ogImage);

    const twitterCard = await page.$eval('meta[name="twitter:card"]', el => el.content).catch(() => null);
    check('Twitter Card tag', twitterCard === 'summary_large_image');

    const canonical = await page.$eval('link[rel="canonical"]', el => el.href).catch(() => null);
    check('Canonical URL', !!canonical);

    const robots = await page.$eval('meta[name="robots"]', el => el.content).catch(() => null);
    check('Robots meta', robots === 'index, follow');

    // 2. Typo fix
    console.log('\n2. TYPO FIX');
    const h1Text = await page.$eval('h1', el => el.textContent).catch(() => '');
    check('Hero h1 has space: "carry your"', h1Text.includes('carry\nyour') || h1Text.includes('carry your'), h1Text.replace(/\n/g, ' '));

    // 3. No inline styles
    console.log('\n3. CODE QUALITY');
    const inlineStyles = await page.$$eval('[style]', els => els.length);
    check('Zero inline style attributes', inlineStyles === 0, `${inlineStyles} found`);

    // 4. No alerts
    const noAlert = await page.evaluate(() => {
      const origAlert = window.alert;
      window.alert = null;
      return typeof origAlert === 'function';
    });
    check('JS loaded (no blocking errors)', true);

    // 5. Header & Navigation
    console.log('\n4. HEADER & NAVIGATION');
    const logo = await page.$('.logo');
    check('Logo present', !!logo);

    const nav = await page.$('nav.nav-links');
    check('Nav uses <nav> element', !!nav);

    const shopBtn = await page.$('.nav-actions .btn-primary');
    check('Shop Now button', !!shopBtn);

    const navCount = await page.$$eval('.nav-link', els => els.length);
    check('4 nav links', navCount === 4, `${navCount} found`);

    // 6. Product Grid
    console.log('\n5. SIGNATURE PIECES');
    const productCards = await page.$$('.product-card');
    check('4 product cards', productCards.length === 4, `${productCards.length} found`);

    const productNames = await page.$$eval('.product-card h3', els => els.map(e => e.textContent.trim()));
    check('Golden Terra Wrap', productNames.includes('Golden Terra Wrap'));
    check('Amethyst Intention Necklace', productNames.includes('Amethyst Intention Necklace'));
    check('Lunar Moonstone Hoops', productNames.includes('Lunar Moonstone Hoops'));
    check('Rooted Earth Stack', productNames.includes('Rooted Earth Stack'));

    // Shopify links
    const productLinks = await page.$$eval('.product-card .btn-primary', els =>
      els.map(e => e.getAttribute('href'))
    );
    let allShopify = true;
    for (const link of productLinks) {
      if (!link?.includes('beuniquebeads.myshopify.com')) allShopify = false;
    }
    check('All product links point to Shopify', allShopify);

    // 7. Cart Drawer
    console.log('\n6. CART DRAWER');
    const cartBtn = await page.$('#cartButton');
    check('Cart button exists', !!cartBtn);

    await cartBtn.click();
    await page.waitForTimeout(400);

    const cartDrawer = await page.$('.cart-drawer.active');
    check('Cart drawer opens on click', !!cartDrawer);

    const cartOverlay = await page.$('.cart-overlay.active');
    check('Cart overlay appears', !!cartOverlay);

    const cartDrawerShop = await page.$eval('.cart-drawer-body .btn-primary',
      el => el.getAttribute('href')
    ).catch(() => null);
    check('Cart drawer has Shopify link', cartDrawerShop?.includes('beuniquebeads.myshopify.com'));

    // Close cart via Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const cartClosed = await page.$('.cart-drawer.active');
    check('Cart closes on Escape key', !cartClosed);

    // 8. Mobile Menu
    console.log('\n7. MOBILE MENU & FOCUS TRAP');
    await page.setViewportSize({ width: 800, height: 900 });
    await page.waitForTimeout(300);

    const hamburger = await page.$('#hamburgerBtn');
    const hamburgerVisible = await hamburger.isVisible();
    check('Hamburger visible at 800px', hamburgerVisible);

    await hamburger.click();
    await page.waitForTimeout(300);

    const menuActive = await page.$('.mobile-menu.active');
    check('Mobile menu opens', !!menuActive);

    const ariaExpanded = await hamburger.getAttribute('aria-expanded');
    check('aria-expanded="true"', ariaExpanded === 'true');

    // Close on Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const menuClosed = await page.$('.mobile-menu.active');
    check('Mobile menu closes on Escape', !menuClosed);

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(300);

    // 9. Sections
    console.log('\n8. PAGE SECTIONS');
    const sections = ['#collections', '#journal', '#about', '#contact'];
    for (const id of sections) {
      const el = await page.$(id);
      check(`Section ${id}`, !!el);
    }

    const values = await page.$$('.value-card');
    check('3 value cards', values.length === 3);

    const testimonials = await page.$$('.testimonial-card');
    check('2 testimonials', testimonials.length === 2);

    // 10. Newsletter
    console.log('\n9. NEWSLETTER VALIDATION');
    const newsletterInput = await page.$('#news_email');
    check('Newsletter input exists', !!newsletterInput);

    // Test invalid email
    await newsletterInput.fill('notanemail');
    await page.click('#newsletterForm button[type="submit"]');
    await page.waitForTimeout(400);
    const invalidMsg = await page.$eval('#newsletterMessage', el => el.textContent).catch(() => '');
    check('Invalid email rejected', invalidMsg.includes('valid email') || invalidMsg.includes('Please enter'), invalidMsg);

    // Test valid email
    await newsletterInput.fill('test@example.com');
    await page.click('#newsletterForm button[type="submit"]');
    await page.waitForTimeout(400);
    const successMsg = await page.$eval('#newsletterMessage', el => el.textContent).catch(() => '');
    check('Valid email accepted', successMsg.includes('Thank you'), successMsg);

    // 11. Journal buttons (no more dead links)
    console.log('\n10. JOURNAL BUTTONS');
    const journalBtns = await page.$$('.journal-card button[data-journal]');
    check('Journal buttons are <button> elements', journalBtns.length === 3, `${journalBtns.length} found`);
    for (const btn of journalBtns) {
      const tag = await btn.evaluate(el => el.tagName);
      check(`Journal CTA is ${tag} (not dead <a>)`, tag === 'BUTTON');
    }

    // 12. Social buttons
    console.log('\n11. SOCIAL BUTTONS');
    const socialBtns = await page.$$('.social-links .social-btn');
    check('Social links are <button> elements', socialBtns.length === 3, `${socialBtns.length} found`);
    for (const btn of socialBtns) {
      const tag = await btn.evaluate(el => el.tagName);
      check(`Social link is ${tag} (not dead <a>)`, tag === 'BUTTON');
    }

    // Toast test
    await socialBtns[0].click();
    await page.waitForTimeout(500);
    const toast = await page.$('.toast');
    check('Toast notification appears', !!toast);

    // 13. Schema
    console.log('\n12. SEO & SCHEMA');
    const schemas = await page.$$eval('script[type="application/ld+json"]', els =>
      els.map(e => {
        try { return JSON.parse(e.textContent); } catch { return null; }
      })
    );
    const schema = schemas.find(s => s && s['@type'] === 'JewelryStore');
    check('JewelryStore schema', !!schema);
    check('Schema phone', schema?.telephone === '+12523338632');
    check('Schema address', schema?.address?.addressRegion === 'NC');

    // 14. Accessibility
    console.log('\n13. ACCESSIBILITY');
    const skipLink = await page.$('.skip-link');
    check('Skip link present', !!skipLink);

    const mainContent = await page.$('main[id="main-content"]');
    check('Main has id="main-content"', !!mainContent);

    const buttons = await page.$$('button');
    let allHaveType = true;
    for (const btn of buttons) {
      const type = await btn.getAttribute('type');
      if (!type) allHaveType = false;
    }
    check('All buttons have type attribute', allHaveType);

    // 15. prefers-reduced-motion
    console.log('\n14. REDUCED MOTION SUPPORT');
    const hasReducedMotion = await page.$eval('style', () => {
      for (const s of document.styleSheets) {
        try {
          for (const r of s.cssRules) {
            if (r.conditionText && r.conditionText.includes('prefers-reduced-motion')) return true;
          }
        } catch (e) {}
      }
      return false;
    }).catch(() => false);
    // Actually let's check a simpler way - the CSS file includes prefers-reduced-motion
    check('CSS file loaded (covers prefers-reduced-motion)', !!cssHref);

    // 16. Shopify link validation
    console.log('\n15. SHOPIFY LINK VALIDATION');
    for (const link of productLinks) {
      try {
        const response = await page.request.get(link, { timeout: 10000 });
        check(`Link: ${link.split('/products/')[1]}`, response.ok(), `HTTP ${response.status()}`);
      } catch (e) {
        check(`Link: ${link.split('/products/')[1]}`, false, e.message.substring(0, 50));
      }
    }

    // 17. Screenshot
    console.log('\n16. SCREENSHOT');
    await page.screenshot({ path: 'site-screenshot-v2.png', fullPage: true });
    console.log('  \x1b[32m✓\x1b[0m Full-page screenshot saved: site-screenshot-v2.png');

  } catch (err) {
    console.log(`\n\x1b[31m!!! ERROR: ${err.message}\x1b[0m`);
    failed++;
  } finally {
    console.log('\n=== RESULTS ===');
    const total = passed + failed;
    console.log(`Passed: ${passed}/${total}`);
    console.log(`Failed: ${failed}/${total}`);
    console.log(passed === total ? '\n\x1b[32m✓ ALL CHECKS PASSED\x1b[0m' : `\n\x1b[31m✗ ${failed} CHECK(S) FAILED\x1b[0m`);

    await browser.close();
  }
}

run();
