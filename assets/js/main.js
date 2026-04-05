// Cookbook theme — main.js

// ── Scroll lock ──────────────────────────────────────────────
// Reference-counted so lightbox and mobile nav don't fight each other.
var _scrollLocks = 0;
function lockScroll() {
  if (++_scrollLocks === 1) document.body.style.overflow = 'hidden';
}
function unlockScroll() {
  if (--_scrollLocks <= 0) { _scrollLocks = 0; document.body.style.overflow = ''; }
}

// ── Focus trap ───────────────────────────────────────────────
// Returns { activate, deactivate } for a given container element.
function makeFocusTrap(el) {
  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  function nodes() { return Array.from(el.querySelectorAll(FOCUSABLE)); }
  function handler(e) {
    if (e.key !== 'Tab') return;
    var list = nodes();
    if (!list.length) return;
    var idx = list.indexOf(document.activeElement);
    if (e.shiftKey) {
      if (idx <= 0) { e.preventDefault(); list[list.length - 1].focus(); }
    } else {
      if (idx === list.length - 1) { e.preventDefault(); list[0].focus(); }
    }
  }
  return {
    activate:   function () { el.addEventListener('keydown', handler); var list = nodes(); if (list.length) list[0].focus(); },
    deactivate: function () { el.removeEventListener('keydown', handler); }
  };
}

// ── Mobile nav ───────────────────────────────────────────────
(function () {
  var btn      = document.querySelector('.nav-hamburger');
  var nav      = document.getElementById('mobile-nav');
  var backdrop = document.querySelector('.mobile-nav__backdrop');
  var closeBtn = document.querySelector('.mobile-nav__close');
  if (!btn || !nav) return;

  var trap = makeFocusTrap(nav);

  function openNav() {
    nav.classList.add('is-open');
    backdrop.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    nav.removeAttribute('aria-hidden');
    lockScroll();
    trap.activate();
  }

  function closeNav() {
    nav.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    unlockScroll();
    trap.deactivate();
    btn.focus();
  }

  btn.addEventListener('click', openNav);
  closeBtn.addEventListener('click', closeNav);
  backdrop.addEventListener('click', closeNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav();
  });
}());

// ── Gallery lightbox ─────────────────────────────────────────
(function () {
  const galleries = document.querySelectorAll('.recipe-gallery');
  if (!galleries.length) return;

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

  const lb       = overlay.querySelector('.lb');
  const img      = overlay.querySelector('.lb__img');
  const counter  = overlay.querySelector('.lb__counter');
  const btnClose = overlay.querySelector('.lb__close');
  const btnPrev  = overlay.querySelector('.lb__prev');
  const btnNext  = overlay.querySelector('.lb__next');

  let images  = [];
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
    lockScroll();
  }

  function close() {
    overlay.classList.remove('lb-visible');
    unlockScroll();
    overlay.addEventListener('transitionend', () => {
      overlay.style.display = 'none';
    }, { once: true });
  }

  galleries.forEach(gallery => {
    const links = gallery.querySelectorAll('a');
    links.forEach((link, idx) => {
      link.addEventListener('click', e => { e.preventDefault(); open(links, idx); });
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => show(current + 1));

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('lb-visible')) return;
    if (e.key === 'Escape')    close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}());

// ── Carousel ─────────────────────────────────────────────────
(function () {
  var track   = document.querySelector('.carousel-track');
  var prevBtn = document.querySelector('.carousel-btn--prev');
  var nextBtn = document.querySelector('.carousel-btn--next');
  if (!track || !prevBtn || !nextBtn) return;

  function updateButtons() {
    var scrollLeft = track.scrollLeft;
    var maxScroll  = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = scrollLeft <= 5;
    nextBtn.disabled = scrollLeft >= maxScroll - 5;
  }

  nextBtn.addEventListener('click', function () {
    track.scrollBy({ left: track.clientWidth * 0.75, behavior: 'smooth' });
  });
  prevBtn.addEventListener('click', function () {
    track.scrollBy({ left: -track.clientWidth * 0.75, behavior: 'smooth' });
  });
  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  updateButtons();
}());

// ── Recipe filter ────────────────────────────────────────────
(function () {
  var checkboxes = document.querySelectorAll('.filter-checkbox');
  if (!checkboxes.length) return;

  function filter() {
    var activeCourses = Array.from(document.querySelectorAll('input[name="course"]:checked')).map(function (cb) { return cb.value; });
    var activeEths    = Array.from(document.querySelectorAll('input[name="ethnicity"]:checked')).map(function (cb) { return cb.value; });

    document.querySelectorAll('.category-group').forEach(function (cat) {
      var hasVisible = false;
      cat.querySelectorAll('.recipe-item').forEach(function (item) {
        var courseMatch = !activeCourses.length || activeCourses.includes(item.dataset.course);
        var ethMatch    = !activeEths.length    || activeEths.includes(item.dataset.ethnicity);
        var show        = courseMatch && ethMatch;
        item.style.display = show ? 'flex' : 'none';
        if (show) hasVisible = true;
      });
      cat.style.display = hasVisible ? 'block' : 'none';
    });
  }

  checkboxes.forEach(function (cb) { cb.addEventListener('change', filter); });
}());
