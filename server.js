require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || '192.168.1.12',
  database: process.env.DB_NAME || 'plantos_magazine',
  password: process.env.DB_PASSWORD || 'postgres123',
  port: process.env.DB_PORT || 5432,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Email subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO newsletter_emails (email) VALUES ($1) RETURNING id',
      [email]
    );
    
    res.json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    if (error.code === '23505') { // Unique constraint violation
      res.status(400).json({ error: 'This email is already subscribed!' });
    } else {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Failed to subscribe. Please try again.' });
    }
  }
});

// Submission endpoint
app.post('/api/submit', upload.array('files'), async (req, res) => {
  const { name, email, type, title, description } = req.body;
  
  if (!name || !email || !type || !title || !description) {
    return res.status(400).json({ error: 'All required fields must be filled' });
  }
  
  try {
    const files = req.files ? req.files.map(file => file.filename) : [];
    
    const result = await pool.query(
      'INSERT INTO submissions (name, email, submission_type, title, description, files) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, email, type, title, description, files]
    );
    
    res.json({ success: true, message: 'Submission received! We\'ll review it and get back to you soon.' });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Failed to submit. Please try again.' });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});