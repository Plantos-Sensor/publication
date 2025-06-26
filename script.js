// Countdown Timer
function updateCountdown() {
    const launchDate = new Date('January 1, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<h2>We\'re Live!</h2>';
    }
}

// Email Form Handler
async function handleEmailSubmission(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('email-message');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        showMessage(messageDiv, 'Please enter a valid email address.', 'error');
        return;
    }
    
    const submitButton = event.target.querySelector('button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    try {
        // Try to insert into Supabase
        if (supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE') {
            // First check if email already exists
            const { data: existingEmail, error: checkError } = await supabase
                .from('email_subscriptions')
                .select('email')
                .eq('email', email)
                .single();
            
            if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw checkError;
            }
            
            if (existingEmail) {
                showMessage(messageDiv, 'This email is already subscribed!', 'error');
                return;
            }
            
            // Insert new email subscription
            const { data, error } = await supabase
                .from('email_subscriptions')
                .insert([{ email: email, subscribed_at: new Date().toISOString() }]);
            
            if (error) {
                throw error;
            } else {
                showMessage(messageDiv, 'Successfully subscribed! We\'ll notify you when we launch.', 'success');
                document.getElementById('email').value = '';
            }
        } else {
            // Fallback to localStorage if Supabase not configured
            let emails = JSON.parse(localStorage.getItem('newsletter_emails') || '[]');
            
            if (emails.includes(email)) {
                showMessage(messageDiv, 'This email is already subscribed!', 'error');
            } else {
                emails.push(email);
                localStorage.setItem('newsletter_emails', JSON.stringify(emails));
                showMessage(messageDiv, 'Successfully subscribed! We\'ll notify you when we launch.', 'success');
                document.getElementById('email').value = '';
            }
        }
    } catch (error) {
        console.error('Error saving email subscription:', error);
        showMessage(messageDiv, 'There was an error subscribing. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Submission Form Handler
async function handleSubmissionForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const messageDiv = document.getElementById('submission-message');
    
    // Validate required fields
    const name = formData.get('name');
    const email = formData.get('email');
    const type = formData.get('type');
    const title = formData.get('title');
    const description = formData.get('description');
    
    if (!name || !email || !type || !title || !description) {
        showMessage(messageDiv, 'Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage(messageDiv, 'Please enter a valid email address.', 'error');
        return;
    }
    
    const submitButton = event.target.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        // Try to insert into Supabase
        if (supabase && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
            const submission = {
                author_name: name,
                author_email: email,
                submission_type: type,
                title: title,
                description: description,
                submitted_at: new Date().toISOString(),
                status: 'pending'
            };
            
            const { data, error } = await supabase
                .from('submissions')
                .insert([submission]);
            
            if (error) {
                throw error;
            } else {
                showMessage(messageDiv, 'Submission received! We\'ll review it and get back to you soon.', 'success');
                event.target.reset();
            }
        } else {
            // Fallback to localStorage if Supabase not configured
            let submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            
            const submission = {
                id: Date.now(),
                name,
                email,
                type,
                title,
                description,
                timestamp: new Date().toISOString(),
                files: formData.get('files') ? [formData.get('files').name] : []
            };
            
            submissions.push(submission);
            localStorage.setItem('submissions', JSON.stringify(submissions));
            
            showMessage(messageDiv, 'Submission received! We\'ll review it and get back to you soon.', 'success');
            event.target.reset();
        }
    } catch (error) {
        console.error('Error saving submission:', error);
        showMessage(messageDiv, 'There was an error submitting. Please try again.', 'error');
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Utility function to show messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Smooth scrolling for anchor links
function smoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Add form event listeners
    document.getElementById('email-form').addEventListener('submit', handleEmailSubmission);
    document.getElementById('submission-form').addEventListener('submit', handleSubmissionForm);
    
    // Initialize smooth scrolling
    smoothScroll();
    
    // Add fade-in animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections for fade-in effect
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Hero section should be visible immediately
    document.querySelector('.hero-section').style.opacity = '1';
    document.querySelector('.hero-section').style.transform = 'translateY(0)';
});

// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabase;

// Initialize Supabase client
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Supabase client initialized');
} catch (error) {
    console.error('Failed to initialize Supabase:', error);
}

// Console message for developers
console.log('🚀 Plantos Magazine Website - Ready for Launch!');
console.log('📧 Email subscriptions will be stored in Supabase');
console.log('📝 Submissions will be stored in Supabase');
console.log('⏰ Countdown to January 1st, 2026 active!');