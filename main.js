(function () {
  'use strict';

  /* ===== PRODUCT DATA ===== */
  var products = [
    {
      name: '2 pc Black and Red Dice Set',
      price: '$46',
      tag: 'SET',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/2CFB213D-A6D4-4E06-A157-562310F6066C.jpg?v=1773714978',
      alt: '2 pc black and red dice set — gold-filled earrings and bracelet',
      url: 'https://beuniquebeads.myshopify.com/products/2-pc-black-and-red-dice-set'
    },
    {
      name: 'Hit the Dice Bangle',
      price: '$65',
      tag: 'STATEMENT',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/CE6E2397-374D-4B9A-A84A-F77A56A01443.jpg?v=1773112909',
      alt: 'Hit the Dice Bangle — black and white dice with chunky gold-filled beads bracelet',
      url: 'https://beuniquebeads.myshopify.com/products/hit-the-dice-bangle'
    },
    {
      name: 'Double the Love Starburst Bracelet',
      price: '$22',
      tag: 'BESTSELLER',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/216E93A3-373F-4F48-B215-359913CC2C1D.jpg?v=1773025712',
      alt: 'Double the Love starburst bracelet — 14K gold-filled beaded with stardust beads',
      url: 'https://beuniquebeads.myshopify.com/products/double-the-love-starburst-bracelet'
    },
    {
      name: 'Come On Dice Earrings',
      price: '$20',
      tag: 'EARRINGS',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/7ED73C3F-A521-41AC-920E-361A78534A65.jpg?v=1773112573',
      alt: 'Come on dice earrings — red and black dice with gold-filled beads',
      url: 'https://beuniquebeads.myshopify.com/products/come-on-dice'
    },
    {
      name: 'April Love Bracelet',
      price: '$15',
      tag: 'AWARENESS',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/09C1EDF4-E7C6-45D8-8514-FE3BBD96D9BC.jpg?v=1776399970',
      alt: 'April Love autism awareness bracelet — gold-filled, sizes 6–8 inches',
      url: 'https://beuniquebeads.myshopify.com/products/april-love'
    },
    {
      name: 'Build a Bear Bracelet',
      price: '$15',
      tag: 'NEW',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/B80E954B-C4A8-4F8B-BF85-556AEEC6D8B1.jpg?v=1773714978',
      alt: 'Build a Bear gold-filled bracelet — elegant charm bracelet, sizes 6–7.5 inches',
      url: 'https://beuniquebeads.myshopify.com/products/untitled-mar16_22-22'
    },
    {
      name: 'Stardust Earrings',
      price: '$20',
      tag: 'EARRINGS',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/C22C90FE-AFA6-45F6-8F70-78281398EE77.jpg?v=1773714978',
      alt: 'Stardust earrings — brown medium earrings with gold-filled beads',
      url: 'https://beuniquebeads.myshopify.com/products/untitled-mar16_22-26'
    }
  ];

  /* ===== PRODUCT GRID ===== */
  var productGrid = document.getElementById('productGrid');
  if (productGrid) {
    productGrid.innerHTML = products
      .map(function (p) {
        return [
          '<div class="product-card reveal">',
          '  <div class="product-image">',
          '    <img src="' + p.img + '" width="700" height="700" alt="' + p.alt + '" loading="lazy">',
          '  </div>',
          '  <div class="product-info">',
          '    <h3>' + p.name + '</h3>',
          '    <div class="product-price">' + p.price + '</div>',
          p.tag ? '<div class="product-tag">' + p.tag + '</div>' : '',
          '    <a href="' + p.url + '" class="btn btn-primary btn-block" target="_blank" rel="noopener noreferrer">View Piece</a>',
          '  </div>',
          '</div>'
        ].join('');
      })
      .join('');

    setupImageErrorHandling(productGrid);
  }

  /* ===== TOAST SYSTEM ===== */
  var toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function showToast(message, duration) {
    duration = duration || 3500;
    var container = getToastContainer();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('toast-out');
      toast.addEventListener('animationend', function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      });
    }, duration);
  }

  /* ===== MOBILE MENU ===== */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  var closeMenuBtn = document.getElementById('closeMenuBtn');
  var mobileMenuLinks = [];
  var lastFocusedEl = null;

  if (mobileMenu) {
    mobileMenuLinks = Array.from(mobileMenu.querySelectorAll('a, button'));
  }

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }

  function trapFocus(event) {
    if (event.key !== 'Tab') return;
    var focusable = getFocusableElements(mobileMenu);
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function toggleMenu(open) {
    var isOpen = open !== undefined ? open : !mobileMenu.classList.contains('active');
    mobileMenu.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
    hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Menu');

    if (isOpen) {
      lastFocusedEl = document.activeElement;
      document.addEventListener('keydown', trapFocus);
      if (closeMenuBtn) closeMenuBtn.focus();
    } else {
      document.removeEventListener('keydown', trapFocus);
      if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
        lastFocusedEl.focus();
      } else if (hamburgerBtn) {
        hamburgerBtn.focus();
      }
    }
  }

  function closeMobileMenu() {
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      toggleMenu(false);
    }
  }

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      toggleMenu();
    });

    if (closeMenuBtn) {
      closeMenuBtn.addEventListener('click', function () {
        toggleMenu(false);
      });
    }

    mobileMenuLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggleMenu(false);
});
  });

  /* ===== IMAGE ERROR HANDLING ===== */
  function setupImageErrorHandling(container) {
    if (!container) {
      container = document;
    }
    var images = container.querySelectorAll('img');
    images.forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
        var placeholder = document.createElement('div');
        placeholder.style.cssText =
          'width:100%;height:100%;background:var(--ivory);display:flex;align-items:center;justify-content:center;color:var(--clay);font-size:2rem;min-height:200px;';
        placeholder.setAttribute('aria-label', img.alt || 'Image failed to load');
        placeholder.innerHTML = '<i class="fas fa-image" aria-hidden="true"></i>';
        if (img.parentNode) {
          img.parentNode.insertBefore(placeholder, img);
        }
      });
    });
  }

  setupImageErrorHandling();

  /* ===== PREMIUM ANIMATIONS (GSAP + LENIS) ===== */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    /* ---- Lenis smooth scroll ---- */
    var lenis = new Lenis({ duration: 1.4, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, wheelMultiplier: 1 });

    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* ---- Custom cursor ---- */
    var cursorDot = document.getElementById('cursorDot');
    var cursorRing = document.getElementById('cursorRing');
    if (cursorDot && cursorRing) {
      var cursorPos = { x: -100, y: -100 };
      document.addEventListener('mousemove', function (e) {
        cursorPos.x = e.clientX;
        cursorPos.y = e.clientY;
        cursorDot.style.transform = 'translate(' + (e.clientX - 4) + 'px, ' + (e.clientY - 4) + 'px)';
      });
      gsap.ticker.add(function () {
        gsap.to(cursorRing, {
          x: cursorPos.x - 20,
          y: cursorPos.y - 20,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }

    /* ---- Hero timeline ---- */
    var heroTimeline = gsap.timeline({ defaults: { ease: 'power2.out' } });

    heroTimeline
      .from('.hero-line', { scaleY: 0, transformOrigin: 'top center', duration: 1.2 })
      .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7 }, '-=0.7')
      .from('.hero-heading', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5');

    if (typeof SplitType !== 'undefined') {
      var headingEl = document.querySelector('.hero-heading');
      if (headingEl) {
        var split = new SplitType('.hero-heading', { types: 'words' });
        heroTimeline.from(split.words, { y: 30, opacity: 0, duration: 0.6, stagger: 0.04 }, '-=0.3');
      }
    } else {
      heroTimeline.from('.hero-heading', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5');
    }

    heroTimeline
      .from('.hero-description', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')
      .from('.scroll-indicator', { y: 15, opacity: 0, duration: 0.8 }, '-=0.2');

    /* ---- Scroll-triggered animations ---- */
    gsap.utils.toArray('.value-card').forEach(function (card, i) {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.product-card').forEach(function (card, i) {
      gsap.from(card, {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.section-title, .section-header').forEach(function (el) {
      gsap.from(el, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    gsap.utils.toArray('.custom-cta, .newsletter').forEach(function (el) {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    });

    /* ---- Update anchor link scrolling to use Lenis ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        var href = anchor.getAttribute('href');
        if (href === '#' || href === '#main-content') return;
        var target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });
  } else {
    /* ---- Reduced motion fallback ---- */
    document.querySelectorAll('.hero-eyebrow, .hero-heading, .hero-description, .hero-cta').forEach(function (el) {
      el.classList.add('visible');
    });
    /* ---- Scroll reveal fallback ---- */
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
    /* ---- Anchor link scroll fallback ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        var href = anchor.getAttribute('href');
        if (href === '#' || href === '#main-content') return;
        var target = document.querySelector(href);
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }
})();
