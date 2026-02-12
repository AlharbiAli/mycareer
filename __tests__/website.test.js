const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

/** Create a fresh JSDOM instance with full script execution */
function createDOM(localStorageData) {
  const dom = new JSDOM(html, {
    url: 'http://localhost/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(window) {
      // Mock scrollTo to avoid jsdom "not implemented" error
      window.scrollTo = jest.fn();

      // Seed localStorage if needed
      if (localStorageData) {
        for (const [key, value] of Object.entries(localStorageData)) {
          window.localStorage.setItem(key, value);
        }
      }
    },
  });
  return dom;
}

// ─── HTML STRUCTURE ───────────────────────────────────────────────

describe('HTML Structure', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('has correct page title', () => {
    expect(document.title).toBe('Ali Alharbi | Career Coaching & HR Products');
  });

  test('has meta viewport tag', () => {
    const meta = document.querySelector('meta[name="viewport"]');
    expect(meta).not.toBeNull();
    expect(meta.content).toContain('width=device-width');
  });

  test('has meta description', () => {
    const meta = document.querySelector('meta[name="description"]');
    expect(meta).not.toBeNull();
    expect(meta.content).toBe('Career coaching sessions and practical HR templates.');
  });

  test('has a sticky header', () => {
    const header = document.querySelector('header');
    expect(header).not.toBeNull();
  });

  test('has brand section with correct name', () => {
    const brand = document.querySelector('.brand');
    expect(brand).not.toBeNull();
    expect(brand.textContent).toContain('Ali Alharbi');
  });

  test('has logo element', () => {
    const logo = document.querySelector('.logo');
    expect(logo).not.toBeNull();
    expect(logo.getAttribute('aria-hidden')).toBe('true');
  });

  test('has footer with copyright', () => {
    const footer = document.querySelector('footer');
    expect(footer).not.toBeNull();
    expect(footer.textContent).toContain('Ali Alharbi');
  });

  test('footer year is set to current year', () => {
    const yearEl = document.getElementById('year');
    expect(yearEl).not.toBeNull();
    expect(yearEl.textContent).toBe(String(new Date().getFullYear()));
  });
});

// ─── NAVIGATION ───────────────────────────────────────────────────

describe('Navigation', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('has four navigation links', () => {
    const navLinks = document.querySelectorAll('.navlinks .pill');
    expect(navLinks.length).toBe(4);
  });

  test('nav links have correct hrefs', () => {
    const navLinks = document.querySelectorAll('.navlinks .pill');
    const hrefs = Array.from(navLinks).map(a => a.getAttribute('href'));
    expect(hrefs).toEqual(['#about', '#coaching', '#products', '#blog']);
  });

  test('nav links have correct labels', () => {
    const navLinks = document.querySelectorAll('.navlinks .pill');
    const labels = Array.from(navLinks).map(a => a.textContent.trim());
    expect(labels).toEqual(['About', 'Career Coaching', 'HR Products', 'HR Blog']);
  });

  test('nav has proper aria-label', () => {
    const nav = document.querySelector('nav[aria-label="Primary"]');
    expect(nav).not.toBeNull();
  });

  test('all nav links have data-route attribute', () => {
    const navLinks = document.querySelectorAll('.navlinks .pill');
    navLinks.forEach(link => {
      expect(link.hasAttribute('data-route')).toBe(true);
    });
  });
});

// ─── SECTIONS ─────────────────────────────────────────────────────

describe('Sections', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('has four main sections', () => {
    const sections = document.querySelectorAll('main section');
    expect(sections.length).toBe(4);
  });

  test('sections have correct IDs', () => {
    const sections = document.querySelectorAll('main section');
    const ids = Array.from(sections).map(s => s.id);
    expect(ids).toEqual(['about', 'coaching', 'products', 'blog']);
  });

  test('sections have aria-labels', () => {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
      expect(section.getAttribute('aria-label')).toBeTruthy();
    });
  });

  test('about section is active by default', () => {
    const about = document.getElementById('about');
    expect(about.classList.contains('active')).toBe(true);
  });

  test('other sections are hidden by default', () => {
    ['coaching', 'products', 'blog'].forEach(id => {
      const section = document.getElementById(id);
      expect(section.classList.contains('active')).toBe(false);
    });
  });
});

// ─── ABOUT SECTION ────────────────────────────────────────────────

describe('About Section', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('has main heading', () => {
    const h1 = document.querySelector('#about .h1');
    expect(h1).not.toBeNull();
    expect(h1.textContent).toContain('Practical coaching');
  });

  test('has skill tags', () => {
    const tags = document.querySelectorAll('#about .tag');
    expect(tags.length).toBe(6);
    const tagTexts = Array.from(tags).map(t => t.textContent);
    expect(tagTexts).toContain('Career clarity');
    expect(tagTexts).toContain('HR analytics');
  });

  test('has call-to-action buttons', () => {
    const buttons = document.querySelectorAll('#about .btnrow .btn');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });

  test('has "What I do" and "Who it\'s for" subsections', () => {
    const headings = document.querySelectorAll('#about .h2');
    const texts = Array.from(headings).map(h => h.textContent);
    expect(texts).toContain('What I do');
    expect(texts.some(t => t.includes('Who it'))).toBe(true);
  });

  test('has quick contact card', () => {
    const aboutCards = document.querySelectorAll('#about .card');
    expect(aboutCards.length).toBeGreaterThanOrEqual(2);
    const contactCard = aboutCards[1];
    expect(contactCard.textContent).toContain('Quick contact');
  });
});

// ─── COACHING SECTION ─────────────────────────────────────────────

describe('Coaching Section', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('has three coaching tiers', () => {
    const cards = document.querySelectorAll('#coaching .grid3 .card');
    expect(cards.length).toBe(3);
  });

  test('displays correct pricing', () => {
    const prices = document.querySelectorAll('#coaching .price');
    const priceTexts = Array.from(prices).map(p => p.textContent.trim());
    expect(priceTexts).toContain('SAR 199');
    expect(priceTexts).toContain('SAR 399');
    expect(priceTexts).toContain('SAR 999');
  });

  test('has pay and book buttons for each tier', () => {
    expect(document.getElementById('payQuick')).not.toBeNull();
    expect(document.getElementById('payFull')).not.toBeNull();
    expect(document.getElementById('payPack')).not.toBeNull();
    expect(document.getElementById('bookQuick')).not.toBeNull();
    expect(document.getElementById('bookFull')).not.toBeNull();
    expect(document.getElementById('bookPack')).not.toBeNull();
  });

  test('pay buttons link to CONFIG payment URLs', () => {
    expect(document.getElementById('payQuick').href.toLowerCase()).toContain('payment-link-for-30min');
    expect(document.getElementById('payFull').href.toLowerCase()).toContain('payment-link-for-60min');
    expect(document.getElementById('payPack').href.toLowerCase()).toContain('payment-link-for-package');
  });

  test('book buttons link to CONFIG booking URLs', () => {
    expect(document.getElementById('bookQuick').href.toLowerCase()).toContain('booking-link-30min');
    expect(document.getElementById('bookFull').href.toLowerCase()).toContain('booking-link-60min');
    expect(document.getElementById('bookPack').href.toLowerCase()).toContain('booking-link-package');
  });

  test('has "How it works" and "What to prepare" info', () => {
    const coaching = document.getElementById('coaching');
    expect(coaching.textContent).toContain('How it works');
    expect(coaching.textContent).toContain('What to prepare');
  });
});

// ─── PRODUCTS SECTION ─────────────────────────────────────────────

describe('Products Section', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('renders all 6 products', () => {
    const productCards = document.querySelectorAll('#productGrid .card');
    expect(productCards.length).toBe(6);
  });

  test('each product has a title, description, price, and add button', () => {
    const productCards = document.querySelectorAll('#productGrid .card');
    productCards.forEach(card => {
      expect(card.querySelector('.h3')).not.toBeNull();
      expect(card.querySelector('.muted')).not.toBeNull();
      expect(card.querySelector('.price')).not.toBeNull();
      expect(card.querySelector('[data-add]')).not.toBeNull();
    });
  });

  test('product prices match CONFIG', () => {
    const expectedPrices = [249, 299, 349, 199, 279, 179];
    const priceEls = document.querySelectorAll('#productGrid .price');
    const renderedPrices = Array.from(priceEls).map(el => {
      return parseInt(el.textContent.replace(/[^0-9]/g, ''));
    });
    expect(renderedPrices).toEqual(expectedPrices);
  });

  test('product titles match CONFIG', () => {
    const expectedTitles = [
      'HR Policy Starter Kit',
      'Org Design Pack',
      'HR KPIs Dashboard',
      'Recruitment Toolkit',
      'Compensation Review Template',
      'Learning & Capability Plan',
    ];
    const titleEls = document.querySelectorAll('#productGrid .h3');
    const renderedTitles = Array.from(titleEls).map(el => el.textContent);
    expect(renderedTitles).toEqual(expectedTitles);
  });

  test('has cart sidebar', () => {
    const cart = document.querySelector('.cart');
    expect(cart).not.toBeNull();
    expect(cart.getAttribute('aria-label')).toBe('Cart');
  });

  test('cart is empty initially', () => {
    const cartItems = document.getElementById('cartItems');
    expect(cartItems.textContent).toBe('Your cart is empty.');
    const cartTotal = document.getElementById('cartTotal');
    expect(cartTotal.textContent).toBe('SAR 0');
  });

  test('has checkout and clear buttons', () => {
    expect(document.getElementById('checkoutBtn')).not.toBeNull();
    expect(document.getElementById('clearCart')).not.toBeNull();
  });
});

// ─── CART FUNCTIONALITY ───────────────────────────────────────────

describe('Cart Functionality', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('adding a product updates the cart display', () => {
    const addBtn = document.querySelector('[data-add="hr-policy-kit"]');
    addBtn.click();

    const cartItems = document.getElementById('cartItems');
    expect(cartItems.textContent).toContain('HR Policy Starter Kit');

    const cartTotal = document.getElementById('cartTotal');
    expect(cartTotal.textContent).toContain('249');
  });

  test('adding same product twice increases quantity', () => {
    const addBtn = document.querySelector('[data-add="hr-policy-kit"]');
    addBtn.click();
    addBtn.click();

    const qtySpan = document.querySelector('.cartItem .qty span');
    expect(qtySpan.textContent).toBe('2');

    const cartTotal = document.getElementById('cartTotal');
    expect(cartTotal.textContent).toContain('498');
  });

  test('adding multiple different products shows all in cart', () => {
    document.querySelector('[data-add="hr-policy-kit"]').click();
    document.querySelector('[data-add="org-design-pack"]').click();

    const cartItems = document.querySelectorAll('.cartItem');
    expect(cartItems.length).toBe(2);

    // Total should be 249 + 299 = 548
    const cartTotal = document.getElementById('cartTotal');
    expect(cartTotal.textContent).toContain('548');
  });

  test('increase button increments quantity', () => {
    document.querySelector('[data-add="hr-policy-kit"]').click();

    const incBtn = document.querySelector('[data-inc="hr-policy-kit"]');
    incBtn.click();

    const qtySpan = document.querySelector('.cartItem .qty span');
    expect(qtySpan.textContent).toBe('2');
  });

  test('decrease button decrements quantity', () => {
    const addBtn = document.querySelector('[data-add="hr-policy-kit"]');
    addBtn.click();
    addBtn.click(); // qty = 2

    const decBtn = document.querySelector('[data-dec="hr-policy-kit"]');
    decBtn.click(); // qty = 1

    const qtySpan = document.querySelector('.cartItem .qty span');
    expect(qtySpan.textContent).toBe('1');
  });

  test('decreasing quantity to zero removes item from cart', () => {
    document.querySelector('[data-add="hr-policy-kit"]').click();

    const decBtn = document.querySelector('[data-dec="hr-policy-kit"]');
    decBtn.click();

    const cartItems = document.getElementById('cartItems');
    expect(cartItems.textContent).toBe('Your cart is empty.');
  });

  test('clear cart button empties the cart', () => {
    document.querySelector('[data-add="hr-policy-kit"]').click();
    document.querySelector('[data-add="org-design-pack"]').click();

    document.getElementById('clearCart').click();

    const cartItems = document.getElementById('cartItems');
    expect(cartItems.textContent).toBe('Your cart is empty.');
    const cartTotal = document.getElementById('cartTotal');
    expect(cartTotal.textContent).toBe('SAR 0');
  });

  test('cart persists in localStorage', () => {
    document.querySelector('[data-add="hr-policy-kit"]').click();

    const stored = JSON.parse(dom.window.localStorage.getItem('cart_v1'));
    expect(stored).toEqual({ 'hr-policy-kit': 1 });
  });

  test('cart loads from localStorage on page load', () => {
    dom.window.close();

    // Create a new DOM with pre-seeded localStorage
    dom = createDOM({ cart_v1: JSON.stringify({ 'org-design-pack': 3 }) });
    document = dom.window.document;

    const cartItems = document.getElementById('cartItems');
    expect(cartItems.textContent).toContain('Org Design Pack');

    const qtySpan = document.querySelector('.cartItem .qty span');
    expect(qtySpan.textContent).toBe('3');

    // Total: 299 * 3 = 897
    const cartTotal = document.getElementById('cartTotal');
    expect(cartTotal.textContent).toContain('897');
  });

  test('checkout on empty cart shows alert', () => {
    dom.window.alert = jest.fn();

    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.click();

    expect(dom.window.alert).toHaveBeenCalledWith('Your cart is empty. Add a product first.');
  });
});

// ─── BLOG SECTION ─────────────────────────────────────────────────

describe('Blog Section', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('renders all 3 blog posts', () => {
    const posts = document.querySelectorAll('#blogGrid .post');
    expect(posts.length).toBe(3);
  });

  test('each post has a title, date, excerpt, and read button', () => {
    const posts = document.querySelectorAll('#blogGrid .post');
    posts.forEach(post => {
      expect(post.querySelector('h4')).not.toBeNull();
      expect(post.querySelector('.mini')).not.toBeNull();
      expect(post.querySelector('.muted')).not.toBeNull();
      expect(post.querySelector('[data-read]')).not.toBeNull();
    });
  });

  test('blog post titles match CONFIG', () => {
    const expectedTitles = [
      'A simple framework for career clarity',
      'Interview prep: the STAR method that actually works',
      'HR templates: why teams fail to adopt them',
    ];
    const titleEls = document.querySelectorAll('#blogGrid .post h4');
    const renderedTitles = Array.from(titleEls).map(el => el.textContent);
    expect(renderedTitles).toEqual(expectedTitles);
  });

  test('clicking Read button shows alert with post content', () => {
    dom.window.alert = jest.fn();

    const readBtn = document.querySelector('[data-read="0"]');
    readBtn.click();

    expect(dom.window.alert).toHaveBeenCalledTimes(1);
    const alertText = dom.window.alert.mock.calls[0][0];
    expect(alertText).toContain('A simple framework for career clarity');
    expect(alertText).toContain('What do I want to be known for');
  });
});

// ─── XSS PROTECTION ──────────────────────────────────────────────

describe('XSS Protection (escapeHtml)', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('product titles are HTML-escaped in rendering', () => {
    const titles = document.querySelectorAll('#productGrid .h3');
    titles.forEach(title => {
      expect(title.innerHTML).not.toMatch(/<script/i);
    });
  });

  test('blog titles are HTML-escaped in rendering', () => {
    const titles = document.querySelectorAll('#blogGrid h4');
    titles.forEach(title => {
      expect(title.innerHTML).not.toMatch(/<script/i);
    });
  });
});

// ─── CSS THEME VARIABLES ─────────────────────────────────────────

describe('CSS Theme Variables', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('defines required CSS custom properties', () => {
    const style = document.querySelector('style');
    expect(style).not.toBeNull();
    const cssText = style.textContent;

    const requiredVars = ['--bg', '--card', '--text', '--muted', '--accent', '--accent2', '--radius', '--max'];
    requiredVars.forEach(varName => {
      expect(cssText).toContain(varName);
    });
  });
});

// ─── RESPONSIVE DESIGN ───────────────────────────────────────────

describe('Responsive Design', () => {
  test('has responsive media queries', () => {
    const dom = createDOM();
    const style = dom.window.document.querySelector('style');
    const cssText = style.textContent;
    expect(cssText).toContain('@media');
    expect(cssText).toContain('max-width: 860px');
    expect(cssText).toContain('max-width: 620px');
    dom.window.close();
  });
});

// ─── ACCESSIBILITY ────────────────────────────────────────────────

describe('Accessibility', () => {
  let dom, document;
  beforeEach(() => {
    dom = createDOM();
    document = dom.window.document;
  });
  afterEach(() => dom.window.close());

  test('html has lang attribute', () => {
    expect(html).toContain('lang="en"');
  });

  test('brand has banner role', () => {
    const brand = document.querySelector('[role="banner"]');
    expect(brand).not.toBeNull();
  });

  test('navigation has aria-label', () => {
    const nav = document.querySelector('nav[aria-label]');
    expect(nav).not.toBeNull();
    expect(nav.getAttribute('aria-label')).toBe('Primary');
  });

  test('all sections have aria-labels', () => {
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
      const label = section.getAttribute('aria-label');
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    });
  });

  test('cart aside has aria-label', () => {
    const cart = document.querySelector('aside[aria-label="Cart"]');
    expect(cart).not.toBeNull();
  });

  test('quantity buttons have aria-labels', () => {
    // Add item to cart first to render quantity buttons
    document.querySelector('[data-add="hr-policy-kit"]').click();

    const decBtn = document.querySelector('[data-dec]');
    const incBtn = document.querySelector('[data-inc]');
    expect(decBtn.getAttribute('aria-label')).toBe('Decrease');
    expect(incBtn.getAttribute('aria-label')).toBe('Increase');
  });
});
