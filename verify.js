const { chromium } = require('playwright');

const SITE_URL = 'https://ncsound919.github.io/beuniquebeads/';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('=== BeUniqueBeads Site Verification ===\n');
  let passed = 0;
  let failed = 0;

  function check(name, condition, detail = '') {
    if (condition) {
      console.log(`  ✓ ${name}${detail ? ` - ${detail}` : ''}`);
      passed++;
    } else {
      console.log(`  ✗ ${name}${detail ? ` - ${detail}` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Page loads
    console.log('1. PAGE LOAD');
    await page.goto(SITE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    check('Site loads successfully', true, SITE_URL);

    const title = await page.title();
    check('Page title contains BeUniqueBeads', title.includes('BeUniqueBeads'), title);

    // 2. Header & Navigation
    console.log('\n2. HEADER & NAVIGATION');
    const logo = await page.$('.logo');
    check('Logo is present', !!logo);

    const navLinks = await page.$$('.nav-link');
    check('Nav links present (expect 4)', navLinks.length >= 4, `${navLinks.length} found`);

    const shopBtn = await page.$('.nav-actions .btn-primary');
    check('Shop Now button in nav', !!shopBtn);

    // 3. Hero Section
    console.log('\n3. HERO SECTION');
    const h1 = await page.$('h1');
    check('Hero heading exists', !!h1);
    const h1Text = await h1.textContent();
    check('Hero contains "Beads"', h1Text.includes('Beads'), h1Text.trim());

    const heroBadge = await page.$('.hero-badge');
    check('Hero badge "HANDCRAFTED IN NORTH CAROLINA"', !!heroBadge);

    const heroImage = await page.$('.hero-image img');
    const heroImgSrc = await heroImage?.getAttribute('src');
    check('Hero image loads', !!heroImgSrc);

    // 4. Product Grid with Shopify Links
    console.log('\n4. SIGNATURE PIECES (Shopify Integration)');
    const productCards = await page.$$('.product-card');
    check('Product cards rendered (expect 4)', productCards.length === 4, `${productCards.length} found`);

    const productNames = await page.$$eval('.product-card h3', els => els.map(e => e.textContent.trim()));
    console.log('  Products found:');
    for (const name of productNames) {
      console.log(`    - ${name}`);
    }
    check('Golden Terra Wrap listed', productNames.some(n => n.includes('Golden Terra Wrap')));
    check('Amethyst Intention Necklace listed', productNames.some(n => n.includes('Amethyst Intention Necklace')));

    // Verify all Shopify product links
    const productLinks = await page.$$eval('.product-card .btn-primary', els =>
      els.map(e => e.getAttribute('href'))
    );
    console.log('\n  Shopify Product Links:');
    for (const link of productLinks) {
      const isShopify = link?.includes('beuniquebeads.myshopify.com');
      console.log(`    ${isShopify ? '✓' : '✗'} ${link}`);
      check(`Shopify link: ${link?.split('/products/')[1] || 'unknown'}`, isShopify, link);
    }

    // 5. Shopify "Shop Now" CTA links
    console.log('\n5. SHOP NOW CTAs');
    const shopLinks = await page.$$eval('a[href*="beuniquebeads.myshopify.com"]', els =>
      els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') }))
    );
    check('At least 3 Shopify links on page', shopLinks.length >= 3, `${shopLinks.length} found`);
    for (const sl of shopLinks) {
      console.log(`    ✓ "${sl.text}" → ${sl.href.split('/').pop()}`);
    }

    // 6. Sections Present
    console.log('\n6. PAGE SECTIONS');
    const valuesSection = await page.$('.value-card');
    check('Values section (Made with Soul)', !!valuesSection);

    const collectionsSection = await page.$('#collections');
    check('Collections section exists', !!collectionsSection);

    const journalSection = await page.$('#journal');
    check('Journal section exists', !!journalSection);

    const aboutSection = await page.$('#about');
    check('About section exists', !!aboutSection);

    const contactSection = await page.$('#contact');
    check('Contact section exists', !!contactSection);

    // 7. Testimonials
    console.log('\n7. TESTIMONIALS');
    const testimonials = await page.$$('.testimonial-card');
    check('Testimonials rendered (expect 2)', testimonials.length === 2, `${testimonials.length} found`);

    // 8. Newsletter Form
    console.log('\n8. NEWSLETTER');
    const newsletterForm = await page.$('#newsletterForm');
    check('Newsletter form exists', !!newsletterForm);

    const emailInput = await page.$('#news_email');
    check('Email input exists', !!emailInput);

    // Test newsletter submission
    await emailInput?.fill('test@example.com');
    await page.click('#newsletterForm button[type="submit"]');
    await page.waitForTimeout(500);
    const msg = await page.$eval('#newsletterMessage', el => el.textContent);
    check('Newsletter shows success message', msg.includes('Thank you'), msg);

    // 9. Mobile Menu
    console.log('\n9. MOBILE RESPONSIVENESS');
    const hamburgerBtn = await page.$('#hamburgerBtn');
    check('Hamburger button exists', !!hamburgerBtn);

    // Test skip link exists
    const skipLink = await page.$('.skip-link');
    check('Skip link for accessibility', !!skipLink);

    // 10. Schema.org markup
    console.log('\n10. SEO & SCHEMA');
    const schemaScripts = await page.$$eval('script[type="application/ld+json"]', els =>
      els.map(e => {
        try { return JSON.parse(e.textContent); } catch { return null; }
      })
    );
    const schema = schemaScripts.find(s => s && s['@type'] === 'JewelryStore');
    check('Schema.org JewelryStore markup', !!schema, schema ? schema.name : 'missing');
    check('Schema has phone', schema?.telephone === '+12523338632');
    check('Schema has address', schema?.address?.addressRegion === 'NC');

    // 11. Screenshot
    console.log('\n11. SCREENSHOT');
    await page.screenshot({ path: 'site-screenshot.png', fullPage: true });
    console.log('  ✓ Full-page screenshot saved: site-screenshot.png');

    // 12. Performance check - Shopify links are valid destinations
    console.log('\n12. SHOPIFY LINK VALIDATION');
    for (const link of productLinks) {
      try {
        const response = await page.request.get(link, { timeout: 10000 });
        check(`Link reachable: ${link.split('/products/')[1]}`, response.ok(), `${response.status()}`);
      } catch (e) {
        check(`Link reachable: ${link.split('/products/')[1]}`, false, e.message);
      }
    }

  } catch (err) {
    console.log(`\n!!! ERROR: ${err.message}`);
    failed++;
  } finally {
    console.log('\n=== RESULTS ===');
    const total = passed + failed;
    console.log(`Passed: ${passed}/${total}`);
    console.log(`Failed: ${failed}/${total}`);
    console.log(passed === total ? '\n✓ ALL CHECKS PASSED' : `\n✗ ${failed} CHECK(S) FAILED`);

    await browser.close();
  }
}

run();
