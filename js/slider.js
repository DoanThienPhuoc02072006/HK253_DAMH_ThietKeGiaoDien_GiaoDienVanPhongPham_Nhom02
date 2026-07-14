/* ==========================================================================
   SLIDER — hero banner slider + product row horizontal scroller
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Hero slider ---- */
  const heroSlider = document.querySelector('.hero-slider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.hero-slide');
    const dotsWrap = heroSlider.querySelector('.hero-dots');
    let current = 0, timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap && dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap ? dotsWrap.querySelectorAll('button') : [];

    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }
    function startAuto() { timer = setInterval(next, 5000); }
    function stopAuto() { clearInterval(timer); }

    heroSlider.querySelector('.hero-arrow.next')?.addEventListener('click', () => { next(); stopAuto(); startAuto(); });
    heroSlider.querySelector('.hero-arrow.prev')?.addEventListener('click', () => { prev(); stopAuto(); startAuto(); });
    heroSlider.addEventListener('mouseenter', stopAuto);
    heroSlider.addEventListener('mouseleave', startAuto);
    startAuto();
  }

  /* ---- Product track horizontal scroller ---- */
  document.querySelectorAll('.product-slider').forEach(slider => {
    const track = slider.querySelector('.product-track');
    const prevBtn = slider.querySelector('.slider-nav .prev');
    const nextBtn = slider.querySelector('.slider-nav .next');
    if (!track) return;
    const scrollAmount = () => track.querySelector('.product-card')?.offsetWidth + 20 || 280;
    prevBtn && prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
    nextBtn && nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  });

  /* ---- Home product tabs (New / Bestseller / Sale) ---- */
  document.querySelectorAll('.tab-bar[data-tabtarget]').forEach(tabBar => {
    const targetId = tabBar.getAttribute('data-tabtarget');
    const track = document.getElementById(targetId);
    if (!track) return;
    tabBar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderProductRow(track, filter);
      });
    });
  });

  function renderProductRow(track, filter) {
    let list = PRODUCTS.slice();
    if (filter === 'new') list = list.filter(p => p.badge === 'Mới');
    else if (filter === 'bestseller') list = list.filter(p => p.badge === 'Bán chạy');
    else if (filter === 'sale') list = list.filter(p => p.oldPrice);
    list = list.slice(0, 8);
    track.innerHTML = list.map(p => productCardHTML(p)).join('');
    renderIcons(track);
    bindProductCardEvents(track);
  }

  // Expose for use by inline home page bootstrap script
  window.renderProductRow = renderProductRow;
})();
