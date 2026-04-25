/*
  File: js/app.js
  Purpose: Public view - fetches and renders links from data/links.json
*/

// Configuration
const CONFIG = {
  dataUrl: 'data/links.json',
  animationDelay: 80 // ms between each link animation
};

// DOM Elements
const linksContainer = document.getElementById('links-container');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const emptyEl = document.getElementById('empty');

// Icon mapping with SVG paths
const iconMap = {
  'github': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
  'twitter': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>',
  'x': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>',
  'instagram': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
  'youtube': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
  'linkedin': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
  'discord': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/><path d="M15 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/><path d="M7.5 7.5c2.5-.5 5-.5 7.5 0"/><path d="M7.5 16.5c2.5-.5 5-.5 7.5 0"/><path d="M15 18a1 1 0 0 0 1-1 4 4 0 0 0-4-4h-1"/><path d="M9 18a1 1 0 0 1-1-1 4 4 0 0 1 4-4h1"/></svg>',
  'email': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  'mail': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  'blog': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  'portfolio': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'project': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
  'website': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  'default': '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>'
};

// Get icon based on link object properties
function getLinkIcon(link) {
  const { url, title, icon } = link;
  
  // 1. If an explicit icon was chosen in the CMS, use it
  if (icon && iconMap[icon]) return iconMap[icon];

  const urlLower = (url || '').toLowerCase();
  const titleLower = (title || '').toLowerCase();

  // Check URL patterns first
  if (urlLower.includes('github.com') || urlLower.includes('github.io') || urlLower.includes('github')) return iconMap['github'];
  if (urlLower.includes('twitter.com') || urlLower.includes('x.com') || urlLower.includes('twitter') || urlLower.includes('x/')) return iconMap['x'];
  if (urlLower.includes('instagram.com') || urlLower.includes('instagram')) return iconMap['instagram'];
  if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be') || urlLower.includes('youtube')) return iconMap['youtube'];
  if (urlLower.includes('linkedin.com') || urlLower.includes('linkedin')) return iconMap['linkedin'];
  if (urlLower.includes('discord') || urlLower.includes('discord.gg')) return iconMap['discord'];
  if (urlLower.includes('mailto:') || urlLower.includes('email')) return iconMap['email'];
  if (urlLower.includes('medium.com') || urlLower.includes('dev.to') || urlLower.includes('blog')) return iconMap['blog'];
  if (urlLower.includes('portfolio') || urlLower.includes('portfoli')) return iconMap['portfolio'];

  // Check title keywords
  if (titleLower.includes('github') || titleLower.includes('repo') || titleLower.includes('repository')) return iconMap['github'];
  if (titleLower.includes('twitter') || titleLower.includes('x.com') || titleLower.includes('tweet')) return iconMap['x'];
  if (titleLower.includes('instagram') || titleLower.includes('insta')) return iconMap['instagram'];
  if (titleLower.includes('youtube') || titleLower.includes('video')) return iconMap['youtube'];
  if (titleLower.includes('linkedin') || titleLower.includes('profile')) return iconMap['linkedin'];
  if (titleLower.includes('discord') || titleLower.includes('community')) return iconMap['discord'];
  if (titleLower.includes('email') || titleLower.includes('mail') || titleLower.includes('contact')) return iconMap['email'];
  if (titleLower.includes('blog') || titleLower.includes('article') || titleLower.includes('post')) return iconMap['blog'];
  if (titleLower.includes('portfolio')) return iconMap['portfolio'];
  if (titleLower.includes('project')) return iconMap['project'];
  if (titleLower.includes('website') || titleLower.includes('site')) return iconMap['website'];

  return iconMap['default'];
}

// Create link button element
function createLinkElement(link, index) {
  const btn = document.createElement('a');
  btn.href = link.url;
  btn.target = '_blank';
  btn.rel = 'noopener noreferrer';
  btn.className = 'link-btn animate-in';
  btn.style.animationDelay = `${(index + 1) * CONFIG.animationDelay}ms`;

  const icon = getLinkIcon(link);

  btn.innerHTML = `
    <div class="link-icon" aria-hidden="true">${icon}</div>
    <div class="link-content">
      <div class="link-title">${escapeHtml(link.title)}</div>
      ${link.description ? `<div class="link-description">${escapeHtml(link.description)}</div>` : ''}
    </div>
    <div class="link-arrow" aria-hidden="true">→</div>
  `;

  return btn;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render links
function renderLinks(links) {
  // Clear container
  linksContainer.innerHTML = '';

  if (!links || links.length === 0) {
    emptyEl.hidden = false;
    linksContainer.appendChild(emptyEl);
    return;
  }

  // Sort by order and filter active
  const activeLinks = links
    .filter(link => link.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (activeLinks.length === 0) {
    emptyEl.hidden = false;
    linksContainer.appendChild(emptyEl);
    return;
  }

  // Create and append link elements
  activeLinks.forEach((link, index) => {
    const linkEl = createLinkElement(link, index);
    linksContainer.appendChild(linkEl);
  });
}

// Show error state
function showError() {
  linksContainer.innerHTML = '';
  errorEl.hidden = false;
  linksContainer.appendChild(errorEl);
}

// Fetch links from JSON
async function loadLinks() {
  // Show loading
  loadingEl.hidden = false;
  errorEl.hidden = true;
  emptyEl.hidden = true;
  linksContainer.innerHTML = '';
  linksContainer.appendChild(loadingEl);

  try {
    const response = await fetch(CONFIG.dataUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Support both direct array and wrapped object structure
    const links = Array.isArray(data) ? data : (data.links || []);
    renderLinks(links);

  } catch (error) {
    console.error('Error loading links:', error);
    showError();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', loadLinks);