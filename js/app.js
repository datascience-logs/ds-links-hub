/* 
   ================================================================
   DIARIES HUB - CORE ENGINE (DESCRIPTION + SMART SEARCH)
   ================================================================
*/

(function() {
    "use strict";

    const HUB_API_URL = "https://ezsziemqkrktxurdxqbl.supabase.co";
    const HUB_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6c3ppZW1xa3JrdHh1cmR4cWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNzg3NjgsImV4cCI6MjA5Mjc1NDc2OH0.pAjwSSdbpRzkqKALgg7q_XFT1-8aHLmp0kEljfy1RV0";
    
    let hubClient = null;
    let cachedLinks = [];

    const dom = {
        load: () => document.getElementById('loading'),
        err: () => document.getElementById('error'),
        empty: () => document.getElementById('empty'),
        box: () => document.getElementById('links-container'),
        search: () => document.getElementById('hub-search')
    };

    async function init() {
        console.log("Hub: Launching system...");
        
        let tryCount = 0;
        while (!window.supabase && tryCount < 50) {
            await new Promise(r => setTimeout(r, 100));
            tryCount++;
        }

        if (!window.supabase) {
            showFail("Database library timeout.");
            return;
        }

        try {
            hubClient = window.supabase.createClient(HUB_API_URL, HUB_API_KEY);
            const { data, error } = await hubClient.from('links').select('*').order('order', { ascending: true });
            
            if (error) throw error;
            
            cachedLinks = data || [];
            
            if (dom.load()) dom.load().style.display = 'none';

            if (cachedLinks.length === 0) {
                if (dom.empty()) dom.empty().hidden = false;
            } else {
                renderAll(cachedLinks);
            }

            // Setup SMART SEARCH
            if (dom.search()) {
                dom.search().addEventListener('input', (e) => {
                    const q = e.target.value.toLowerCase().trim();
                    if (!q) {
                        renderAll(cachedLinks);
                        return;
                    }
                    
                    const filtered = cachedLinks.filter(l => 
                        (l.title && l.title.toLowerCase().includes(q)) || 
                        (l.code && l.code.toLowerCase().includes(q)) ||
                        (l.description && l.description.toLowerCase().includes(q))
                    );
                    renderAll(filtered);
                });
            }

        } catch (e) {
            console.error(e);
            showFail(e.message);
        }
    }

    function renderAll(links) {
        const container = dom.box();
        const existing = container.querySelectorAll('.link-btn');
        existing.forEach(e => e.remove());

        if (links.length === 0) {
            if (dom.empty()) dom.empty().hidden = false;
        } else {
            if (dom.empty()) dom.empty().hidden = true;
            links.forEach((l, i) => {
                const btn = document.createElement('a');
                btn.href = l.url;
                btn.target = "_blank";
                btn.className = "link-btn animate-in";
                btn.style.animationDelay = `${i * 50}ms`;
                btn.style.display = "flex";
                btn.style.alignItems = "center";
                btn.style.textAlign = "left";
                btn.style.padding = "20px";
                btn.style.borderRadius = "16px";
                
                const badge = l.code ? `<span style="background:var(--orange); color:white; font-size:10px; padding:2px 8px; border-radius:100px; font-weight:800; text-transform:uppercase; margin-bottom:4px; display:inline-block;">${l.code}</span>` : '';
                const desc = l.description ? `<p style="margin:4px 0 0; color:var(--text-dim); font-size:0.85rem; line-height:1.4;">${l.description}</p>` : '';

                btn.innerHTML = `
                    <div class="link-icon" style="background:rgba(255,107,53,0.1); color:var(--orange); width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-right:20px; flex-shrink:0;">🔗</div>
                    <div class="link-text" style="flex:1;">
                        ${badge}
                        <div class="link-title" style="font-weight:700; color:white; font-size:1.05rem;">${l.title}</div>
                        ${desc}
                    </div>
                    <div class="link-arrow" style="margin-left:15px; opacity:0.5;">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                `;
                container.appendChild(btn);
            });
        }
    }

    function showFail(m) {
        if (dom.load()) dom.load().style.display = 'none';
        if (dom.err()) {
            dom.err().hidden = false;
            const msg = dom.err().querySelector('.error-text');
            if (msg) msg.innerText = m;
        }
    }

    window.addEventListener('load', init);
})();