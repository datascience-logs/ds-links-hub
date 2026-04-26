/* 
   ================================================================
   DIARIES HUB - CORE ENGINE (PRO MAX)
   ================================================================
*/

(function() {
    "use strict";

    // 1. UNIQUE CREDENTIALS
    const HUB_API_URL = "https://ezsziemqkrktxurdxqbl.supabase.co";
    const HUB_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6c3ppZW1xa3JrdHh1cmR4cWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNzg3NjgsImV4cCI6MjA5Mjc1NDc2OH0.pAjwSSdbpRzkqKALgg7q_XFT1-8aHLmp0kEljfy1RV0";
    
    let hubClient = null;

    const dom = {
        load: () => document.getElementById('loading'),
        err: () => document.getElementById('error'),
        empty: () => document.getElementById('empty'),
        box: () => document.getElementById('links-container')
    };

    // 2. INITIALIZATION
    async function init() {
        console.log("Hub: Launching system...");
        
        // Wait for library
        let tryCount = 0;
        while (!window.supabase && tryCount < 50) {
            await new Promise(r => setTimeout(r, 100));
            tryCount++;
        }

        if (!window.supabase) {
            showFail("Database library timeout. Please refresh.");
            return;
        }

        try {
            // Use unique client name
            hubClient = window.supabase.createClient(HUB_API_URL, HUB_API_KEY);
            const { data, error } = await hubClient.from('links').select('*').order('order', { ascending: true });
            
            if (error) throw error;
            
            if (dom.load()) dom.load().style.display = 'none';

            if (!data || data.length === 0) {
                if (dom.empty()) dom.empty().hidden = false;
            } else {
                renderAll(data);
            }
        } catch (e) {
            console.error(e);
            showFail(e.message);
        }
    }

    // 3. RENDER ENGINE
    function renderAll(links) {
        const container = dom.box();
        const existing = container.querySelectorAll('.link-btn');
        existing.forEach(e => e.remove());

        links.forEach((l, i) => {
            const btn = document.createElement('a');
            btn.href = l.url;
            btn.target = "_blank";
            btn.className = "link-btn animate-in";
            btn.style.animationDelay = `${i * 100}ms`;
            btn.innerHTML = `
                <div class="link-icon">🔗</div>
                <div class="link-text"><span class="link-title">${l.title}</span></div>
                <div class="link-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            `;
            container.appendChild(btn);
        });
    }

    function showFail(m) {
        if (dom.load()) dom.load().style.display = 'none';
        if (dom.err()) {
            dom.err().hidden = false;
            const msg = dom.err().querySelector('.error-text');
            if (msg) msg.innerText = m;
        }
    }

    // Global hook
    window.addEventListener('load', init);
    window.forceReloadHub = init;
})();