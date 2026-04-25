# Data Science Logs (@datascience.logs)

A production-ready static website for an anonymous data science learning brand. Built with semantic HTML5, vanilla CSS, and JavaScript.

## 🚀 Deployment to GitHub Pages

This site is optimized for **GitHub Pages**. To host it, follow these steps:

### 1. Push to GitHub
Initialize a git repository, add your files, and push to a new GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/datascience-logs.git
git push -u origin main
```

### 2. Enable Hosting
1. Go to your repository settings on GitHub.
2. Select **Pages** from the left sidebar.
3. Under **Build and deployment**, set Source to **Deploy from a branch**.
4. Select the `main` branch and `/ (root)` folder. Click **Save**.
5. Your site will be live at `https://YOUR_USERNAME.github.io/datascience-logs/`.

## 📁 Project Structure
- `index.html`: Home hub with brand intro and quick stats.
- `resources.html`: Filterable grid of curated DS tools and courses.
- `logs.html`: Chronological learning entries and experiment documentation.
- `contact.html`: Anonymous contact form via Formspree/EmailJS.
- `css/styles.css`: Modular design system using CSS variables.
- `js/main.js`: Vanilla JS for navigation, filtering, and smooth scrolling.
- `assets/`: Directory for logos, site icons, and OG images.

## 🎨 Design System
- **Navy:** `#0A1929` (Primary text/background)
- **Orange:** `#FF6B35` (Accent/CTA)
- **Blue:** `#004E89` (Links/Headers)
- **White:** `#FFFFFF`
- **Gray Light:** `#F5F7FA` (Section backgrounds)

## 🔒 Privacy & SEO
- **100% Anonymous:** No personal bios or identifying information.
- **Accessible:** WCAG 2.1 AA compliant contrast and semantic tags.
- **SEO Optimized:** Meta tags for Open Graph, Twitter, and canonical URLs.
- **Robots/Sitemap:** Fully structured for search engine indexing.

---
*Created by Antigravity for @datascience.logs*
