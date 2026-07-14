/* ==========================================================================
   CART / WISHLIST / CHECKOUT / AUTH interactions
   ========================================================================== */

const SHIPPING_FEE = 25000;
let appliedDiscount = 0;

function cartLineItems() {
  return window.CartStore.getAll().map(ci => ({ ...ci, product: getProduct(ci.id) })).filter(ci => ci.product);
}

function cartSubtotal(items) { return items.reduce((s, i) => s + i.product.price * i.qty, 0); }

/* ==========================================================================
   CART PAGE
   ========================================================================== */
function initCartPage() {
  const list = document.getElementById('cartList');
  if (!list) return;

  function render() {
    const items = cartLineItems();
    const emptyState = document.getElementById('cartEmpty');
    const cartLayout = document.getElementById('cartLayout');

    if (!items.length) {
      cartLayout.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    cartLayout.style.display = '';
    emptyState.style.display = 'none';

    list.innerHTML = items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-info">
          <div class="cart-item-thumb"><img src="${item.product.image}" alt="${item.product.name}" loading="lazy"></div>
          <div>
            <a href="product-detail.html?id=${item.product.id}" class="cart-item-name">${item.product.name}</a>
            <div class="cart-item-variant">${getCategoryName(item.product.cat)}</div>
            <button class="cart-item-remove" data-id="${item.id}"><span data-icon="trash"></span> Xóa</button>
          </div>
        </div>
        <div class="cart-price-cell" data-label="Đơn giá">
          ${formatVND(item.product.price)}
          ${item.product.oldPrice ? `<span class="strike">${formatVND(item.product.oldPrice)}</span>` : ''}
        </div>
        <div data-label="Số lượng">
          <div class="qty-stepper">
            <button class="qty-minus" data-id="${item.id}"><span data-icon="minus"></span></button>
            <input type="text" value="${item.qty}" readonly>
            <button class="qty-plus" data-id="${item.id}"><span data-icon="plus"></span></button>
          </div>
        </div>
        <div class="cart-total-cell" data-label="Thành tiền">${formatVND(item.product.price * item.qty)}</div>
        <button class="cart-remove-btn" data-id="${item.id}" aria-label="Xóa sản phẩm"><span data-icon="x"></span></button>
      </div>
    `).join('');
    renderIcons(list);

    list.querySelectorAll('.qty-plus').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const it = items.find(i => i.id == id);
      window.CartStore.updateQty(id, null, it.qty + 1);
      render();
    }));
    list.querySelectorAll('.qty-minus').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const it = items.find(i => i.id == id);
      if (it.qty <= 1) return;
      window.CartStore.updateQty(id, null, it.qty - 1);
      render();
    }));
    list.querySelectorAll('.cart-item-remove, .cart-remove-btn').forEach(btn => btn.addEventListener('click', () => {
      window.CartStore.remove(btn.getAttribute('data-id'), null);
      window.showToast('Đã xóa sản phẩm khỏi giỏ hàng');
      render();
    }));

    renderSummary(items);
  }

  function renderSummary(items) {
    const subtotal = cartSubtotal(items);
    const discount = Math.round(subtotal * appliedDiscount);
    const total = subtotal - discount + (subtotal > 0 ? SHIPPING_FEE : 0);
    document.getElementById('sumSubtotal').textContent = formatVND(subtotal);
    document.getElementById('sumShipping').textContent = formatVND(SHIPPING_FEE);
    document.getElementById('sumTotal').textContent = formatVND(total);
    const discountRow = document.getElementById('sumDiscountRow');
    if (discount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('sumDiscount').textContent = '-' + formatVND(discount);
    } else discountRow.style.display = 'none';
  }

  document.getElementById('voucherApply')?.addEventListener('click', () => {
    const code = document.getElementById('voucherInput').value.trim().toUpperCase();
    if (code === 'SALE10') { appliedDiscount = 0.1; window.showToast('Áp dụng mã giảm giá thành công: -10%', 'success'); }
    else { appliedDiscount = 0; window.showToast('Mã giảm giá không hợp lệ'); }
    render();
  });

  render();
}

/* ==========================================================================
   WISHLIST PAGE
   ========================================================================== */
function initWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;
  function render() {
    const ids = window.WishlistStore.getAll();
    const items = ids.map(id => getProduct(id)).filter(Boolean);
    const emptyState = document.getElementById('wishlistEmpty');
    if (!items.length) {
      grid.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }
    grid.style.display = '';
    emptyState.style.display = 'none';
    grid.innerHTML = items.map(p => productCardHTML(p)).join('');
    renderIcons(grid);
    bindProductCardEvents(grid);
    grid.querySelectorAll('.wishlist-btn').forEach(btn => btn.addEventListener('click', () => setTimeout(render, 50)));
  }
  render();
}

/* ==========================================================================
   CHECKOUT PAGE
   ========================================================================== */
function initCheckoutPage() {
  const stepper = document.getElementById('checkoutStepper');
  if (!stepper) return;
  let step = 1;
  const items = cartLineItems();
  const subtotal = cartSubtotal(items);
  const total = subtotal + (subtotal > 0 ? SHIPPING_FEE : 0);

  function renderOrderReview() {
    const wrap = document.getElementById('orderReviewList');
    if (!wrap) return;
    wrap.innerHTML = items.map(i => `
      <div class="order-review-item">
        <div class="thumb"><img src="${i.product.image}" alt="${i.product.name}" loading="lazy"><span class="qty-badge">${i.qty}</span></div>
        <div class="name">${i.product.name}</div>
        <div class="price">${formatVND(i.product.price * i.qty)}</div>
      </div>`).join('');
    document.getElementById('checkoutSubtotal').textContent = formatVND(subtotal);
    document.getElementById('checkoutShipping').textContent = formatVND(subtotal > 0 ? SHIPPING_FEE : 0);
    document.getElementById('checkoutTotal').textContent = formatVND(total);
  }
  renderOrderReview();

  function goToStep(n) {
    step = n;
    document.querySelectorAll('.checkout-step-panel').forEach(p => p.style.display = 'none');
    const panel = document.getElementById('checkoutStep' + n);
    if (panel) panel.style.display = 'block';
    document.querySelectorAll('.step').forEach((el, i) => {
      el.classList.remove('active', 'done');
      if (i + 1 < n) el.classList.add('done');
      if (i + 1 === n) el.classList.add('active');
    });
    document.querySelectorAll('.step-line').forEach((el, i) => el.classList.toggle('done', i + 1 < n));
    const sidebar = document.querySelector('.checkout-layout .cart-summary');
    const stepperEl = document.getElementById('checkoutStepper');
    if (n === 4) {
      if (sidebar) sidebar.style.display = 'none';
      if (stepperEl) stepperEl.style.display = 'none';
    } else {
      if (sidebar) sidebar.style.display = '';
      if (stepperEl) stepperEl.style.display = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('[data-next-step]').forEach(btn => btn.addEventListener('click', () => goToStep(parseInt(btn.getAttribute('data-next-step')))));
  document.querySelectorAll('[data-prev-step]').forEach(btn => btn.addEventListener('click', () => goToStep(parseInt(btn.getAttribute('data-prev-step')))));

  document.querySelectorAll('.shipping-option').forEach(opt => opt.addEventListener('click', () => {
    document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input').checked = true;
  }));
  document.querySelectorAll('.payment-option').forEach(opt => opt.addEventListener('click', () => {
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input').checked = true;
  }));

  document.querySelectorAll('.place-order-trigger').forEach(btn => btn.addEventListener('click', () => {
    window.CartStore.clear();
    const code = 'DH' + Math.floor(100000 + Math.random() * 900000);
    const codeEl = document.getElementById('orderCode');
    if (codeEl) codeEl.textContent = 'Mã đơn hàng: ' + code;
    goToStep(4);
  }));

  goToStep(1);
}

/* ==========================================================================
   AUTH PAGES — password visibility toggle
   ========================================================================== */
function initAuthInteractions() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.innerHTML = ICONS[isPw ? 'eyeOff' : 'eye'];
    });
  });

  const pwInput = document.getElementById('registerPassword');
  const strengthBars = document.querySelectorAll('.password-strength div');
  if (pwInput && strengthBars.length) {
    pwInput.addEventListener('input', () => {
      const val = pwInput.value;
      let score = 0;
      if (val.length >= 6) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;
      const colors = ['#ECECEC', '#DD0000', '#FF7A00', '#FFC857', '#16A34A'];
      strengthBars.forEach((bar, i) => { bar.style.background = i < score ? colors[score] : '#ECECEC'; });
    });
  }

  document.querySelectorAll('form[data-auth-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      window.showToast('Đây là bản demo giao diện — chức năng sẽ được kết nối với máy chủ (PHP/MySQL).', 'success');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCartPage();
  initWishlistPage();
  initCheckoutPage();
  initAuthInteractions();
});
