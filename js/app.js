/* 
   ================================================================
   DIARIES HUB - CORE ENGINE (SEARCH ENABLED)
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
            showFail("Library timeout.");
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

            // Setup Search
            if (dom.search()) {
                dom.search().addEventListener('input', (e) => {
                    const q = e.target.value.toLowerCase().trim();
                    const filtered = cachedLinks.filter(l => 
                        l.title.toLowerCase().includes(q) || 
                        (l.code && l.code.toLowerCase().includes(q))
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
                
                const badge = l.code ? `<span style="background:var(--orange); color:white; font-size:10px; padding:2px 6px; border-radius:4px; margin-left:8px; font-weight:800;">${l.code}</span>` : '';

                btn.innerHTML = `
                    <div class="link-icon">🔗</div>
                    <div class="link-text">
                        <span class="link-title">${l.title} ${badge}</span>
                    </div>
                    <div class="link-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
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