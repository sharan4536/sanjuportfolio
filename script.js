// ===== SANJUKTHA REDDY PORTFOLIO — MAIN SCRIPT (SUPABASE) =====

const SUPABASE_URL = 'https://vhomrhbcowszraavotoz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZob21yaGJjb3dzenJhYXZvdG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjkwMzMsImV4cCI6MjEwMDQwNTAzM30.rhqSvGNPFBxq9XEdTH_piWkl82HzM8arkgiPbOx5LoU';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- FALLBACK DATA (if Supabase is unreachable) ----------
const FALLBACK = {
  site: { heroOverline: "Emerging Artist · India", heroTitleLine1: "Sanjuktha", heroTitleLine2: "Reddy", heroSubtitle: "Exploring the boundaries between colour, emotion, and form — one brushstroke at a time.", footerText: "© 2025 Sanjuktha Reddy. All rights reserved." },
  about: { paragraphs: [], quote: "", image: "" },
  artworks: [],
  education: [],
  achievements: [],
  contact: { email: "", instagram: "", behance: "" }
};

// ---------- FETCH FROM SUPABASE ----------
async function fetchAllData() {
  try {
    const [artRes, aboutRes, eduRes, achRes, siteRes, contactRes] = await Promise.all([
      sb.from('artworks').select('*').order('sort_order'),
      sb.from('about_content').select('*').eq('id', 1).single(),
      sb.from('education').select('*').order('sort_order'),
      sb.from('achievements').select('*').order('sort_order'),
      sb.from('site_settings').select('*').eq('id', 1).single(),
      sb.from('contact_info').select('*').eq('id', 1).single()
    ]);

    return {
      artworks: artRes.data || [],
      about: aboutRes.data ? {
        paragraphs: aboutRes.data.paragraphs || [],
        quote: aboutRes.data.quote || '',
        image: aboutRes.data.image_url || ''
      } : FALLBACK.about,
      education: (eduRes.data || []).map(e => ({
        id: e.id, year: e.year_period, title: e.title, institution: e.institution, description: e.description
      })),
      achievements: (achRes.data || []).map(a => ({
        number: a.number_value, label: a.label
      })),
      site: siteRes.data ? {
        heroOverline: siteRes.data.hero_overline,
        heroTitleLine1: siteRes.data.hero_title_line1,
        heroTitleLine2: siteRes.data.hero_title_line2,
        heroSubtitle: siteRes.data.hero_subtitle,
        footerText: siteRes.data.footer_text
      } : FALLBACK.site,
      contact: contactRes.data ? {
        email: contactRes.data.email,
        instagram: contactRes.data.instagram,
        behance: contactRes.data.behance
      } : FALLBACK.contact
    };
  } catch (err) {
    console.error('Supabase fetch error, using fallback:', err);
    return FALLBACK;
  }
}

// ---------- RENDER ENGINE ----------
async function renderSite() {
  const data = await fetchAllData();

  // Hero
  const heroOverline = document.querySelector('.hero-overline');
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroOverline) heroOverline.textContent = data.site.heroOverline;
  if (heroTitle) heroTitle.innerHTML = `${data.site.heroTitleLine1}<br><em>${data.site.heroTitleLine2}</em>`;
  if (heroSubtitle) heroSubtitle.textContent = data.site.heroSubtitle;

  // Footer
  const footerText = document.querySelector('.footer-text');
  if (footerText) footerText.textContent = data.site.footerText;

  // Featured
  const featured = data.artworks.filter(a => a.featured);
  renderFeatured(featured);

  // Gallery
  renderGallery(data.artworks);

  // About
  renderAbout(data.about);

  // Education
  renderEducation(data.education);

  // Achievements
  renderAchievements(data.achievements);

  // Contact
  renderContact(data.contact);
}

function renderFeatured(artworks) {
  const container = document.getElementById('featuredScroll');
  if (!container) return;
  container.innerHTML = artworks.map((art, i) => `
    <div class="featured-card reveal reveal-delay-${Math.min(i + 1, 4)}">
      <div class="featured-card-img">
        <img src="${art.image_url || art.image}" alt="${art.title}" loading="lazy">
      </div>
      <div class="featured-card-info">
        <div class="featured-card-title">${art.title}</div>
        <div class="featured-card-meta">${art.medium} · ${art.year}</div>
      </div>
    </div>
  `).join('');
}

function renderGallery(artworks) {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const layoutClasses = ['', 'wide', '', '', '', '', '', '', ''];

  grid.innerHTML = artworks.map((art, i) => {
    const cls = layoutClasses[i % layoutClasses.length];
    return `
    <div class="gallery-item ${cls} reveal" data-category="${art.category}" data-title="${art.title}" data-medium="${art.medium}, ${art.year}">
      <img src="${art.image_url || art.image}" alt="${art.title}" loading="lazy">
      <div class="gallery-item-overlay">
        <h4>${art.title}</h4>
        <span>${art.medium} · ${art.year}</span>
      </div>
    </div>`;
  }).join('');

  initLightbox();
  observeRevealElements();
}

function renderAbout(about) {
  const aboutText = document.querySelector('.about-text');
  if (!aboutText) return;

  const aboutImg = document.querySelector('.about-image-frame img');
  if (aboutImg && about.image) aboutImg.src = about.image;

  const paragraphs = about.paragraphs.map(p => `<p class="reveal">${p}</p>`).join('');
  aboutText.innerHTML = `
    <div class="section-overline reveal">About the Artist</div>
    <h2 class="reveal">Sanjuktha Reddy</h2>
    ${paragraphs}
    <div class="about-quote reveal">"${about.quote}"</div>
  `;
}

function renderEducation(education) {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  timeline.innerHTML = education.map(item => `
    <div class="timeline-item reveal">
      <div class="timeline-dot"></div>
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-title">${item.title}</div>
      <div class="timeline-institution">${item.institution}</div>
      <div class="timeline-desc">${item.description}</div>
    </div>
  `).join('');
}

function renderAchievements(achievements) {
  const grid = document.querySelector('.achievements-grid');
  if (!grid) return;
  grid.innerHTML = achievements.map((a, i) => `
    <div class="achievement-card reveal reveal-delay-${i + 1}">
      <div class="achievement-number">${a.number}</div>
      <div class="achievement-label">${a.label}</div>
    </div>
  `).join('');
}

function renderContact(contact) {
  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach(link => {
    link.href = `mailto:${contact.email}`;
    if (link.closest('.contact-email')) link.textContent = contact.email;
  });
  const igLink = document.querySelector('.contact-link[href*="instagram"]');
  if (igLink && contact.instagram) igLink.href = contact.instagram;
  const beLink = document.querySelector('.contact-link[href*="behance"]');
  if (beLink && contact.behance) beLink.href = contact.behance;
}

// ---------- LOADING SCREEN ----------
function initLoading() {
  const screen = document.getElementById('loadingScreen');
  if (!screen) return;
  window.addEventListener('load', () => setTimeout(() => screen.classList.add('hidden'), 800));
  setTimeout(() => screen.classList.add('hidden'), 3000);
}

// ---------- CUSTOM CURSOR ----------
function initCursor() {
  const cursor = document.getElementById('customCursor');
  if (!cursor || window.innerWidth < 768) return;
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  const hoverEls = document.querySelectorAll('a, button:not(.filter-btn), .gallery-item, .featured-card');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
  });
}

// ---------- HEADER SCROLL ----------
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  });
}

// ---------- MOBILE MENU ----------
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!toggle || !mobileNav) return;
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ---------- GALLERY FILTERS ----------
function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('galleryGrid');
  if (!btns.length || !grid) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      grid.querySelectorAll('.gallery-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// ---------- LIGHTBOX ----------
let lightboxItems = [];
let lightboxIndex = 0;

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbMedium = document.getElementById('lightboxMedium');
  if (!lightbox) return;

  lightboxItems = Array.from(document.querySelectorAll('.gallery-item'));
  lightboxItems.forEach((item, i) => {
    item.addEventListener('click', () => { lightboxIndex = i; openLightbox(item); });
  });

  function openLightbox(item) {
    lbImg.src = item.querySelector('img').src;
    lbImg.alt = item.dataset.title;
    lbTitle.textContent = item.dataset.title;
    lbMedium.textContent = item.dataset.medium;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.getElementById('lightboxPrev').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    openLightbox(lightboxItems[lightboxIndex]);
  });
  document.getElementById('lightboxNext').addEventListener('click', () => {
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    openLightbox(lightboxItems[lightboxIndex]);
  });
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lightboxPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lightboxNext').click();
  });
}

// ---------- FEATURED DRAG SCROLL ----------
function initFeaturedScroll() {
  const el = document.getElementById('featuredScroll');
  if (!el) return;
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; });
  el.addEventListener('mouseleave', () => isDown = false);
  el.addEventListener('mouseup', () => isDown = false);
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5;
  });
}

// ---------- SCROLL REVEAL ----------
function observeRevealElements() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));
}

// ---------- SMOOTH SCROLL ----------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
  initLoading();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  renderSite().then(() => {
    initCursor();
    initFilters();
    initFeaturedScroll();
    observeRevealElements();
  });
});
