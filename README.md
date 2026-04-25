# Syntrotech Link Hub

A self-hosted Linktree alternative powered by Decap CMS and GitHub Pages.

## Features

- **Public Hub**: Clean, mobile-first link display
- **Admin Panel**: Decap CMS for managing links
- **GitHub Backend**: All data stored in your GitHub repository
- **100% Anonymous**: No personal information required
- **Secure**: Input validation, XSS prevention, GitHub OAuth

## File Structure

```
/
├── index.html          # Public hub
├── admin/
│   ├── index.html      # Decap CMS entry
│   └── config.yml     # CMS configuration
├── data/
│   └── links.json     # Link data source
├── css/
│   └── style.css      # Global styles
├── js/
│   └── app.js         # Public view logic
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── README.md
```

## Quick Deploy

### 1. Create GitHub Repository

1. Create a new repository on GitHub
2. Clone locally or use GitHub's web editor
3. Copy all files to the repository

### 2. Enable GitHub Pages

1. Go to Repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` (or `master`)
4. Save

### 3. Set Up Decap CMS (GitHub OAuth)

#### Option A: Using Decap CMS App (Easiest)

1. Go to [decapcms.org](https://decapcms.org)
2. Click "Add to your repository"
3. Follow the OAuth installation steps

#### Option B: Manual GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Syntrotech Link Hub
   - **Homepage URL**: `https://links.datascience.logs`
   - **Authorization callback URL**: `https://api.decapcms.org/oauth/github/callback`
4. Copy the Client ID
5. Generate a Client Secret
6. Add these to your repository secrets (Settings → Secrets):
   - `OAUTH_CLIENT_ID`: Your client ID
   - `OAUTH_CLIENT_SECRET`: Your client secret

#### Update config.yml

Edit `admin/config.yml` with your repo details:

```yaml
backend:
  name: git-gateway
  branch: main
  base_url: https://your-oauth-proxy-url  # Optional: for production
```

### 4. Configure Repository Access

1. Go to Repository Settings → Collaborators
2. Add yourself (or trusted users) with admin access
3. Only collaborators can access the admin panel

### 5. Test the Deployment

1. Visit `https://links.datascience.logs` - should show public hub
2. Visit `https://links.datascience.logs/admin/` - should show login
3. Log in with GitHub - should show Decap CMS dashboard

## Managing Links

### Adding a New Link

1. Go to `/admin/`
2. Click "New Link"
3. Fill in:
   - **Title**: Link name
   - **URL**: Full URL (must start with http:// or https://)
   - **Description**: Optional short description
   - **Active**: Toggle on/off
   - **Order**: Number for sorting (1, 2, 3...)
4. Click "Publish"

### Editing Links

1. Go to `/admin/`
2. Click on a link to edit
3. Make changes
4. Click "Publish" or "Save"

### Reordering Links

1. Go to `/admin/`
2. Change the "Order" number for each link
3. Reorder is automatic based on order value

## Customization

### Changing Site Name/Branding

Edit `index.html`:
```html
<span class="logo-text">syntro<span>tech</span></span>
```

### Updating Profile

Edit `index.html`:
```html
<div class="profile-image">S</div>
<h1 class="profile-name">Syntrotech</h1>
<p class="profile-bio">Your bio text here</p>
```

### Changing Colors

Edit `css/style.css`:
```css
:root {
  --orange: #FF6B35;
  --navy: #0A1929;
  /* etc */
}
```

### Adding More Links

Edit `data/links.json`:
```json
{
  "title": "New Link",
  "url": "https://example.com",
  "description": "Description here",
  "isActive": true,
  "order": 9
}
```

## Security Notes

- Admin panel is restricted to repository collaborators only
- URL validation prevents invalid links
- Input sanitization prevents XSS attacks
- No personal data is stored in the repository

## Troubleshooting

### "Unable to load links" error

- Check that `data/links.json` exists in your repository
- Verify GitHub Pages is enabled
- Check browser console for network errors

### Can't access admin panel

- Ensure you're a repository collaborator
- Check OAuth app settings are correct
- Verify the callback URL matches

### Changes not appearing

- Wait 1-2 minutes for GitHub Pages to rebuild
- Clear browser cache
- Check that link has `isActive: true`

## License

MIT License - Feel free to use and modify!