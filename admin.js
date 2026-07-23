// ===== CMS ADMIN PANEL — SUPABASE-POWERED =====

const SUPABASE_URL = 'https://vhomrhbcowszraavotoz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZob21yaGJjb3dzenJhYXZvdG96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4MjkwMzMsImV4cCI6MjEwMDQwNTAzM30.rhqSvGNPFBxq9XEdTH_piWkl82HzM8arkgiPbOx5LoU';

const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- AUTH ----------
const SESSION_KEY = 'sanjuktha_cms_session';

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

async function loginUser(username, password) {
  const { data, error } = await sb
    .from('admin_users')
    .select('id')
    .eq('username', username)
    .eq('password', password)
    .single();

  if (error || !data) return false;
  sessionStorage.setItem(SESSION_KEY, 'true');
  return true;
}

function logoutUser() {
  sessionStorage.removeItem(SESSION_KEY);
  location.reload();
}

// ---------- TOAST ----------
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  toast.innerHTML = `<span class="toast-icon">${icons[type] || 'ℹ'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.classList.add('fade-out'); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ---------- INIT AUTH UI ----------
function initAuth() {
  const loginScreen = document.getElementById('loginScreen');
  const adminLayout = document.getElementById('adminLayout');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');

  document.getElementById('logoutBtn').addEventListener('click', logoutUser);

  if (isLoggedIn()) {
    loginScreen.style.display = 'none';
    adminLayout.classList.add('active');
    loadDashboard();
    return;
  }

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = loginForm.querySelector('.login-btn');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    const ok = await loginUser(username, password);
    if (ok) {
      loginScreen.style.display = 'none';
      adminLayout.classList.add('active');
      loadDashboard();
      // Re-attach the logout handler inside the newly active layout if needed
      // (but it is already attached above, so it will work fine)
    } else {
      loginError.classList.add('show');
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  });
}

// ---------- SIDEBAR NAVIGATION ----------
function initSidebar() {
  const links = document.querySelectorAll('.sidebar-link');
  const pages = document.querySelectorAll('.admin-page');

  links.forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page;
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      pages.forEach(p => p.classList.remove('active'));
      document.getElementById(`page-${page}`).classList.add('active');

      const loaders = {
        'dashboard': loadDashboard, 'artworks': loadArtworks, 'about': loadAbout,
        'education': loadEducation, 'achievements': loadAchievements,
        'site-settings': loadSiteSettings, 'contact': loadContact
      };
      if (loaders[page]) loaders[page]();

      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarOverlay').classList.remove('open');
    });
  });

  document.getElementById('mobileSidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
  });
  document.getElementById('sidebarOverlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
  });
}

// ===================================================================
// DASHBOARD
// ===================================================================
async function loadDashboard() {
  const { data: artworks } = await sb.from('artworks').select('*').order('sort_order');
  const { data: edu } = await sb.from('education').select('id');
  const arts = artworks || [];

  const paintings = arts.filter(a => a.category === 'painting').length;
  const drawings = arts.filter(a => a.category === 'drawing').length;
  const featured = arts.filter(a => a.featured).length;

  document.getElementById('dashboardStats').innerHTML = `
    <div class="dash-card">
      <div class="dash-card-icon purple"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg></div>
      <div class="dash-card-number">${arts.length}</div>
      <div class="dash-card-label">Total Artworks</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-icon green"><svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg></div>
      <div class="dash-card-number">${paintings}</div>
      <div class="dash-card-label">Paintings</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-icon amber"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
      <div class="dash-card-number">${drawings}</div>
      <div class="dash-card-label">Drawings</div>
    </div>
    <div class="dash-card">
      <div class="dash-card-icon red"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
      <div class="dash-card-number">${featured}</div>
      <div class="dash-card-label">Featured</div>
    </div>
  `;

  // Recent artworks list
  const recent = arts.slice(0, 5);
  let html = `<div class="items-list-header"><div class="items-list-title">Recent Artworks</div><span class="items-list-count">${arts.length} total</span></div>`;
  recent.forEach(art => { html += buildArtworkRow(art, false); });
  document.getElementById('recentArtworksList').innerHTML = html;
}

function buildArtworkRow(art, showActions = true) {
  const badges = [
    `<span class="item-badge ${art.category}">${art.category}</span>`,
    art.featured ? '<span class="item-badge featured">★ Featured</span>' : ''
  ].filter(Boolean).join(' ');

  const actions = showActions ? `
    <div class="item-actions">
      <button class="item-action-btn edit-artwork-btn" data-id="${art.id}" title="Edit">
        <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
      </button>
      <button class="item-action-btn delete delete-artwork-btn" data-id="${art.id}" title="Delete">
        <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
      </button>
    </div>` : '';

  return `
    <div class="item-row">
      <div class="item-thumb"><img src="${art.image_url}" alt="${art.title}" onerror="this.style.background='var(--admin-bg-hover)'"></div>
      <div class="item-info"><div class="item-title">${art.title}</div><div class="item-meta">${art.medium} · ${art.year}</div></div>
      ${badges} ${actions}
    </div>`;
}

// ===================================================================
// ARTWORKS CRUD
// ===================================================================
let artworksCache = [];

async function loadArtworks() {
  const { data } = await sb.from('artworks').select('*').order('sort_order');
  artworksCache = data || [];
  const list = document.getElementById('artworksList');

  if (!artworksCache.length) {
    list.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><p>No artworks yet.</p><button class="btn btn-primary btn-sm" onclick="openArtworkModal()">Add Artwork</button></div>`;
    return;
  }

  let html = `<div class="items-list-header"><div class="items-list-title">All Artworks</div><span class="items-list-count">${artworksCache.length}</span></div>`;
  artworksCache.forEach(art => { html += buildArtworkRow(art, true); });
  list.innerHTML = html;

  list.querySelectorAll('.edit-artwork-btn').forEach(btn => btn.addEventListener('click', () => openArtworkModal(btn.dataset.id)));
  list.querySelectorAll('.delete-artwork-btn').forEach(btn => btn.addEventListener('click', () => deleteArtwork(btn.dataset.id)));
}

function openArtworkModal(editId = null) {
  document.getElementById('artTitle').value = '';
  document.getElementById('artMedium').value = '';
  document.getElementById('artYear').value = '';
  document.getElementById('artCategory').value = 'painting';
  document.getElementById('artImagePath').value = '';
  document.getElementById('artFeatured').checked = false;
  document.getElementById('artEditId').value = '';
  document.getElementById('artImagePreview').style.display = 'none';

  if (editId) {
    document.getElementById('artworkModalTitle').textContent = 'Edit Artwork';
    const art = artworksCache.find(a => a.id === editId);
    if (art) {
      document.getElementById('artTitle').value = art.title;
      document.getElementById('artMedium').value = art.medium;
      document.getElementById('artYear').value = art.year;
      document.getElementById('artCategory').value = art.category;
      document.getElementById('artImagePath').value = art.image_url;
      document.getElementById('artFeatured').checked = art.featured;
      document.getElementById('artEditId').value = editId;
      if (art.image_url) {
        document.getElementById('artImagePreviewImg').src = art.image_url;
        document.getElementById('artImagePreview').style.display = 'inline-block';
      }
    }
  } else {
    document.getElementById('artworkModalTitle').textContent = 'Add Artwork';
  }
  document.getElementById('artworkModal').classList.add('open');
}

async function saveArtwork() {
  const editId = document.getElementById('artEditId').value;
  const row = {
    title: document.getElementById('artTitle').value.trim(),
    medium: document.getElementById('artMedium').value.trim(),
    year: document.getElementById('artYear').value.trim(),
    category: document.getElementById('artCategory').value,
    image_url: document.getElementById('artImagePath').value.trim(),
    featured: document.getElementById('artFeatured').checked
  };

  if (!row.title) { showToast('Please enter a title.', 'error'); return; }

  if (editId) {
    const { error } = await sb.from('artworks').update(row).eq('id', editId);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
  } else {
    row.sort_order = artworksCache.length + 1;
    const { error } = await sb.from('artworks').insert(row);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
  }

  showToast(editId ? 'Artwork updated!' : 'Artwork added!', 'success');
  document.getElementById('artworkModal').classList.remove('open');
  loadArtworks();
}

async function deleteArtwork(id) {
  if (!confirm('Delete this artwork?')) return;
  const { error } = await sb.from('artworks').delete().eq('id', id);
  if (error) { showToast('Error: ' + error.message, 'error'); return; }
  showToast('Artwork deleted.', 'info');
  loadArtworks();
}

// ===================================================================
// ABOUT PAGE
// ===================================================================
async function loadAbout() {
  const { data } = await sb.from('about_content').select('*').eq('id', 1).single();
  if (!data) return;

  const container = document.getElementById('aboutParagraphs');
  container.innerHTML = '';
  const paras = data.paragraphs || [];

  paras.forEach((p, i) => {
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
      <label class="form-label">Paragraph ${i + 1}</label>
      <textarea class="form-textarea about-para" rows="3">${p}</textarea>
      ${paras.length > 1 ? `<button type="button" class="btn btn-danger btn-sm remove-para-btn" style="margin-top:6px;" data-index="${i}">Remove</button>` : ''}
    `;
    container.appendChild(div);
  });

  container.querySelectorAll('.remove-para-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      paras.splice(parseInt(btn.dataset.index), 1);
      await sb.from('about_content').update({ paragraphs: paras }).eq('id', 1);
      showToast('Paragraph removed.', 'info');
      loadAbout();
    });
  });

  document.getElementById('aboutQuote').value = data.quote || '';
  document.getElementById('aboutImage').value = data.image_url || '';

  if (data.image_url) {
    document.getElementById('aboutImagePreviewImg').src = data.image_url;
    document.getElementById('aboutImagePreview').style.display = 'inline-block';
  } else {
    document.getElementById('aboutImagePreview').style.display = 'none';
  }
}

async function saveAbout() {
  const paragraphs = Array.from(document.querySelectorAll('.about-para')).map(ta => ta.value.trim()).filter(Boolean);
  const quote = document.getElementById('aboutQuote').value.trim();
  const image_url = document.getElementById('aboutImage').value.trim();

  const { error } = await sb.from('about_content').update({ paragraphs, quote, image_url }).eq('id', 1);
  if (error) { showToast('Error: ' + error.message, 'error'); return; }
  showToast('About section saved!', 'success');
}

// ===================================================================
// EDUCATION CRUD
// ===================================================================
let educationCache = [];

async function loadEducation() {
  const { data } = await sb.from('education').select('*').order('sort_order');
  educationCache = data || [];
  const list = document.getElementById('educationList');

  if (!educationCache.length) {
    list.innerHTML = `<div class="empty-state"><svg viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"/></svg><p>No education entries yet.</p><button class="btn btn-primary btn-sm" onclick="openEducationModal()">Add Entry</button></div>`;
    return;
  }

  let html = `<div class="items-list-header"><div class="items-list-title">Timeline Entries</div><span class="items-list-count">${educationCache.length}</span></div>`;
  educationCache.forEach(item => {
    html += `
      <div class="item-row">
        <div class="item-info"><div class="item-title">${item.title}</div><div class="item-meta">${item.institution || ''} · ${item.year_period}</div></div>
        <div class="item-actions">
          <button class="item-action-btn edit-edu-btn" data-id="${item.id}" title="Edit"><svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
          <button class="item-action-btn delete delete-edu-btn" data-id="${item.id}" title="Delete"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>
        </div>
      </div>`;
  });
  list.innerHTML = html;

  list.querySelectorAll('.edit-edu-btn').forEach(btn => btn.addEventListener('click', () => openEducationModal(btn.dataset.id)));
  list.querySelectorAll('.delete-edu-btn').forEach(btn => btn.addEventListener('click', () => deleteEducation(btn.dataset.id)));
}

function openEducationModal(editId = null) {
  document.getElementById('eduYear').value = '';
  document.getElementById('eduTitle').value = '';
  document.getElementById('eduInstitution').value = '';
  document.getElementById('eduDescription').value = '';
  document.getElementById('eduEditId').value = '';

  if (editId) {
    document.getElementById('educationModalTitle').textContent = 'Edit Education Entry';
    const item = educationCache.find(e => e.id === editId);
    if (item) {
      document.getElementById('eduYear').value = item.year_period;
      document.getElementById('eduTitle').value = item.title;
      document.getElementById('eduInstitution').value = item.institution;
      document.getElementById('eduDescription').value = item.description;
      document.getElementById('eduEditId').value = editId;
    }
  } else {
    document.getElementById('educationModalTitle').textContent = 'Add Education Entry';
  }
  document.getElementById('educationModal').classList.add('open');
}

async function saveEducation() {
  const editId = document.getElementById('eduEditId').value;
  const row = {
    year_period: document.getElementById('eduYear').value.trim(),
    title: document.getElementById('eduTitle').value.trim(),
    institution: document.getElementById('eduInstitution').value.trim(),
    description: document.getElementById('eduDescription').value.trim()
  };

  if (!row.title || !row.year_period) { showToast('Please fill year and title.', 'error'); return; }

  if (editId) {
    const { error } = await sb.from('education').update(row).eq('id', editId);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
  } else {
    row.sort_order = educationCache.length + 1;
    const { error } = await sb.from('education').insert(row);
    if (error) { showToast('Error: ' + error.message, 'error'); return; }
  }

  showToast(editId ? 'Entry updated!' : 'Entry added!', 'success');
  document.getElementById('educationModal').classList.remove('open');
  loadEducation();
}

async function deleteEducation(id) {
  if (!confirm('Delete this entry?')) return;
  const { error } = await sb.from('education').delete().eq('id', id);
  if (error) { showToast('Error: ' + error.message, 'error'); return; }
  showToast('Entry deleted.', 'info');
  loadEducation();
}

// ===================================================================
// ACHIEVEMENTS
// ===================================================================
async function loadAchievements() {
  const { data } = await sb.from('achievements').select('*').order('sort_order');
  const achievements = data || [];
  const container = document.getElementById('achievementsCards');
  container.innerHTML = '';

  achievements.forEach((a, i) => {
    const card = document.createElement('div');
    card.className = 'form-card';
    card.innerHTML = `
      <div class="form-card-title" style="justify-content:space-between;">
        Achievement ${i + 1}
        ${achievements.length > 1 ? `<button type="button" class="btn btn-danger btn-sm remove-achievement-btn" data-id="${a.id}">Remove</button>` : ''}
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Number / Value</label><input type="text" class="form-input achievement-number" data-id="${a.id}" value="${a.number_value}" placeholder="e.g. 50+"></div>
        <div class="form-group"><label class="form-label">Label</label><input type="text" class="form-input achievement-label" data-id="${a.id}" value="${a.label}" placeholder="e.g. Artworks Created"></div>
      </div>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.remove-achievement-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      await sb.from('achievements').delete().eq('id', btn.dataset.id);
      showToast('Achievement removed.', 'info');
      loadAchievements();
    });
  });
}

async function saveAchievements() {
  const numbers = document.querySelectorAll('.achievement-number');
  const labels = document.querySelectorAll('.achievement-label');

  for (let i = 0; i < numbers.length; i++) {
    const id = numbers[i].dataset.id;
    const number_value = numbers[i].value.trim();
    const label = labels[i]?.value.trim();
    if (id && number_value && label) {
      await sb.from('achievements').update({ number_value, label }).eq('id', id);
    }
  }
  showToast('Achievements saved!', 'success');
}

// ===================================================================
// SITE SETTINGS
// ===================================================================
async function loadSiteSettings() {
  const { data } = await sb.from('site_settings').select('*').eq('id', 1).single();
  if (!data) return;
  document.getElementById('siteHeroOverline').value = data.hero_overline || '';
  document.getElementById('siteHeroLine1').value = data.hero_title_line1 || '';
  document.getElementById('siteHeroLine2').value = data.hero_title_line2 || '';
  document.getElementById('siteHeroSubtitle').value = data.hero_subtitle || '';
  document.getElementById('siteFooterText').value = data.footer_text || '';
}

async function saveSiteSettings() {
  const row = {
    hero_overline: document.getElementById('siteHeroOverline').value.trim(),
    hero_title_line1: document.getElementById('siteHeroLine1').value.trim(),
    hero_title_line2: document.getElementById('siteHeroLine2').value.trim(),
    hero_subtitle: document.getElementById('siteHeroSubtitle').value.trim(),
    footer_text: document.getElementById('siteFooterText').value.trim()
  };
  const { error } = await sb.from('site_settings').update(row).eq('id', 1);
  if (error) { showToast('Error: ' + error.message, 'error'); return; }
  showToast('Site settings saved!', 'success');
}

// ===================================================================
// CONTACT
// ===================================================================
async function loadContact() {
  const { data } = await sb.from('contact_info').select('*').eq('id', 1).single();
  if (!data) return;
  document.getElementById('contactEmail').value = data.email || '';
  document.getElementById('contactInstagram').value = data.instagram || '';
  document.getElementById('contactBehance').value = data.behance || '';
}

async function saveContact() {
  const row = {
    email: document.getElementById('contactEmail').value.trim(),
    instagram: document.getElementById('contactInstagram').value.trim(),
    behance: document.getElementById('contactBehance').value.trim()
  };
  const { error } = await sb.from('contact_info').update(row).eq('id', 1);
  if (error) { showToast('Error: ' + error.message, 'error'); return; }
  showToast('Contact info saved!', 'success');
}

// ===================================================================
// EXPORT / IMPORT / RESET
// ===================================================================
async function exportData() {
  const [art, about, edu, ach, site, contact] = await Promise.all([
    sb.from('artworks').select('*').order('sort_order'),
    sb.from('about_content').select('*').eq('id', 1).single(),
    sb.from('education').select('*').order('sort_order'),
    sb.from('achievements').select('*').order('sort_order'),
    sb.from('site_settings').select('*').eq('id', 1).single(),
    sb.from('contact_info').select('*').eq('id', 1).single()
  ]);

  const backup = {
    artworks: art.data, about: about.data, education: edu.data,
    achievements: ach.data, site_settings: site.data, contact: contact.data,
    exported_at: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sanjuktha-portfolio-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported!', 'success');
}

async function importData(file) {
  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.artworks) { showToast('Invalid backup file.', 'error'); return; }

      // Clear and re-insert
      if (data.artworks) {
        await sb.from('artworks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await sb.from('artworks').insert(data.artworks);
      }
      if (data.education) {
        await sb.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await sb.from('education').insert(data.education);
      }
      if (data.achievements) {
        await sb.from('achievements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await sb.from('achievements').insert(data.achievements);
      }
      if (data.about) await sb.from('about_content').upsert(data.about);
      if (data.site_settings) await sb.from('site_settings').upsert(data.site_settings);
      if (data.contact) await sb.from('contact_info').upsert(data.contact);

      showToast('Data imported!', 'success');
      loadDashboard();
    } catch (err) {
      showToast('Import failed: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// ===================================================================
// IMAGE UPLOAD HELPERS
// ===================================================================
function setupImageUpload(fileInputId, pathInputId, previewId, previewImgId, removeId) {
  const fileInput = document.getElementById(fileInputId);
  const pathInput = document.getElementById(pathInputId);
  const preview = document.getElementById(previewId);
  const previewImg = document.getElementById(previewImgId);
  const removeBtn = document.getElementById(removeId);

  if (!fileInput) return;

  // Handle Google Drive links pasted in the text field
  if (pathInput) {
    pathInput.addEventListener('blur', e => {
      const url = e.target.value.trim();
      if (!url) return;
      
      let fileId = null;
      const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      
      if (match1 && match1[1]) {
        fileId = match1[1];
      } else if (match2 && match2[1]) {
        fileId = match2[1];
      }

      if (fileId) {
        // Use the thumbnail endpoint which is much less likely to be blocked by Google's anti-hotlinking rules
        const converted = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
        e.target.value = converted;
        previewImg.src = converted;
        preview.style.display = 'inline-block';
        showToast('Google Drive link converted for web use.', 'info');
      } else if (url.startsWith('http')) {
        previewImg.src = url;
        preview.style.display = 'inline-block';
      }
    });
  }

  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('Image must be under 5MB.', 'error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      pathInput.value = ev.target.result;
      previewImg.src = ev.target.result;
      preview.style.display = 'inline-block';
    };
    reader.readAsDataURL(file);
  });

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      pathInput.value = '';
      preview.style.display = 'none';
      fileInput.value = '';
    });
  }
}

// ===================================================================
// INIT
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initSidebar();

  // Artwork modal
  document.getElementById('addArtworkBtn').addEventListener('click', () => openArtworkModal());
  document.getElementById('artworkSaveBtn').addEventListener('click', saveArtwork);
  document.getElementById('artworkCancelBtn').addEventListener('click', () => document.getElementById('artworkModal').classList.remove('open'));
  document.getElementById('artworkModalClose').addEventListener('click', () => document.getElementById('artworkModal').classList.remove('open'));

  // Education modal
  document.getElementById('addEducationBtn').addEventListener('click', () => openEducationModal());
  document.getElementById('educationSaveBtn').addEventListener('click', saveEducation);
  document.getElementById('educationCancelBtn').addEventListener('click', () => document.getElementById('educationModal').classList.remove('open'));
  document.getElementById('educationModalClose').addEventListener('click', () => document.getElementById('educationModal').classList.remove('open'));

  // Forms
  document.getElementById('aboutForm').addEventListener('submit', e => { e.preventDefault(); saveAbout(); });
  document.getElementById('addParagraphBtn').addEventListener('click', async () => {
    const { data } = await sb.from('about_content').select('paragraphs').eq('id', 1).single();
    const paras = data?.paragraphs || [];
    paras.push('');
    await sb.from('about_content').update({ paragraphs: paras }).eq('id', 1);
    loadAbout();
  });

  document.getElementById('achievementsForm').addEventListener('submit', e => { e.preventDefault(); saveAchievements(); });
  document.getElementById('addAchievementBtn').addEventListener('click', async () => {
    await sb.from('achievements').insert({ number_value: '0', label: 'New Achievement', sort_order: 99 });
    loadAchievements();
  });

  document.getElementById('siteSettingsForm').addEventListener('submit', e => { e.preventDefault(); saveSiteSettings(); });
  document.getElementById('contactForm').addEventListener('submit', e => { e.preventDefault(); saveContact(); });

  // Export / Import
  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('importDataBtn').addEventListener('click', () => document.getElementById('importFileInput').click());
  document.getElementById('importFileInput').addEventListener('change', e => { if (e.target.files[0]) importData(e.target.files[0]); });
  document.getElementById('resetDataBtn').addEventListener('click', () => {
    showToast('To reset, re-run the SQL setup in Supabase SQL Editor.', 'info');
  });

  // Image uploads
  setupImageUpload('artImageFile', 'artImagePath', 'artImagePreview', 'artImagePreviewImg', 'artImageRemove');
  setupImageUpload('aboutImageFile', 'aboutImage', 'aboutImagePreview', 'aboutImagePreviewImg', 'aboutImageRemove');

  // Modal overlay close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });
});
