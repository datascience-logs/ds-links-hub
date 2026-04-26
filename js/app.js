// Supabase Configuration
const SUPABASE_URL = "https://ezsziemqkrktxurdxqbl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6c3ppZW1xa3JrdHh1cmR4cWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNzg3NjgsImV4cCI6MjA5Mjc1NDc2OH0.pAjwSSdbpRzkqKALgg7q_XFT1-8aHLmp0kEljfy1RV0";

let hubSupabase;

const elements = {
  get container() { return document.getElementById('links-container'); },
  get loading() { return document.getElementById('loading'); },
  get error() { return document.getElementById('error'); },
  get empty() { return document.getElementById('empty'); }
};

// Start initialization on window load
window.addEventListener('load', () => {
    initHub();
});

async function initHub() {
    // 1. Wait for Supabase Library
    let attempts = 0;
    while (!window.supabase && attempts < 50) {
        await new Promise(r => setTimeout(r, 100));
        attempts++;
    }

    if (!window.supabase) {
        showError("Database library failed to load. Please check your connection.");
        return;
    }

    // 2. Initialize Client
    hubSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // 3. Load Links
    fetchLiveLinks();
}

async function fetchLiveLinks() {
    if (elements.loading) elements.loading.style.display = 'flex';
    if (elements.error) elements.error.hidden = true;
    if (elements.empty) elements.empty.hidden = true;

    try {
        const { data: links, error } = await hubSupabase
            .from('links')
            .select('*')
            .order('order', { ascending: true });

        if (error) throw error;

        if (elements.loading) elements.loading.style.display = 'none';

        if (!links || links.length === 0) {
            if (elements.empty) elements.empty.hidden = false;
        } else {
            renderHubLinks(links);
        }
    } catch (err) {
        console.error('Hub Error:', err);
        showError(err.message);
    }
}

function renderHubLinks(links) {
    const list = elements.container;
    
    // Remove existing link buttons
    const items = list.querySelectorAll('.link-btn');
    items.forEach(i => i.remove());

    links.forEach((link, idx) => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = "_blank";
        a.className = "link-btn animate-in";
        a.style.animationDelay = `${idx * 100}ms`;
        
        a.innerHTML = `
            <div class="link-icon">🔗</div>
            <div class="link-text">
                <span class="link-title">${link.title}</span>
            </div>
            <div class="link-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
        `;
        list.appendChild(a);
    });
}

function showError(msg) {
    if (elements.loading) elements.loading.style.display = 'none';
    if (elements.error) {
        elements.error.hidden = false;
        const text = elements.error.querySelector('.error-text');
        if (text) text.innerText = msg;
    }
}

window.loadLinks = fetchLiveLinks; // For retry button