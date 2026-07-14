/* ==========================================================================
   MAIN — global site behaviors shared by every page
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Sticky header shadow on scroll ---- */
  const header = document.getElementById('siteHeader');
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (backToTop) backToTop.classList.toggle('show', y > 500);
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- Mobile drawer ---- */
  const drawer = document.getElementById('mobileDrawer');
  const mobileToggle = document.getElementById('mobileToggle');
  const drawerClose = document.getElementById('drawerClose');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  function openDrawer() { drawer && drawer.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeDrawer() { drawer && drawer.classList.remove('open'); document.body.style.overflow = ''; }
  mobileToggle && mobileToggle.addEventListener('click', openDrawer);
  drawerClose && drawerClose.addEventListener('click', closeDrawer);
  drawerBackdrop && drawerBackdrop.addEventListener('click', closeDrawer);
  document.querySelectorAll('.drawer-toggle-sub').forEach(btn => {
    btn.addEventListener('click', () => {
      const sub = btn.nextElementSibling;
      sub.classList.toggle('open');
      const icon = btn.querySelector('[data-icon]');
      if (icon) icon.style.transform = sub.classList.contains('open') ? 'rotate(180deg)' : '';
    });
  });

  /* ---- Mobile search toggle ---- */
  const mobileSearchToggle = document.getElementById('mobileSearchToggle');
  const mobileSearchBar = document.getElementById('mobileSearchBar');
  mobileSearchToggle && mobileSearchToggle.addEventListener('click', () => {
    if (!mobileSearchBar) return;
    mobileSearchBar.style.display = mobileSearchBar.style.display === 'none' ? 'block' : 'none';
  });

  /* ---- Scroll reveal ---- */
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealItems.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('in-view'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('in-view'));
  }

  /* ---- Ripple effect on buttons ---- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn, .icon-btn, .btn-icon');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    btn.style.position = btn.style.position || 'relative';
    btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });

  /* ---- Toast notifications ---- */
  window.showToast = function (message, type) {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;
    const toast = document.createElement('div');
    toast.className = 'toast' + (type === 'success' ? ' success' : '');
    toast.innerHTML = `<span data-icon="${type === 'success' ? 'checkCircle' : 'bell'}"></span><span>${message}</span>`;
    wrap.appendChild(toast);
    renderIcons(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(30px)'; setTimeout(() => toast.remove(), 300); }, 2800);
  };

  /* ---- Store helpers (localStorage) ---- */
  const STORE_KEYS = { cart: 'vpp_cart', wishlist: 'vpp_wishlist' };
  function readStore(key) { try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; } }
  function writeStore(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  window.CartStore = {
    getAll: () => readStore(STORE_KEYS.cart),
    save: (items) => { writeStore(STORE_KEYS.cart, items); updateBadges(); },
    add: (id, qty, variant) => {
      const items = readStore(STORE_KEYS.cart);
      const existing = items.find(i => i.id == id && i.variant === variant);
      if (existing) existing.qty += qty; else items.push({ id, qty, variant: variant || null });
      writeStore(STORE_KEYS.cart, items);
      updateBadges();
    },
    remove: (id, variant) => {
      let items = readStore(STORE_KEYS.cart).filter(i => !(i.id == id && i.variant === variant));
      writeStore(STORE_KEYS.cart, items);
      updateBadges();
    },
    updateQty: (id, variant, qty) => {
      const items = readStore(STORE_KEYS.cart);
      const it = items.find(i => i.id == id && i.variant === variant);
      if (it) it.qty = Math.max(1, qty);
      writeStore(STORE_KEYS.cart, items);
      updateBadges();
    },
    clear: () => { writeStore(STORE_KEYS.cart, []); updateBadges(); },
    count: () => readStore(STORE_KEYS.cart).reduce((s, i) => s + i.qty, 0),
  };

  window.WishlistStore = {
    getAll: () => readStore(STORE_KEYS.wishlist),
    toggle: (id) => {
      let items = readStore(STORE_KEYS.wishlist);
      if (items.includes(id)) items = items.filter(i => i != id);
      else items.push(id);
      writeStore(STORE_KEYS.wishlist, items);
      updateBadges();
      return items.includes(id);
    },
    has: (id) => readStore(STORE_KEYS.wishlist).includes(id),
    remove: (id) => { writeStore(STORE_KEYS.wishlist, readStore(STORE_KEYS.wishlist).filter(i => i != id)); updateBadges(); },
  };

  function updateBadges() {
    const cartCount = document.getElementById('cartCount');
    const wishlistCount = document.getElementById('wishlistCount');
    if (cartCount) cartCount.textContent = window.CartStore.count();
    if (wishlistCount) wishlistCount.textContent = window.WishlistStore.getAll().length;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // seed demo data on first visit so cart/wishlist aren't empty out of the box
    if (localStorage.getItem('vpp_seeded') === null) {
      writeStore(STORE_KEYS.cart, [{ id: 1, qty: 2, variant: null }, { id: 4, qty: 1, variant: null }, { id: 9, qty: 1, variant: null }]);
      writeStore(STORE_KEYS.wishlist, [5, 12]);
      localStorage.setItem('vpp_seeded', '1');
    }
    updateBadges();
  });

  /* ---- Utility: format VND ---- */
  window.formatVND = (n) => n.toLocaleString('vi-VN') + '₫';

})();
