// Initialize Lucide icons with retry mechanism
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        try {
            lucide.createIcons();
            console.log('Lucide icons initialized successfully');
        } catch (error) {
            console.error('Error initializing Lucide icons:', error);
            // Retry after a short delay
            setTimeout(() => {
                try {
                    lucide.createIcons();
                    console.log('Lucide icons initialized on retry');
                } catch (retryError) {
                    console.error('Failed to initialize Lucide icons on retry:', retryError);
                }
            }, 500);
        }
    } else {
        console.log('Lucide not loaded yet, retrying...');
        setTimeout(initializeLucideIcons, 200);
    }
}

// Start initialization when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
});

// Global variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');
const progressFill = document.querySelector('.progress-fill');
const presentation = document.querySelector('.presentation');

// Initialize the presentation
function initPresentation() {
    // Set up initial state
    updateActiveSlide(0);
    
    // Set up navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            navigateToSlide(index);
        });
    });
    
    // Set up scroll event listener для обновления активного слайда
    let ticking = false;
    presentation.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Set up keyboard navigation
    document.addEventListener('keydown', handleKeydown);
    
    // Set up intersection observer for animations
    setupIntersectionObserver();
    
    // Trigger initial animations for the first slide
    setTimeout(() => {
        slides[0].classList.add('active');
    }, 100);
}

// Handle scroll events - только для определения текущего слайда
function handleScroll() {
    const scrollTop = presentation.scrollTop;
    const slideHeight = window.innerHeight;
    const newSlide = Math.round(scrollTop / slideHeight);
    
    if (newSlide !== currentSlide && newSlide >= 0 && newSlide < slides.length) {
        updateActiveSlide(newSlide);
    }
    
    // Update progress bar
    const progress = (scrollTop / (presentation.scrollHeight - window.innerHeight)) * 100;
    progressFill.style.width = Math.min(Math.max(progress, 0), 100) + '%';
}

// Navigate to specific slide
function navigateToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < slides.length) {
        const targetScroll = slideIndex * window.innerHeight;
        presentation.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
        updateActiveSlide(slideIndex);
    }
}

// Update active slide and navigation
function updateActiveSlide(slideIndex) {
    currentSlide = slideIndex;
    
    // Update navigation dots
    navDots.forEach((dot, index) => {
        if (index === slideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update slides
    slides.forEach((slide, index) => {
        if (index === slideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

// Handle keyboard navigation
function handleKeydown(event) {
    switch(event.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
            event.preventDefault();
            if (currentSlide < slides.length - 1) {
                navigateToSlide(currentSlide + 1);
            }
            break;
        case 'ArrowUp':
        case 'PageUp':
            event.preventDefault();
            if (currentSlide > 0) {
                navigateToSlide(currentSlide - 1);
            }
            break;
        case 'Home':
            event.preventDefault();
            navigateToSlide(0);
            break;
        case 'End':
            event.preventDefault();
            navigateToSlide(slides.length - 1);
            break;
    }
}

// Set up intersection observer for slide animations
function setupIntersectionObserver() {
    // Use the scrolling container as the root so that
    // slides become active reliably while scrolling
    const observerOptions = {
        root: presentation,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                animateSlideContent(entry.target);
            }
        });
    }, observerOptions);
    
    slides.forEach(slide => {
        observer.observe(slide);
    });
}

// Animate slide content when it comes into view
function animateSlideContent(slide) {
    const animatedElements = slide.querySelectorAll('.achievement-card, .problem-card, .point-item, .timeline-item');
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Scroll to top function
function scrollToTop() {
    navigateToSlide(0);
}

// Add smooth reveal animations for cards
function addCardAnimations() {
    const cards = document.querySelectorAll('.achievement-card, .problem-card, .point-item, .timeline-item');
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Handle window resize
function handleResize() {
    // Recalculate slide positions on resize
    const slideHeight = window.innerHeight;
    const targetScroll = currentSlide * slideHeight;
    presentation.scrollTo({
        top: targetScroll,
        behavior: 'auto'
    });
}

// Touch/swipe support for mobile
let touchStartY = 0;
let touchEndY = 0;

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchStartY - touchEndY;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0 && currentSlide < slides.length - 1) {
            // Swipe up - next slide
            navigateToSlide(currentSlide + 1);
        } else if (swipeDistance < 0 && currentSlide > 0) {
            // Swipe down - previous slide
            navigateToSlide(currentSlide - 1);
        }
    }
}

// Debounce function for performance
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

// Add hover effects for interactive elements
function addHoverEffects() {
    const cards = document.querySelectorAll('.achievement-card, .problem-card, .point-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Lucide icons to load
    setTimeout(() => {
        initPresentation();
        addCardAnimations();
        addHoverEffects();
        
        // Переинициализируем иконки еще раз
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
            console.log('Lucide icons re-initialized in main init');
        }
        
        // Add event listeners
        window.addEventListener('resize', debounce(handleResize, 250));
        presentation.addEventListener('touchstart', handleTouchStart, { passive: true });
        presentation.addEventListener('touchend', handleTouchEnd, { passive: true });
        // Убрали wheel event listener - теперь используем только CSS scroll-snap
        
        // Ensure first slide is active
        slides[0].classList.add('active');
        
    }, 100);
});

// Export functions for global access
window.scrollToTop = scrollToTop;
window.navigateToSlide = navigateToSlide;

// Дополнительная инициализация иконок после полной загрузки страницы
window.addEventListener('load', function() {
    setTimeout(() => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
            console.log('Lucide icons initialized on window load');
        }
    }, 100);
});

// Prevent default scroll behavior on space and arrow keys when not in input
document.addEventListener('keydown', function(event) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(event.code) > -1) {
        if (event.target.tagName.toLowerCase() !== 'input' && 
            event.target.tagName.toLowerCase() !== 'textarea') {
            event.preventDefault();
        }
    }
}, false);

// Add performance optimization for animations
function optimizeAnimations() {
    // Use will-change property for elements that will be animated
    const animatedElements = document.querySelectorAll('.slide, .nav-dot, .progress-fill');
    animatedElements.forEach(element => {
        element.style.willChange = 'transform, opacity';
    });
}

// Call optimization on load
document.addEventListener('DOMContentLoaded', optimizeAnimations);

// Clean up will-change properties after animations
function cleanupAnimations() {
    const animatedElements = document.querySelectorAll('.slide, .nav-dot, .progress-fill');
    animatedElements.forEach(element => {
        element.style.willChange = 'auto';
    });
}

// Add visibility change handler to pause animations when tab is not active
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        cleanupAnimations();
    } else {
        optimizeAnimations();
    }
});