/* ============================================
   Crown Line Properties LLC LUXURY REAL ESTATE - JAVASCRIPT
   Interactive functionality and animations
   ============================================ */

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== MOBILE MENU TOGGLE =====
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
};

// Initial check
revealOnScroll();

// Check on scroll
window.addEventListener('scroll', revealOnScroll);

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Only prevent default if it's a valid anchor
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== CONTACT FORM VALIDATION =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form elements
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        
        // Get error message elements
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const subjectError = document.getElementById('subjectError');
        const messageError = document.getElementById('messageError');
        const formSuccess = document.getElementById('formSuccess');
        
        // Reset previous errors
        let isValid = true;
        [name, email, phone, subject, message].forEach(field => {
            field.classList.remove('error');
        });
        [nameError, emailError, phoneError, subjectError, messageError].forEach(error => {
            if (error) {
                error.classList.remove('show');
                error.textContent = '';
            }
        });
        if (formSuccess) {
            formSuccess.style.display = 'none';
        }
        
        // Validate name
        if (!name.value.trim()) {
            isValid = false;
            name.classList.add('error');
            if (nameError) {
                nameError.textContent = 'Name is required';
                nameError.classList.add('show');
            }
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            isValid = false;
            email.classList.add('error');
            if (emailError) {
                emailError.textContent = 'Email is required';
                emailError.classList.add('show');
            }
        } else if (!emailRegex.test(email.value)) {
            isValid = false;
            email.classList.add('error');
            if (emailError) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.classList.add('show');
            }
        }
        
        // Validate phone (optional but if provided, should be valid)
        if (phone.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone.value)) {
                isValid = false;
                phone.classList.add('error');
                if (phoneError) {
                    phoneError.textContent = 'Please enter a valid phone number';
                    phoneError.classList.add('show');
                }
            }
        }
        
        // Validate subject
        if (!subject.value) {
            isValid = false;
            subject.classList.add('error');
            if (subjectError) {
                subjectError.textContent = 'Please select a subject';
                subjectError.classList.add('show');
            }
        }
        
        // Validate message
        if (!message.value.trim()) {
            isValid = false;
            message.classList.add('error');
            if (messageError) {
                messageError.textContent = 'Message is required';
                messageError.classList.add('show');
            }
        } else if (message.value.trim().length < 10) {
            isValid = false;
            message.classList.add('error');
            if (messageError) {
                messageError.textContent = 'Message must be at least 10 characters';
                messageError.classList.add('show');
            }
        }
        
        // If form is valid, show success message
        if (isValid) {
            // In a real application, you would send the form data to a server here
            // For now, we'll just show a success message
            
            // Scroll to success message
            if (formSuccess) {
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            // Reset form
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                if (formSuccess) {
                    formSuccess.style.display = 'none';
                }
            }, 5000);
        }
    });
    
    // Real-time validation feedback (optional enhancement)
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() && this.classList.contains('error')) {
                // Re-validate on blur
                const event = new Event('input');
                this.dispatchEvent(event);
            }
        });
    });
}

// ===== PROPERTY CARD HOVER EFFECTS =====
const propertyCards = document.querySelectorAll('.property-card');

propertyCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    });
});

// ===== LAZY LOADING FOR IMAGES (Performance Enhancement) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ACTIVE NAVIGATION LINK HIGHLIGHTING =====
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
        link.classList.add('active');
    }
});

// ===== SCROLL TO TOP BUTTON (Optional Enhancement) =====
// Uncomment to add a scroll-to-top button
/*
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '↑';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: var(--color-gold);
    color: var(--color-navy);
    border: none;
    font-size: 24px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 999;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
*/

// ===== PERFORMANCE: Debounce function for scroll events =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events for better performance
const debouncedReveal = debounce(revealOnScroll, 10);
window.addEventListener('scroll', debouncedReveal);

// ===== CONSOLE MESSAGE =====
console.log('%cCrown Line Properties LLC Luxury Real Estate', 'color: #d4af37; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to our website!', 'color: #0a1929; font-size: 14px;');

