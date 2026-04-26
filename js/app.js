// Supabase Configuration
const SUPABASE_URL = "https://ezsziemqkrktxurdxqbl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6c3ppZW1xa3JrdHh1cmR4cWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNzg3NjgsImV4cCI6MjA5Mjc1NDc2OH0.pAjwSSdbpRzkqKALgg7q_XFT1-8aHLmp0kEljfy1RV0";

// Global instance
let di_supabase;

const CONFIG = {
  animationDelay: 100
};

// UI Elements
const elements = {
  get container() { return document.getElementById('links-container'); },
  get loading() { return document.getElementById('loading'); },
  get error() { return document.getElementById('error'); },
  get empty() { return document.getElementById('empty'); }
};

// Icons map
const iconMap = {
  'github': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
  'instagram': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  'youtube': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.12 1 12 1 12s0 3.88.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.88 23 12 23 12s0-3.88-.46-5.58z"/><polyline points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>',
  'blog': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  'default': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
};

function getLinkIcon(link) {
  if (link.icon && iconMap[link.icon]) return iconMap[link.icon];
  return iconMap['default'];
}

async function loadLinks() {
  if (!di_supabase) {
    if (window.supabase) {
      di_supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } else {
      setTimeout(loadLinks, 100);
      return;
    }
  }

  elements.loading.style.display = 'flex';
  if (elements.error) elements.error.hidden = true;
  if (elements.empty) elements.empty.hidden = true;

  try {
    const { data: links, error } = await di_supabase
      .from('links')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;

    elements.loading.style.display = 'none';

    if (!links || links.length === 0) {
      if (elements.empty) elements.empty.hidden = false;
    } else {
      renderLinks(links);
    }
  } catch (err) {
    console.error('Failed to load links:', err);
    elements.loading.style.display = 'none';
    if (elements.error) elements.error.hidden = false;
  }
}

function renderLinks(links) {
  // Clear any existing links except loading/empty/error states
  const children = Array.from(elements.container.children);
  children.forEach(child => {
    if (!['loading', 'error', 'empty'].includes(child.id)) {
      child.remove();
    }
  });

  links.forEach((link, index) => {
    const btn = document.createElement('a');
    btn.href = link.url;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.className = 'link-btn animate-in';
    btn.style.animationDelay = `${(index + 1) * CONFIG.animationDelay}ms`;

    const icon = getLinkIcon(link);

    btn.innerHTML = `
      <div class="link-icon" aria-hidden="true">${icon}</div>
      <div class="link-text">
        <span class="link-title">${link.title}</span>
      </div>
      <div class="link-arrow" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    `;

    elements.container.appendChild(btn);
  });
}

// Start
window.addEventListener('load', loadLinks);
window.loadLinks = loadLinks; // For retry button