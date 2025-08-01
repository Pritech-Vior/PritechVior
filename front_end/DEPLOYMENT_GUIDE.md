# Deployment Guide for cPanel

## Steps to Deploy to cPanel:

### 1. Build the Project
```bash
npm run build
```

### 2. Upload Files
- Upload all contents of the `dist/` folder to your cPanel's `public_html` directory
- Make sure the `.htaccess` file is included in the upload

### 3. cPanel Configuration
If you're still getting 404 errors, try these steps:

#### Option A: Use the main .htaccess file
The current `.htaccess` file should work. If not, try the alternative version.

#### Option B: Use the alternative .htaccess
1. Delete the current `.htaccess` file
2. Rename `.htaccess.alternative` to `.htaccess`

#### Option C: Manual cPanel Setup
1. Go to cPanel → File Manager
2. Navigate to `public_html`
3. Create a new file called `.htaccess`
4. Add this content:
```
RewriteEngine On
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### 4. Test the Routes
After deployment, test these URLs:
- https://pritechvior.co.tz/
- https://pritechvior.co.tz/thinkforge
- https://pritechvior.co.tz/projects
- https://pritechvior.co.tz/archive
- https://pritechvior.co.tz/contact

### 5. Troubleshooting
If routes still don't work:

1. **Check File Permissions**: Make sure `.htaccess` has 644 permissions
2. **Check cPanel Error Logs**: Look for any Apache errors
3. **Contact Hosting Provider**: Some hosts disable mod_rewrite
4. **Alternative Solution**: Use HashRouter instead of BrowserRouter (less SEO friendly but always works)

### 6. HashRouter Alternative (if needed)
If nothing else works, we can switch to HashRouter:
- URLs will look like: https://pritechvior.co.tz/#/thinkforge
- This always works but is less SEO friendly

## Files Included for Deployment:
- `.htaccess` - Main Apache configuration
- `.htaccess.alternative` - Alternative configuration
- `_redirects` - Netlify/Vercel style redirects (backup)

## Important Notes:
- The website is fully responsive and optimized
- All pages have proper SEO metadata
- Real project data and software archive included
- Search and filter functionality on Projects and Archive pages
- Professional contact information updated
