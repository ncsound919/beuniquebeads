(function () {
  'use strict';

  /* ===== PRODUCT DATA ===== */
  var products = [
    {
      name: '2 pc Black and Red Dice Set',
      price: '$46',
      tag: 'SET',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/2CFB213D-A6D4-4E06-A157-562310F6066C.jpg',
      alt: '2 pc black and red dice set — gold-filled earrings and bracelet',
      url: 'https://beuniquebeads.myshopify.com/products/2-pc-black-and-red-dice-set'
    },
    {
      name: 'Hit the Dice Bangle',
      price: '$65',
      tag: 'STATEMENT',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/CE6E2397-374D-4B9A-A84A-F77A56A01443.jpg',
      alt: 'Hit the Dice Bangle — black and white dice with chunky gold-filled beads bracelet',
      url: 'https://beuniquebeads.myshopify.com/products/hit-the-dice-bangle'
    },
    {
      name: 'Double the Love Starburst Bracelet',
      price: '$22',
      tag: 'BESTSELLER',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/216E93A3-373F-4F48-B215-359913CC2C1D.jpg',
      alt: 'Double the Love starburst bracelet — 14K gold-filled beaded with stardust beads',
      url: 'https://beuniquebeads.myshopify.com/products/double-the-love-starburst-bracelet'
    },
    {
      name: 'Come On Dice Earrings',
      price: '$20',
      tag: 'EARRINGS',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/7ED73C3F-A521-41AC-920E-361A78534A65.jpg',
      alt: 'Come on dice earrings — red and black dice with gold-filled beads',
      url: 'https://beuniquebeads.myshopify.com/products/come-on-dice'
    },
    {
      name: 'April Love Bracelet',
      price: '$15',
      tag: 'AWARENESS',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/09C1EDF4-E7C6-45D8-8514-FE3BBD96D9BC.jpg',
      alt: 'April Love autism awareness bracelet — gold-filled, sizes 6–8 inches',
      url: 'https://beuniquebeads.myshopify.com/products/april-love'
    },
    {
      name: 'Build a Bear Bracelet',
      price: '$15',
      tag: 'NEW',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/B80E954B-C4A8-4F8B-BF85-556AEEC6D8B1.jpg',
      alt: 'Build a Bear gold-filled bracelet — elegant charm bracelet, sizes 6–7.5 inches',
      url: 'https://beuniquebeads.myshopify.com/products/untitled-mar16_22-22'
    },
    {
      name: 'Stardust Earrings',
      price: '$20',
      tag: 'EARRINGS',
      img: 'https://cdn.shopify.com/s/files/1/0818/0406/7051/files/C22C90FE-AFA6-45F6-8F70-78281398EE77.jpg',
      alt: 'Stardust earrings — brown medium earrings with gold-filled beads',
      url: 'https://beuniquebeads.myshopify.com/products/untitled-mar16_22-26'
    }
  ];

  /* ===== MARK JS AS READY — reveals can now animate ===== */
  document.documentElement.classList.add('js-ready');

  /* ===== SCROLL REVEAL ===== */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    }
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
  }

  /* ===== CART DRAWER ===== */
  var cartButton = document.getElementById('cartButton');
  var cartOverlay = null;
  var cartDrawer = null;
  var cartCloseBtn = null;

  function createCartDrawer() {
    cartOverlay = document.createElement('div');
    cartOverlay.className = 'cart-overlay';
    cartOverlay.setAttribute('aria-hidden', 'true');

    cartDrawer = document.createElement('div');
    cartDrawer.className = 'cart-drawer';
    cartDrawer.setAttribute('role', 'dialog');
    cartDrawer.setAttribute('aria-modal', 'true');
    cartDrawer.setAttribute('aria-label', 'Shopping cart');

    cartDrawer.innerHTML = [
      '<div class="cart-drawer-header">',
      '  <h3>Your Cart</h3>',
      '  <button type="button" class="cart-drawer-close" aria-label="Close cart">&times;</button>',
      '</div>',
      '<div class="cart-drawer-body">',
      '  <i class="fas fa-shopping-bag" aria-hidden="true"></i>',
      '  <p>Browse our full collection on Shopify to add items to your cart.</p>',
      '  <a href="https://beuniquebeads.myshopify.com/collections/all" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Shop Now</a>',
      '</div>'
    ].join('');

    document.body.appendChild(cartOverlay);
    document.body.appendChild(cartDrawer);

    cartCloseBtn = cartDrawer.querySelector('.cart-drawer-close');

    function closeCart() {
      cartOverlay.classList.remove('active');
      cartOverlay.setAttribute('aria-hidden', 'true');
      cartDrawer.classList.remove('active');
      document.removeEventListener('keydown', cartKeyHandler);
      if (cartButton) cartButton.focus();
    }

    function cartKeyHandler(event) {
      if (event.key === 'Escape') {
        closeCart();
      }
    }

    cartCloseBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    return {
      open: function () {
        cartOverlay.classList.add('active');
        cartOverlay.setAttribute('aria-hidden', 'false');
        cartDrawer.classList.add('active');
        document.addEventListener('keydown', cartKeyHandler);
        if (cartCloseBtn) cartCloseBtn.focus();
      },
      close: closeCart
    };
  }

  var cartController = createCartDrawer();

  if (cartButton) {
    cartButton.addEventListener('click', function () {
      cartController.open();
    });
  }

  /* ===== ESCAPE KEY ===== */
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      var overlayActive =
        (cartOverlay && cartOverlay.classList.contains('active')) ||
        (mobileMenu && mobileMenu.classList.contains('active'));
      if (overlayActive) {
        if (cartOverlay && cartOverlay.classList.contains('active')) {
          cartController.close();
        }
        closeMobileMenu();
      }
    }
  });

  /* ===== NEWSLETTER ===== */
  var newsletterForm = document.getElementById('newsletterForm');
  var newsletterMessage = document.getElementById('newsletterMessage');
  var newsletterInput = document.getElementById('news_email');

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  if (newsletterForm && newsletterMessage) {
    newsletterForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var email = newsletterInput ? newsletterInput.value.trim() : '';

      if (email === '') {
        newsletterMessage.textContent = 'Please enter your email address.';
        newsletterMessage.className = 'newsletter-message error';
        if (newsletterInput) newsletterInput.classList.add('error');
        return;
      }

      if (!isValidEmail(email)) {
        newsletterMessage.textContent = 'Please enter a valid email address.';
        newsletterMessage.className = 'newsletter-message error';
        if (newsletterInput) newsletterInput.classList.add('error');
        return;
      }

      if (newsletterInput) newsletterInput.classList.remove('error');
      newsletterMessage.textContent = 'Thank you! You\'ve been added to Toya\'s list. Check your inbox soon.';
      newsletterMessage.className = 'newsletter-message success';
      newsletterForm.reset();

      setTimeout(function () {
        newsletterMessage.textContent = '';
        newsletterMessage.className = 'newsletter-message';
      }, 6000);
    });

    if (newsletterInput) {
      newsletterInput.addEventListener('input', function () {
        newsletterInput.classList.remove('error');
      });
    }
  }

  /* ===== SOCIAL LINKS ===== */
  var socialButtons = document.querySelectorAll('.social-links .social-btn');
  socialButtons.forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      var platform = btn.getAttribute('aria-label') || 'Social';
      showToast(platform.replace(' (coming soon)', '') + ' coming soon!');
    });
  });

  /* ===== IMAGE ERROR HANDLING ===== */
  function setupImageErrorHandling(container) {
    if (!container) container = document;
    var images = container.querySelectorAll('img');
    images.forEach(function (img) {
      img.addEventListener('error', function () {
        img.style.display = 'none';
        var placeholder = document.createElement('div');
        placeholder.style.cssText =
          'width:100%;height:100%;background:var(--ivory);display:flex;align-items:center;justify-content:center;color:var(--clay);font-size:2rem;min-height:200px;';
        placeholder.setAttribute('aria-label', img.alt || 'Image failed to load');
        placeholder.innerHTML = '<i class="fas fa-image" aria-hidden="true"></i>';
        if (img.parentNode) img.parentNode.insertBefore(placeholder, img);
      });
    });
  }

  setupImageErrorHandling();

  /* ===== SMOOTH SCROLL ===== */
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

})();
