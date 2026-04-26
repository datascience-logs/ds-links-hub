// Supabase Credentials
const S_URL = "https://ezsziemqkrktxurdxqbl.supabase.co";
const S_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6c3ppZW1xa3JrdHh1cmR4cWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNzg3NjgsImV4cCI6MjA5Mjc1NDc2OH0.pAjwSSdbpRzkqKALgg7q_XFT1-8aHLmp0kEljfy1RV0";

// Robust Launcher
(function() {
    let client;
    const elements = {
        loading: () => document.getElementById('loading'),
        error: () => document.getElementById('error'),
        empty: () => document.getElementById('empty'),
        container: () => document.getElementById('links-container')
    };

    async function start() {
        console.log("Hub: Launching system...");
        
        // Wait for Supabase
        let timer = 0;
        while (!window.supabase && timer < 40) {
            await new Promise(r => setTimeout(r, 100));
            timer++;
        }

        if (!window.supabase) {
            fail("Database library failed to load. Check your internet.");
            return;
        }

        try {
            client = window.supabase.createClient(S_URL, S_KEY);
            const { data: links, error } = await client.from('links').select('*').order('order', { ascending: true });
            
            if (error) throw error;
            
            if (elements.loading()) elements.loading().style.display = 'none';

            if (!links || links.length === 0) {
                if (elements.empty()) elements.empty().hidden = false;
            } else {
                render(links);
            }
        } catch (e) {
            console.error(e);
            fail(e.message);
        }
    }

    function render(links) {
        const cont = elements.container();
        // Remove only previous buttons
        const old = cont.querySelectorAll('.link-btn');
        old.forEach(o => o.remove());

        links.forEach((l, i) => {
            const a = document.createElement('a');
            a.href = l.url;
            a.target = "_blank";
            a.className = "link-btn animate-in";
            a.style.animationDelay = `${i * 100}ms`;
            a.innerHTML = `
                <div class="link-icon">🔗</div>
                <div class="link-text"><span class="link-title">${l.title}</span></div>
                <div class="link-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            `;
            cont.appendChild(a);
        });
    }

    function fail(msg) {
        if (elements.loading()) elements.loading().style.display = 'none';
        if (elements.error()) {
            elements.error().hidden = false;
            const t = elements.error().querySelector('.error-text');
            if (t) t.innerText = msg;
        }
    }

    window.addEventListener('load', start);
    window.loadLinks = start; // For retry button
})();