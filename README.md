# Plantos Magazine Website

A magazine announcement website with email collection and submission forms, backed by PostgreSQL database.

## Features

- **Email Newsletter Signup**: Collect email addresses for updates
- **Submission Forms**: Accept articles, photography, and video submissions with file uploads
- **PostgreSQL Integration**: All data stored in a PostgreSQL database
- **Automated Deployment**: GitHub Actions for CI/CD

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Visit the application:**
   Open http://localhost:3000 in your browser

## Database Setup

The application connects to a PostgreSQL database with the following tables:

- `newsletter_emails`: Stores email subscriptions
- `submissions`: Stores form submissions with file references

## GitHub Actions Deployment

The application uses GitHub Actions for automated deployment to your server.

### Required GitHub Secrets

To enable automatic deployment, add these secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `SERVER_HOST` | `192.168.1.12` | Your server IP address |
| `SERVER_USER` | `pi` | SSH username |
| `SERVER_PASSWORD` | `plants` | SSH password |

### Deployment Process

The GitHub Actions workflow:

1. **Build Stage**: Tests the application on Node.js 18.x and 20.x
2. **Deploy Stage**: 
   - Connects to your server via SSH
   - Pulls the latest code
   - Installs dependencies
   - Starts/restarts the application using PM2

### Manual Deployment

To deploy manually to your server:

```bash
# SSH into your server
ssh pi@192.168.1.12

# Navigate to application directory
cd /home/pi/magazine-website

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --only=production

# Restart the application
pm2 restart plantos-magazine
```

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **File Upload**: Multer
- **Process Management**: PM2
- **CI/CD**: GitHub Actions

## File Structure

```
magazine-website/
├── server.js              # Express server
├── index.html             # Main webpage
├── script.js              # Frontend JavaScript
├── styles.css             # Styling
├── package.json           # Dependencies
├── uploads/               # File upload directory
└── .github/workflows/     # GitHub Actions
    └── deploy.yml         # Deployment workflow
```