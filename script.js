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
    
    // API call to backend
    const submitButton = event.target.querySelector('button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(messageDiv, data.message, 'success');
            document.getElementById('email').value = '';
        } else {
            showMessage(messageDiv, data.error, 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Network error. Please try again.', 'error');
    }
    
    submitButton.textContent = originalText;
    submitButton.disabled = false;
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
    
    // API call to backend
    const submitButton = event.target.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            body: formData, // FormData handles multipart/form-data automatically
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage(messageDiv, data.message, 'success');
            event.target.reset();
        } else {
            showMessage(messageDiv, data.error, 'error');
        }
    } catch (error) {
        showMessage(messageDiv, 'Network error. Please try again.', 'error');
    }
    
    submitButton.textContent = originalText;
    submitButton.disabled = false;
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

// Console message for developers
console.log('🚀 Plantos Magazine Website - Ready for Launch!');
console.log('📧 Email subscriptions stored in localStorage');
console.log('📝 Submissions stored in localStorage');
console.log('⏰ Countdown to January 1st, 2026 active!');