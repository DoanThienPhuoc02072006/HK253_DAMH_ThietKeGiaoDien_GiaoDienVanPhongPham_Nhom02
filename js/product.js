/* ==========================================================================
   PRODUCT — card rendering + listing page + detail page behavior
   ========================================================================== */

function starsHTML(rating) {
  let html = '<span class="stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span data-icon="${i <= Math.round(rating) ? 'star' : 'starOutline'}"></span>`;
  }
  html += '</span>';
  return html;
}

function productCardHTML(p) {
  const inWishlist = window.WishlistStore ? window.WishlistStore.has(p.id) : false;
  return `
  <article class="card product-card" data-id="${p.id}">
    <a href="product-detail.html?id=${p.id}" class="product-media">
      ${p.badge ? `<div class="product-badges"><span class="badge ${p.badge.includes('-') ? 'badge-primary' : (p.badge === 'Mới' ? 'badge-info' : 'badge-secondary')}">${p.badge}</span></div>` : ''}
      <div class="thumb-svg"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
    </a>
    <div class="product-quick">
      <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${p.id}" aria-label="Yêu thích"><span data-icon="heart"></span></button>
      <button class="compare-btn" data-id="${p.id}" aria-label="So sánh"><span data-icon="compare"></span></button>
      <button class="quickview-btn" data-id="${p.id}" aria-label="Xem nhanh"><span data-icon="eye"></span></button>
    </div>
    <div class="product-body">
      <span class="product-cat">${getCategoryName(p.cat)}</span>
      <a href="product-detail.html?id=${p.id}" class="product-name">${p.name}</a>
      <div class="product-rating">${starsHTML(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
      <div class="product-price">
        <span class="now">${formatVND(p.price)}</span>
        ${p.oldPrice ? `<span class="old">${formatVND(p.oldPrice)}</span>` : ''}
      </div>
      <button class="product-add add-to-cart-btn" data-id="${p.id}"><span data-icon="cart"></span> Thêm vào giỏ</button>
    </div>
  </article>`;
}

function bindProductCardEvents(scope) {
  const root = scope || document;
  root.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const p = getProduct(id);
      window.CartStore.add(id, 1, null);
      window.showToast(`Đã thêm "${p.name}" vào giỏ hàng`, 'success');
    });
  });
  root.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-id');
      const added = window.WishlistStore.toggle(id);
      btn.classList.toggle('active', added);
      window.showToast(added ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích', added ? 'success' : null);
    });
  });
  root.querySelectorAll('.compare-btn, .quickview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.showToast('Tính năng sẽ được cập nhật sớm!');
    });
  });
}

/* ==========================================================================
   LISTING PAGE (products.html)
   ========================================================================== */
function initShopPage() {
  const grid = document.getElementById('productGrid');
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const state = {
    cat: params.get('cat') ? [params.get('cat')] : [],
    filter: params.get('filter') || null,
    sort: 'default',
    view: 'grid',
    page: 1,
    perPage: 9,
    priceMax: 2500000,
  };

  function getFiltered() {
    let list = PRODUCTS.slice();
    if (state.cat.length) list = list.filter(p => state.cat.includes(p.cat));
    if (state.filter === 'new') list = list.filter(p => p.badge === 'Mới');
    if (state.filter === 'bestseller') list = list.filter(p => p.badge === 'Bán chạy');
    if (state.filter === 'sale') list = list.filter(p => p.oldPrice);
    list = list.filter(p => p.price <= state.priceMax);
    if (state.sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    if (state.sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }

  function render() {
    const list = getFiltered();
    const totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.perPage;
    const pageItems = list.slice(start, start + state.perPage);

    grid.innerHTML = pageItems.length
      ? pageItems.map(p => productCardHTML(p)).join('')
      : `<div class="empty-state" style="grid-column:1/-1"><span data-icon="search" style="width:60px;height:60px;color:var(--color-border)"></span><h3>Không tìm thấy sản phẩm phù hợp</h3><p>Hãy thử thay đổi bộ lọc tìm kiếm của bạn.</p></div>`;
    renderIcons(grid);
    bindProductCardEvents(grid);

    const resultCount = document.getElementById('resultCount');
    if (resultCount) resultCount.innerHTML = `Hiển thị <strong>${pageItems.length}</strong> trong <strong>${list.length}</strong> sản phẩm`;

    renderPagination(totalPages);
    renderActiveChips();
  }

  function renderPagination(totalPages) {
    const wrap = document.getElementById('pagination');
    if (!wrap) return;
    let html = `<button ${state.page === 1 ? 'disabled style="opacity:.4"' : ''} data-page="${state.page - 1}"><span data-icon="chevronLeft"></span></button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="${i === state.page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button ${state.page === totalPages ? 'disabled style="opacity:.4"' : ''} data-page="${state.page + 1}"><span data-icon="chevronRight"></span></button>`;
    wrap.innerHTML = html;
    renderIcons(wrap);
    wrap.querySelectorAll('button[data-page]').forEach(btn => {
      btn.addEventListener('click', () => { state.page = parseInt(btn.getAttribute('data-page')); render(); window.scrollTo({top: document.getElementById('shopToolbar').offsetTop - 100, behavior:'smooth'}); });
    });
  }

  function renderActiveChips() {
    const wrap = document.getElementById('activeFilters');
    if (!wrap) return;
    let chips = [];
    state.cat.forEach(c => chips.push({ label: getCategoryName(c), clear: () => { state.cat = state.cat.filter(x => x !== c); } }));
    if (state.filter) chips.push({ label: state.filter === 'new' ? 'Sản phẩm mới' : state.filter === 'bestseller' ? 'Bán chạy' : 'Khuyến mãi', clear: () => { state.filter = null; } });
    wrap.innerHTML = chips.map((c, i) => `<span class="filter-chip" data-idx="${i}">${c.label} <button data-icon="x"></button></span>`).join('');
    renderIcons(wrap);
    wrap.querySelectorAll('.filter-chip').forEach((chip, i) => {
      chip.querySelector('button').addEventListener('click', () => { chips[i].clear(); syncCheckboxes(); render(); });
    });
  }

  function syncCheckboxes() {
    document.querySelectorAll('.cat-filter-check').forEach(cb => { cb.checked = state.cat.includes(cb.value); });
  }

  // Category checkboxes
  document.querySelectorAll('.cat-filter-check').forEach(cb => {
    if (state.cat.includes(cb.value)) cb.checked = true;
    cb.addEventListener('change', () => {
      state.cat = Array.from(document.querySelectorAll('.cat-filter-check:checked')).map(c => c.value);
      state.page = 1;
      render();
    });
  });

  // Price range
  const priceRange = document.getElementById('priceRange');
  const priceMaxLabel = document.getElementById('priceMaxLabel');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      state.priceMax = parseInt(priceRange.value);
      if (priceMaxLabel) priceMaxLabel.textContent = formatVND(state.priceMax);
      state.page = 1;
      render();
    });
  }

  // Sort
  const sortSelect = document.getElementById('sortSelect');
  sortSelect && sortSelect.addEventListener('change', () => { state.sort = sortSelect.value; render(); });

  // View toggle
  document.querySelectorAll('.view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.view = btn.getAttribute('data-view');
      grid.classList.toggle('list-view', state.view === 'list');
    });
  });

  // Quick filter chips at top (tab-bar)
  document.querySelectorAll('#shopQuickFilters .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#shopQuickFilters .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.getAttribute('data-filter') || null;
      state.page = 1;
      render();
    });
  });

  // Mobile filter drawer toggle
  const mobileFilterBtn = document.getElementById('mobileFilterBtn');
  const shopSidebar = document.getElementById('shopSidebar');
  mobileFilterBtn && mobileFilterBtn.addEventListener('click', () => shopSidebar.classList.toggle('open'));

  render();
}

/* ==========================================================================
   PRODUCT DETAIL PAGE (product-detail.html)
   ========================================================================== */
function initProductDetailPage() {
  const wrap = document.getElementById('pdWrap');
  if (!wrap) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 1;
  const p = getProduct(id) || PRODUCTS[0];

  document.title = p.name + ' | VPP Hoàng Linh';
  document.getElementById('pdBreadcrumbCat').textContent = getCategoryName(p.cat);
  document.getElementById('pdBreadcrumbCat').href = `products.html?cat=${p.cat}`;
  document.getElementById('pdBreadcrumbName').textContent = p.name;
  document.getElementById('pdName').textContent = p.name;
  document.getElementById('pdBrand').textContent = p.brand;
  document.getElementById('pdRatingStars').innerHTML = starsHTML(p.rating);
  document.getElementById('pdRatingText').textContent = `${p.rating} (${p.reviews} đánh giá)`;
  document.getElementById('pdPriceNow').textContent = formatVND(p.price);
  const oldPriceEl = document.getElementById('pdPriceOld');
  const saveEl = document.getElementById('pdSave');
  if (p.oldPrice) {
    oldPriceEl.textContent = formatVND(p.oldPrice);
    const pct = Math.round((1 - p.price / p.oldPrice) * 100);
    saveEl.innerHTML = `<span class="badge badge-primary">Tiết kiệm ${pct}%</span>`;
  } else { oldPriceEl.style.display = 'none'; saveEl.innerHTML = `<span class="badge badge-success">Giá tốt mỗi ngày</span>`; }

  const mainImg = document.getElementById('pdMainImage');
  mainImg.innerHTML = `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
  const thumbsWrap = document.getElementById('pdThumbs');
  thumbsWrap.innerHTML = [0, 1, 2, 3].map((i) => `<button class="${i === 0 ? 'active' : ''}" data-i="${i}"><img src="${p.image}" alt="${p.name} - ảnh ${i+1}" loading="lazy"></button>`).join('');
  thumbsWrap.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      thumbsWrap.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mainImg.innerHTML = `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
    });
  });

  // Qty stepper
  const qtyInput = document.getElementById('pdQty');
  document.getElementById('pdQtyMinus').addEventListener('click', () => { qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1); });
  document.getElementById('pdQtyPlus').addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value) + 1; });

  // Add to cart / buy now
  document.getElementById('pdAddToCart').addEventListener('click', () => {
    window.CartStore.add(p.id, parseInt(qtyInput.value), null);
    window.showToast(`Đã thêm ${qtyInput.value} "${p.name}" vào giỏ hàng`, 'success');
  });
  document.getElementById('pdBuyNow').addEventListener('click', () => {
    window.CartStore.add(p.id, parseInt(qtyInput.value), null);
    window.location.href = 'cart.html';
  });
  const pdWishlistBtn = document.getElementById('pdWishlistBtn');
  if (window.WishlistStore.has(p.id)) pdWishlistBtn.classList.add('active');
  pdWishlistBtn.addEventListener('click', () => {
    const added = window.WishlistStore.toggle(p.id);
    pdWishlistBtn.classList.toggle('active', added);
    window.showToast(added ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích', added ? 'success' : null);
  });

  // Tabs
  document.querySelectorAll('.pd-tab-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pd-tab-nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.pd-tab-panel').forEach(pnl => pnl.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.getAttribute('data-tab')).classList.add('active');
    });
  });

  // Related products
  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const relatedTrack = document.getElementById('relatedTrack');
  if (relatedTrack) {
    relatedTrack.innerHTML = (related.length ? related : PRODUCTS.filter(x=>x.id!==p.id).slice(0,4)).map(rp => productCardHTML(rp)).join('');
    renderIcons(relatedTrack);
    bindProductCardEvents(relatedTrack);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initShopPage();
  initProductDetailPage();
});
