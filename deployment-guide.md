# Deployment Guide

This guide will help you deploy your magazine website to GitHub Pages with automatic CI/CD.

## Prerequisites

1. A GitHub account
2. Git installed on your local machine
3. Your Supabase project set up (see `supabase-setup.md`)

## Step 1: Update Supabase Configuration

Before deploying, update the Supabase configuration in `script.js`:

```javascript
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-public-key';
```

## Step 2: Create GitHub Repository

1. Go to GitHub and create a new repository
2. Name it something like `magazine-website` or your magazine name
3. Don't initialize with README (since you already have files)

## Step 3: Connect Local Repository to GitHub

Run these commands in your project directory:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: Magazine website with Supabase integration"

# Add GitHub remote (replace with your repository URL)
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to GitHub
git push -u origin main
```

## Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. The workflow is already configured in `.github/workflows/deploy.yml`

## Step 5: Verify Deployment

1. Go to the **Actions** tab in your repository
2. You should see a workflow run triggered by your push
3. Wait for it to complete (green checkmark)
4. Your site will be available at: `https://yourusername.github.io/your-repo-name`

## Automatic Deployments

The GitHub Actions workflow is configured to automatically deploy your site whenever you:
- Push changes to the `main` branch
- The workflow will:
  1. Check out your code
  2. Set up the deployment environment
  3. Upload your static files
  4. Deploy to GitHub Pages

## Making Updates

To update your website:

1. Make changes to your files locally
2. Test them by opening `index.html` in your browser
3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update: description of your changes"
   git push
   ```
4. GitHub Actions will automatically deploy the changes

## Troubleshooting

### If deployment fails:
1. Check the Actions tab for error messages
2. Ensure all files are properly committed
3. Verify that GitHub Pages is enabled in repository settings

### If Supabase integration isn't working:
1. Check browser console for errors
2. Verify your Supabase URL and key are correct
3. Ensure your Supabase tables are set up correctly
4. Check that RLS policies allow public access for inserts

### Custom Domain (Optional)
If you want to use a custom domain:
1. Add a `CNAME` file to your repository root with your domain
2. Configure DNS settings with your domain provider
3. Enable HTTPS in GitHub Pages settings

## File Structure

Your deployed site will include:
- `index.html` - Main landing page
- `styles.css` - Styling
- `script.js` - JavaScript functionality with Supabase integration
- `uploads/` - Any uploaded files (if present)

## Security Notes

- Never commit sensitive credentials to your repository
- Use environment variables for sensitive data in production
- The anon key is safe to expose in client-side code (it's designed for this)
- Supabase RLS policies protect your data even with public keys

Your magazine website is now live and will automatically update whenever you push changes to GitHub!