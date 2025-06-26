# Supabase Database Setup

Follow these steps to set up your Supabase database for the magazine website:

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click "New Project"
3. Choose your organization and enter project details
4. Wait for the project to be created

## 2. Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run these commands:

### Email Subscriptions Table
```sql
CREATE TABLE email_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Add index for better performance
CREATE INDEX idx_email_subscriptions_email ON email_subscriptions(email);
```

### Submissions Table
```sql
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

-- Add indexes for better performance
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
```

## 3. Set Up Row Level Security (RLS)

### Enable RLS on both tables:
```sql
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
```

### Create policies for email subscriptions:
```sql
-- Allow anyone to insert email subscriptions
CREATE POLICY "Allow public email subscription insertion" ON email_subscriptions
    FOR INSERT WITH CHECK (true);

-- Allow reading own email subscription (optional)
CREATE POLICY "Allow reading email subscriptions" ON email_subscriptions
    FOR SELECT USING (true);
```

### Create policies for submissions:
```sql
-- Allow anyone to insert submissions
CREATE POLICY "Allow public submission insertion" ON submissions
    FOR INSERT WITH CHECK (true);

-- Only authenticated users can read submissions (for admin panel)
CREATE POLICY "Allow authenticated users to read submissions" ON submissions
    FOR SELECT USING (auth.role() = 'authenticated');
```

## 4. Get Your Project Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy your Project URL and anon public key
3. Update the JavaScript file with your credentials:

```javascript
const SUPABASE_URL = 'your-project-url-here';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## 5. Optional: Set Up Email Notifications

You can set up database functions to send email notifications when new submissions are received:

```sql
-- Create a function to send email notifications (requires Supabase Edge Functions)
CREATE OR REPLACE FUNCTION notify_new_submission()
RETURNS TRIGGER AS $$
BEGIN
    -- This would integrate with your email service
    -- For now, it just logs the submission
    RAISE NOTICE 'New submission received: % by %', NEW.title, NEW.author_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER on_submission_created
    AFTER INSERT ON submissions
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_submission();
```

## 6. Test Your Setup

After updating your credentials in the JavaScript file, test:
1. Subscribe to the newsletter
2. Submit a test article/photo/video
3. Check your Supabase dashboard to verify data is being stored

Your database is now ready to collect email subscriptions and submissions!