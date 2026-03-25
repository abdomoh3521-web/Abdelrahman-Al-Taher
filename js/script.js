// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (body) {
    body.setAttribute('data-theme', currentTheme);
}

// Update toggle icon based on current theme
if (themeToggle) {
    updateToggleIcon();

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon();
    });
}

function updateToggleIcon() {
    if (!themeToggle) return;
    const currentTheme = body.getAttribute('data-theme');
    const icon = themeToggle.querySelector('i');
    
    if (icon) {
        if (currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// Smooth scrolling for navigation links
if (document) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor) {
            anchor.addEventListener('click', function (e) {
                if (e) e.preventDefault();
                
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    });
}

// Scroll animations
const heroTextElement = document.querySelector('.hero-text');
const fadeInElements = document.querySelectorAll('.fade-in');


function handleScroll() {
    const scrollY = window.scrollY;
    
    // Hero text fade out on scroll
    if (heroTextElement) {
        if (scrollY > 100) {
            heroTextElement.classList.add('hidden');
        } else {
            heroTextElement.classList.remove('hidden');
        }
    }
    
    // Fade in sections on scroll - only add visible, never remove
    fadeInElements.forEach(element => {
        if (element && !element.classList.contains('visible')) {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            // Show element if it's in viewport or close to it
            if (rect.top < windowHeight - 50 && rect.bottom > 0) {
                element.classList.add('visible');
            }
        }
    });
}

if (window) {
    window.addEventListener('scroll', handleScroll);
    
    // Initial check after a short delay to ensure DOM is ready
    setTimeout(() => {
        handleScroll();
    }, 100);
    
    // Also check on load
    window.addEventListener('load', () => {
        setTimeout(() => {
            handleScroll();
        }, 500);
    });
}

// Typing animation for hero text
const heroTitle = document.querySelector('.hero-text h2');
let originalText = '';
let i = 0;

if (heroTitle) {
    originalText = heroTitle.textContent;
    heroTitle.textContent = '';
}

function typeWriter() {
    if (heroTitle && i < originalText.length) {
        heroTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing animation after page load
if (window) {
    window.addEventListener('load', () => {
        setTimeout(typeWriter, 1000);
        
        // Make all fade-in elements visible after page load with a delay
        setTimeout(() => {
            fadeInElements.forEach(element => {
                if (element) {
                    element.classList.add('visible');
                }
            });
        }, 1500);
    });
}

// Add some interactive effects
if (document) {
    document.querySelectorAll('.skill-item').forEach(item => {
        if (item) {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05) translateY(-10px)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1) translateY(0)';
            });
        }
    });
}