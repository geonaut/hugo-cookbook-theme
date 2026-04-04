// Cookbook theme

// ── Active nav link ──────────────────────────────────────────
document.querySelectorAll('.top-app-bar__nav > li > a').forEach(link => {
  if (link.pathname === window.location.pathname ||
      (link.pathname !== '/' && window.location.pathname.startsWith(link.pathname))) {
    link.setAttribute('aria-current', 'page');
  }
});

// ── Gallery lightbox ─────────────────────────────────────────
(function () {
  const galleries = document.querySelectorAll('.recipe-gallery');
  if (!galleries.length) return;

  // Build overlay once
  const overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Image viewer');
  overlay.innerHTML = `
    <div class="lb" tabindex="-1">
      <button class="lb__btn lb__close" aria-label="Close">close</button>
      <div class="lb__img-wrap">
        <img class="lb__img" src="" alt="">
      </div>
      <div class="lb__bar">
        <button class="lb__btn lb__prev" aria-label="Previous image">arrow_back</button>
        <span class="lb__counter"></span>
        <button class="lb__btn lb__next" aria-label="Next image">arrow_forward</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.style.display = 'none';

  const lb        = overlay.querySelector('.lb');
  const img       = overlay.querySelector('.lb__img');
  const counter   = overlay.querySelector('.lb__counter');
  const btnClose  = overlay.querySelector('.lb__close');
  const btnPrev   = overlay.querySelector('.lb__prev');
  const btnNext   = overlay.querySelector('.lb__next');

  let images = [];
  let current = 0;

  function show(idx) {
    current = (idx + images.length) % images.length;
    img.src = images[current].src;
    img.alt = images[current].alt;
    counter.textContent = `${current + 1} / ${images.length}`;
    btnPrev.style.visibility = images.length < 2 ? 'hidden' : '';
    btnNext.style.visibility = images.length < 2 ? 'hidden' : '';
  }

  function open(galleryLinks, startIdx) {
    images = Array.from(galleryLinks).map(a => ({
      src: a.href,
      alt: a.querySelector('img')?.alt || '',
    }));
    show(startIdx);
    overlay.classList.add('lb-visible');
    overlay.style.display = 'flex';
    lb.focus();
    document.body.style.overflow = 'hidden';
  }

  function close() {
    overlay.classList.remove('lb-visible');
    document.body.style.overflow = '';
    // wait for fade before hiding
    overlay.addEventListener('transitionend', () => {
      overlay.style.display = 'none';
    }, { once: true });
  }

  // Wire up each gallery
  galleries.forEach(gallery => {
    const links = gallery.querySelectorAll('a');
    links.forEach((link, idx) => {
      link.addEventListener('click', e => {
        e.preventDefault();
        open(links, idx);
      });
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));

  // Click outside the lightbox panel to close
  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  // Keyboard
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('lb-visible')) return;
    if (e.key === 'Escape')      close();
    if (e.key === 'ArrowLeft')   show(current - 1);
    if (e.key === 'ArrowRight')  show(current + 1);
  });
})();
