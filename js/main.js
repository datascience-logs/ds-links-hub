/**
 * File: js/main.js
 * Purpose: Main interactivity for Data Science Logs
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initResourceFilters();
    initContactForm();
    initSmoothScroll();
});

/**
 * Mobile Navigation Toggle
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon animation (if target class added in CSS)
            mobileMenuBtn.classList.toggle('open');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

/**
 * Resource Filtering Logic (resources.html)
 */
function initResourceFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const resourceCards = document.querySelectorAll('.resource-card');

    if (filterButtons.length > 0 && resourceCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                resourceCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.hidden = false;
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transition = 'opacity 0.3s ease';
                        }, 10);
                    } else {
                        card.hidden = true;
                    }
                });
            });
        });
    }
}

/**
 * Contact Form UX
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            // Since we are using an external action (Formspree), 
            // we can intercept to show a loading state if desired.
            // For this demo, let's just log and let the default action proceed
            // or use fetch for a better SPA experience.
            
            console.log('Form submission intercepted for demo/validation.');
            
            // Note: In production, you'd use fetch() to post to Formspree
            // to keep the user on the page.
        });
    }
}

/**
 * Smooth internal links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
