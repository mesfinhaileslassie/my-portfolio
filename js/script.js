// ====== PROFESSIONAL PORTFOLIO SCRIPT ======

// ====== THEME MANAGEMENT ======
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Priority: localStorage > system preference > default light
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    html.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

// Update theme icon
function updateThemeIcon(theme) {
    if (!themeToggle) return;
    
    if (theme === 'dark') {
        themeToggle.innerHTML = '☀️';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        themeToggle.innerHTML = '🌙';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Add transition class
    html.classList.add('theme-transition');
    
    // Update theme
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Remove transition class after animation
    setTimeout(() => {
        html.classList.remove('theme-transition');
    }, 300);
    
    // Add click animation
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
        themeToggle.style.transform = 'scale(1)';
    }, 150);
}

// ====== ANIMATED SKILL BARS ======
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillsSection = document.querySelector('.skills-section');
    
    if (!skillBars.length || !skillsSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width') || '0%';
                        bar.style.width = width;
                        bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
                        
                        // Add shimmer effect
                        bar.style.background = `linear-gradient(90deg, 
                            var(--primary-color) 0%, 
                            var(--primary-light) 50%, 
                            var(--primary-color) 100%)`;
                        bar.style.backgroundSize = '200% 100%';
                        bar.style.animation = 'shimmer 2s infinite linear';
                    }, index * 200);
                });
                
                // Stop observing
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(skillsSection);
}

// ====== FORM VALIDATION & SUBMISSION ======
function setupContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    if (!contactForm) return;
    
    // Add input validation on blur
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: this.querySelector('#name').value.trim(),
            email: this.querySelector('#email').value.trim(),
            message: this.querySelector('#message').value.trim()
        };
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input)) isValid = false;
        });
        
        if (!isValid) {
            showNotification('Please fix the errors in the form.', 'error');
            return;
        }
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await simulateAPICall(formData);
            
            // Success state
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
            submitBtn.style.background = 'var(--success-color)';
            
            showNotification('Message sent successfully! I\'ll respond within 24 hours.', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
            
        } catch (error) {
            showNotification('Failed to send message. Please try again or email me directly.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const fieldName = input.name || input.id;
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'name':
            if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters';
                isValid = false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'message':
            if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showInputError(input, errorMessage);
    } else {
        clearError(input);
    }
    
    return isValid;
}

function showInputError(input, message) {
    clearError(input);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--secondary-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    `;
    
    input.parentNode.appendChild(errorDiv);
    input.classList.add('error');
}

function clearError(input) {
    input.classList.remove('error');
    const errorDiv = input.parentNode.querySelector('.input-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ====== NOTIFICATION SYSTEM ======
function showNotification(message, type = 'info') {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Style notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 
                     type === 'error' ? 'var(--secondary-color)' : 
                     'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
        min-width: 300px;
    `;
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ====== SMOOTH SCROLLING ======
function setupSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
    
    // Smooth scroll for navigation links (non-anchor)
    document.querySelectorAll('nav a').forEach(link => {
        if (!link.getAttribute('href').startsWith('#')) return;
        
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight || 80;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ====== ACTIVE NAV LINK HIGHLIGHTING ======
function setupActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// ====== BACK TO TOP BUTTON ======
function setupBackToTop() {
    const backToTop = document.createElement('a');
    backToTop.href = '#';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ====== PROJECT CARD INTERACTIONS ======
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Hover effect for images
        const projectImg = card.querySelector('.project-img img');
        if (projectImg) {
            card.addEventListener('mouseenter', () => {
                projectImg.style.transform = 'scale(1.08)';
                projectImg.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            card.addEventListener('mouseleave', () => {
                projectImg.style.transform = 'scale(1)';
            });
        }
        
        // Click effect
        card.addEventListener('mousedown', () => {
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('mouseup', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// ====== SCROLL ANIMATIONS ======
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe elements
    document.querySelectorAll('.card, .project-card, .info-card, .goal-card').forEach(el => {
        observer.observe(el);
    });
}

// ====== MOBILE MENU ======
function setupMobileMenu() {
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuToggle.setAttribute('aria-label', 'Toggle menu');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    
    const header = document.querySelector('header');
    const navMenu = document.querySelector('.nav-menu');
    
    if (header && navMenu) {
        header.appendChild(mobileMenuToggle);
        
        // Toggle menu
        mobileMenuToggle.addEventListener('click', () => {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('show');
            
            // Update icon
            mobileMenuToggle.innerHTML = isExpanded 
                ? '<i class="fas fa-bars"></i>' 
                : '<i class="fas fa-times"></i>';
        });
        
        // Close menu when clicking links
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('show');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('show');
                mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// ====== LAZY LOAD IMAGES ======
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ====== TYPEWRITER EFFECT ======
function initTypewriter() {
    const heroTitle = document.querySelector('.hero-content h1');
    if (!heroTitle) return;
    
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    const speed = 50;
    
    function typeWriter() {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    // Start typing when hero section is visible
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(typeWriter, 500);
            observer.disconnect();
        }
    });
    
    observer.observe(heroTitle);
}

// ====== CURRENT YEAR IN FOOTER ======
function updateCurrentYear() {
    const yearElements = document.querySelectorAll('[data-current-year]');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

// ====== SIMULATE API CALL ======
function simulateAPICall(data) {
    return new Promise((resolve) => {
        console.log('Form submission data:', data);
        
        // Simulate network delay
        setTimeout(() => {
            resolve({ success: true, message: 'Form submitted successfully' });
        }, 1500);
    });
}

// ====== INITIALIZE EVERYTHING ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio script loaded successfully');
    
    // Initialize theme
    initTheme();
    
    // Add event listener for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        
        // Keyboard support
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('portfolio-theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            updateThemeIcon(newTheme);
        }
    });
    
    // Initialize all features
    animateSkillBars();
    setupContactForm();
    setupSmoothScrolling();
    setupActiveNavHighlight();
    setupBackToTop();
    setupProjectCards();
    setupScrollAnimations();
    setupMobileMenu();
    setupLazyLoading();
    initTypewriter();
    updateCurrentYear();
    
    // Add injected styles
    injectStyles();
});

// ====== INJECT ADDITIONAL STYLES ======
function injectStyles() {
    const styles = `
        /* Theme transition */
        .theme-transition * {
            transition: background-color 0.3s ease, 
                       color 0.3s ease, 
                       border-color 0.3s ease !important;
        }
        
        /* Input error states */
        input.error,
        textarea.error {
            border-color: var(--secondary-color) !important;
            box-shadow: 0 0 0 3px rgba(247, 37, 133, 0.1) !important;
        }
        
        /* Back to top button */
        .back-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--gradient-primary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: 999;
            box-shadow: var(--shadow-lg);
        }
        
        .back-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .back-to-top:hover {
            transform: translateY(-5px) scale(1.1);
            box-shadow: var(--shadow-xl);
        }
        
        /* Mobile menu */
        .mobile-menu-toggle {
            display: none;
            background: var(--gradient-primary);
            color: white;
            border: none;
            width: 44px;
            height: 44px;
            border-radius: var(--radius-sm);
            cursor: pointer;
            font-size: 1.25rem;
            position: absolute;
            top: 1rem;
            right: 1rem;
            z-index: 1001;
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .nav-menu {
                position: fixed;
                top: 0;
                left: -100%;
                width: 80%;
                max-width: 300px;
                height: 100vh;
                background: var(--card-bg);
                backdrop-filter: blur(20px);
                flex-direction: column;
                padding: 5rem 2rem;
                transition: left 0.3s ease;
                box-shadow: var(--shadow-xl);
                z-index: 1000;
            }
            
            .nav-menu.show {
                left: 0;
            }
        }
        
        /* Scroll animations */
        .animate-in {
            animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes shimmer {
            0% {
                background-position: -200% 0;
            }
            100% {
                background-position: 200% 0;
            }
        }
        
        /* Skill bar shimmer */
        .skill-progress {
            position: relative;
            overflow: hidden;
        }
        
        /* Loading spinner */
        .fa-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

// ====== ERROR HANDLING ======
window.addEventListener('error', function(e) {
    console.error('Script error:', e.message, 'at', e.filename, 'line', e.lineno);
    
    // Try to reinitialize critical features
    setTimeout(() => {
        initTheme();
        setupContactForm();
    }, 100);
});

// ====== PERFORMANCE OPTIMIZATION ======
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate anything that depends on window size
    }, 250);
});

// ====== PROGRESSIVE ENHANCEMENT ======
// Check for JavaScript support
document.documentElement.classList.add('js-enabled');

// ====== KEYBOARD NAVIGATION ======
document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input/textarea
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    // Theme toggle (Alt + T)
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Escape key closes notifications and mobile menu
    if (e.key === 'Escape') {
        document.querySelectorAll('.notification').forEach(notification => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
        
        const mobileMenu = document.querySelector('.nav-menu.show');
        if (mobileMenu) {
            document.querySelector('.mobile-menu-toggle').click();
        }
    }
});

// ====== PAGE LOAD ANIMATION ======
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add loading animation removal
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => {
        el.classList.remove('loading');
    });
});

// ====== EXPORT FUNCTIONS (for debugging) ======
if (typeof window !== 'undefined') {
    window.portfolio = {
        initTheme,
        toggleTheme,
        animateSkillBars,
        showNotification,
        updateCurrentYear
    };
}