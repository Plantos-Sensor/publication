# GitHub Secrets Setup Guide

This guide shows how to securely store your Supabase credentials using GitHub Secrets.

## Why Use GitHub Secrets?

- **Security**: Credentials are encrypted and never exposed in your code
- **Best Practice**: Keeps sensitive data separate from source code
- **Automatic Injection**: Values are injected during deployment

## Setting Up Supabase

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for setup to complete

### 2. Create Database Tables

In your Supabase SQL Editor, run:

```sql
-- Create email subscriptions table
CREATE TABLE email_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create submissions table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    submission_type VARCHAR(50) NOT NULL CHECK (submission_type IN ('article', 'photography', 'video')),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'accepted', 'rejected')),
    reviewer_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by VARCHAR(255)
);

-- Add indexes
CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);

-- Enable Row Level Security
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access
CREATE POLICY "Allow public email subscription insertion" ON email_subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public submission insertion" ON submissions
    FOR INSERT WITH CHECK (true);
```

### 3. Get Your Credentials

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## Setting Up GitHub Secrets

### 1. Access Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the sidebar, click **Secrets and variables** → **Actions**

### 2. Add Secrets

Click **New repository secret** and add these two secrets:

**Secret 1:**
- **Name**: `SUPABASE_URL`
- **Secret**: Your Supabase Project URL (e.g., `https://abcdefgh.supabase.co`)

**Secret 2:**
- **Name**: `SUPABASE_ANON_KEY`
- **Secret**: Your Supabase anon public key (the long `eyJ...` string)

### 3. Verify Setup

After adding both secrets, you should see:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`

## How It Works

When you push to GitHub:

1. **GitHub Actions runs** the deployment workflow
2. **Secrets are injected** as environment variables during build
3. **Placeholders are replaced** in `script.js` with actual values
4. **Site is deployed** to GitHub Pages with working Supabase connection

## Local Development

For local testing, you can:

1. **Create a `.env` file** (not committed to git):
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Manually replace** the placeholders in `script.js` temporarily

3. **Or use a local server** with environment variable support

## Security Benefits

✅ **Credentials never appear in your code**
✅ **Secrets are encrypted by GitHub**
✅ **Only authorized workflows can access them**
✅ **No risk of accidentally committing sensitive data**

## Testing

After setting up secrets:

1. **Push any change** to trigger deployment
2. **Check Actions tab** to see if deployment succeeds
3. **Visit your GitHub Pages URL** and test the forms
4. **Verify data appears** in your Supabase dashboard

Your site will now securely connect to Supabase using GitHub Secrets!