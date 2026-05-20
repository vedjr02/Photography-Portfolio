const PHOTOS = [
  { id: 1, file: '1.jpg', category: 'landscape', title: 'Golden Horizon' },
  { id: 2, file: '2.jpg', category: 'nature', title: 'Quiet Forest' },
  { id: 3, file: '3.jpg', category: 'landscape', title: 'Open Sky' },
  { id: 4, file: '4.jpg', category: 'street', title: 'City Pulse' },
  { id: 5, file: '5.jpg', category: 'portrait', title: 'Still Moment' },
  { id: 6, file: '6.jpg', category: 'landscape', title: 'Distant Peaks' },
  { id: 7, file: '7.jpg', category: 'nature', title: 'Wild Light' },
  { id: 8, file: '8.jpg', category: 'street', title: 'Urban Frame' },
  { id: 9, file: '9.jpg', category: 'landscape', title: 'Evening Glow' },
  { id: 10, file: '10.jpg', category: 'portrait', title: 'Soft Focus' },
  { id: 11, file: '11.jpg', category: 'nature', title: 'Green Depth' },
  { id: 12, file: '12.jpg', category: 'landscape', title: 'Wide Open' },
  { id: 13, file: '13.jpg', category: 'street', title: 'Crosswalk' },
  { id: 14, file: '14.jpg', category: 'nature', title: 'Morning Mist' },
  { id: 15, file: '15.jpg', category: 'portrait', title: 'In Profile' },
  { id: 16, file: '16.jpg', category: 'landscape', title: 'Coastal Line' },
  { id: 17, file: '17.jpg', category: 'street', title: 'Neon Hour' },
  { id: 18, file: '18.jpg', category: 'nature', title: 'Canopy' },
  { id: 19, file: '19.jpg', category: 'landscape', title: 'Last Light' },
  { id: 20, file: '20.jpg', category: 'portrait', title: 'Unposed' },
  { id: 21, file: '21.jpg', category: 'street', title: 'Alleyway' },
  { id: 22, file: '22.jpg', category: 'nature', title: 'River Bend' },
  { id: 23, file: '23.jpg', category: 'landscape', title: 'Highlands' },
  { id: 24, file: '24.JPG', category: 'street', title: 'Passing By' },
  { id: 25, file: '25.JPG', category: 'portrait', title: 'Gaze' },
  { id: 26, file: '26.jpg', category: 'nature', title: 'Fern Light' },
  { id: 27, file: '27.jpg', category: 'landscape', title: 'Valley View' },
  { id: 28, file: '28.jpg', category: 'street', title: 'Market Day' },
  { id: 29, file: '29.jpg', category: 'nature', title: 'Tide Pool' },
  { id: 30, file: '30.jpg', category: 'portrait', title: 'Shadow Play' },
  { id: 31, file: '31.jpg', category: 'landscape', title: 'Blue Hour' },
  { id: 32, file: '32.jpg', category: 'street', title: 'Reflections' },
  { id: 33, file: '33.jpg', category: 'nature', title: 'Autumn Path' },
  { id: 34, file: '34.jpg', category: 'landscape', title: 'Horizon Line' },
  { id: 35, file: '35.jpg', category: 'portrait', title: 'Natural Light' },
];

const BASE = '/images/photography';
const THUMB_BASE = '/images/photography/thumbnails';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
let currentFilter = 'all';
let visiblePhotos = [...PHOTOS];
let lightboxIndex = 0;
let galleryObserver = null;

const loader = document.getElementById('loader');
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const galleryGrid = document.getElementById('galleryGrid');
const galleryCount = document.getElementById('galleryCount');
const filters = document.getElementById('filters');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const copyEmail = document.getElementById('copyEmail');
const featuredTrack = document.getElementById('featuredTrack');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxLoader = document.getElementById('lightboxLoader');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxTitle = document.getElementById('lightboxTitle');
const heroImg = document.querySelector('.hero-img');

function thumbSrc(file) {
  return `${THUMB_BASE}/${file.replace(/\.JPG$/i, '.jpg')}`;
}

function fullSrc(file) {
  return `${BASE}/${file}`;
}

function scrollTo(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.4, ...options });
  } else if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: 'smooth' });
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function hideLoader() {
  const finish = () => {
    loader.classList.add('hidden');
    if (heroImg) heroImg.classList.add('animated');
  };
  window.addEventListener('load', () => setTimeout(finish, 500));
  setTimeout(finish, 2200);
}

function initLenis() {
  if (REDUCED_MOTION || typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', onScroll);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function getScrollY() {
  return lenis ? lenis.scroll : window.scrollY;
}

function onScroll() {
  const scrollY = getScrollY();
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

  scrollProgress.style.width = `${progress}%`;
  header.classList.toggle('scrolled', scrollY > 60);
  backToTop.classList.toggle('visible', scrollY > 600);
  backToTop.hidden = scrollY <= 600;

  updateParallax(scrollY);
  updateActiveNav();
}

function initParallax() {
  if (REDUCED_MOTION) return;
  updateParallax(getScrollY());
}

function updateParallax(scrollY) {
  if (REDUCED_MOTION) return;

  document.querySelectorAll('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax);
    const rect = el.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewCenter = window.innerHeight / 2;
    const offset = (center - viewCenter) * speed;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });

  if (featuredTrack) {
    const strip = featuredTrack.closest('.featured-strip');
    if (!strip) return;
    const rect = strip.getBoundingClientRect();
    const progress = 1 - (rect.bottom / (window.innerHeight + rect.height));
    const clamped = Math.max(0, Math.min(1, progress));
    featuredTrack.style.transform = `translate3d(${(clamped - 0.5) * -80}px, 0, 0)`;

    featuredTrack.querySelectorAll('[data-parallax-speed]').forEach((item, i) => {
      const speed = parseFloat(item.dataset.parallaxSpeed) || 0.1;
      const y = (clamped - 0.5) * speed * window.innerHeight * 0.4;
      item.style.transform = `translate3d(0, ${y + i * 8}px, 0)`;
    });
  }
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.gallery-item)');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  reveals.forEach((el) => observer.observe(el));
}

function initGalleryReveal() {
  if (galleryObserver) galleryObserver.disconnect();

  galleryObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = (entry.target.dataset.revealIndex || 0) * 70;
          setTimeout(() => entry.target.classList.add('in-view'), delay);
          galleryObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  galleryGrid.querySelectorAll('.gallery-item').forEach((item) => {
    galleryObserver.observe(item);
  });
}

function initHeader() {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
    if (lenis) {
      open ? lenis.stop() : lenis.start();
    } else {
      document.body.classList.toggle('no-scroll', open);
    }
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href?.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      if (lenis) lenis.start();
      scrollTo(target, { offset: -72 });
    });
  });
}

function updateActiveNav() {
  const sections = ['gallery', 'about', 'contact'];
  const scrollY = getScrollY() + 120;

  let current = '';
  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section && section.offsetTop <= scrollY) current = id;
  });

  navLinks.querySelectorAll('a[data-section]').forEach((link) => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

function updateGalleryCount() {
  const count = visiblePhotos.length;
  galleryCount.textContent = `${count} photo${count !== 1 ? 's' : ''}`;
}

function renderGallery() {
  galleryGrid.innerHTML = '';

  visiblePhotos.forEach((photo, index) => {
    const item = document.createElement('article');
    item.className = 'gallery-item';
    item.dataset.index = index;
    item.dataset.revealIndex = index % 6;
    item.dataset.category = photo.category;

    const img = document.createElement('img');
    img.src = thumbSrc(photo.file);
    img.alt = photo.title;
    img.loading = 'lazy';
    img.onerror = () => { img.src = fullSrc(photo.file); };

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item-overlay';
    overlay.innerHTML = `<div class="gallery-item-info"><span>${photo.category}</span>${photo.title}</div>`;

    item.appendChild(img);
    item.appendChild(overlay);
    item.addEventListener('click', () => openLightbox(index));
    galleryGrid.appendChild(item);
  });

  updateGalleryCount();
  if (REDUCED_MOTION) {
    galleryGrid.querySelectorAll('.gallery-item').forEach((item) => item.classList.add('in-view'));
  } else {
    requestAnimationFrame(() => initGalleryReveal());
  }
}

function initFilters() {
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filters.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    currentFilter = btn.dataset.filter;
    visiblePhotos = currentFilter === 'all'
      ? [...PHOTOS]
      : PHOTOS.filter((p) => p.category === currentFilter);

    renderGallery();
  });
}

function openLightbox(index) {
  lightboxIndex = index;
  lightbox.removeAttribute('hidden');
  if (lenis) lenis.stop();
  requestAnimationFrame(() => lightbox.classList.add('open'));
  document.body.classList.add('no-scroll');
  loadLightboxImage();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.classList.remove('no-scroll');
  if (lenis) lenis.start();
  setTimeout(() => {
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
    lightboxImg.classList.remove('loaded');
  }, 400);
}

function loadLightboxImage() {
  const photo = visiblePhotos[lightboxIndex];
  lightboxLoader.classList.remove('hidden');
  lightboxImg.classList.remove('loaded');

  const img = new Image();
  img.onload = () => {
    lightboxImg.src = fullSrc(photo.file);
    lightboxImg.alt = photo.title;
    lightboxImg.classList.add('loaded');
    lightboxLoader.classList.add('hidden');
  };
  img.onerror = () => lightboxLoader.classList.add('hidden');
  img.src = fullSrc(photo.file);

  lightboxTitle.textContent = photo.title;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${visiblePhotos.length}`;
  lightboxCategory.textContent = photo.category;
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + visiblePhotos.length) % visiblePhotos.length;
  loadLightboxImage();
}

function initLightbox() {
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
  lightboxNext.addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) navigateLightbox(diff > 0 ? -1 : 1);
  }, { passive: true });
}

function initBackToTop() {
  backToTop.addEventListener('click', () => scrollTo(0));
}

function initCopyEmail() {
  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('vedjr02@gmail.com');
      copyEmail.textContent = 'Copied';
      copyEmail.classList.add('copied');
      setTimeout(() => {
        copyEmail.textContent = 'Copy';
        copyEmail.classList.remove('copied');
      }, 2000);
    } catch {
      copyEmail.textContent = 'Failed';
      setTimeout(() => { copyEmail.textContent = 'Copy'; }, 2000);
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.closest('.nav-links')) return;
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      scrollTo(target, { offset: -72 });
    });
  });
}

function initFallbackScroll() {
  if (lenis) return;
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

hideLoader();
initLenis();
initFallbackScroll();
initParallax();
initHeader();
initScrollReveal();
initFilters();
initLightbox();
initBackToTop();
initCopyEmail();
initSmoothScroll();
renderGallery();
