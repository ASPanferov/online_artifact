// Countdown Timer
const hackathonDate = new Date('2025-08-06T10:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = hackathonDate - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString();
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Animated Background
function createFloatingShapes() {
    const container = document.getElementById('floating-shapes');
    const shapes = [];
    
    // Create 20 floating shapes
    for (let i = 0; i < 20; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape animate-float';
        
        // Random size between 20-80px
        const size = Math.random() * 60 + 20;
        shape.style.width = size + 'px';
        shape.style.height = size + 'px';
        
        // Random position
        shape.style.left = Math.random() * 100 + '%';
        shape.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        shape.style.animationDelay = Math.random() * 10 + 's';
        shape.style.animationDuration = (10 + Math.random() * 20) + 's';
        
        // Random opacity
        shape.style.opacity = Math.random() * 0.3 + 0.1;
        
        container.appendChild(shape);
        shapes.push(shape);
    }
    
    // Animate shapes continuously (уменьшенная частота для плавности)
    function animateShapes() {
        shapes.forEach(shape => {
            // Реже меняем позицию для плавности
            if (Math.random() < 0.002) {
                shape.style.left = Math.random() * 100 + '%';
                shape.style.top = Math.random() * 100 + '%';
                shape.style.transition = 'all 2s ease-in-out';
            }
        });
        requestAnimationFrame(animateShapes);
    }
    
    animateShapes();
}

// Initialize floating shapes when page loads
document.addEventListener('DOMContentLoaded', () => {
    createFloatingShapes();
    
    // Убедимся что модальное окно скрыто при загрузке
    const modal = document.getElementById('applicationModal');
    if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
    }
    document.body.style.overflow = 'auto';
});

// Modal functionality
function openModal() {
    console.log('Opening modal');
    document.getElementById('applicationModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    console.log('Closing modal');
    document.getElementById('applicationModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Toggle project description visibility
function toggleProjectDescription() {
    const checkbox = document.querySelector('input[name="hasProject"]');
    const projectDescription = document.getElementById('projectDescription');
    
    if (checkbox.checked) {
        projectDescription.classList.remove('hidden');
    } else {
        projectDescription.classList.add('hidden');
    }
}

// Smooth scrolling
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Form submission
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation
    if (!data.fullName || !data.email || !data.phone || !data.role || !data.experience || !data.skills || !data.motivation) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Пожалуйста, введите корректный email');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    // Simulate form submission
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Отправляется...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.');
        closeModal();
        this.reset();
        document.getElementById('projectDescription').classList.add('hidden');
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500);
});

// Убираем Intersection Observer полностью для избежания мигания
// Intersection Observer for animations (улучшенная версия без мигания)
// const observerOptions = {
//     threshold: 0.2,
//     rootMargin: '0px 0px -100px 0px'
// };

// const observer = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
//             entry.target.classList.add('animate-fadeIn', 'animated');
//             // Прекращаем наблюдение за этим элементом после первой анимации
//             observer.unobserve(entry.target);
//         }
//     });
// }, observerOptions);

// Observe all sections for animations (только один раз)
// document.addEventListener('DOMContentLoaded', () => {
//     // Убираем наблюдение за секциями, чтобы избежать мигания
//     // const sections = document.querySelectorAll('section');
//     // sections.forEach(section => {
//     //     observer.observe(section);
//     // });
//     
//     // Наблюдаем только за карточками для плавного появления
//     const cards = document.querySelectorAll('.card, .stats-card, .program-card, .timeline-item');
//     cards.forEach((card, index) => {
//         card.style.animationDelay = (index * 0.05) + 's';
//         observer.observe(card);
//     });
// });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.getElementById('applicationModal').classList.contains('hidden')) {
        closeModal();
    }
});

// Add close button functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('applicationModal');
    const closeButton = document.querySelector('.modal-close');
    const cancelButton = document.querySelector('.modal-cancel');
    const overlay = document.querySelector('.modal-overlay');
    
    // Close on X button click
    if (closeButton) {
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Close on cancel button click
    if (cancelButton) {
        cancelButton.addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }
});

// Touch/mobile optimizations
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartY - touchEndY;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe up - scroll to next section
            scrollToNextSection();
        } else {
            // Swipe down - scroll to previous section
            scrollToPrevSection();
        }
    }
}

function scrollToNextSection() {
    const sections = document.querySelectorAll('section');
    const currentSection = getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex < sections.length - 1) {
        sections[currentIndex + 1].scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToPrevSection() {
    const sections = document.querySelectorAll('section');
    const currentSection = getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex > 0) {
        sections[currentIndex - 1].scrollIntoView({ behavior: 'smooth' });
    }
}

function getCurrentSection() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + window.innerHeight / 2;
    
    for (let section of sections) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;
        
        if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
            return section;
        }
    }
    
    return sections[0];
}

// Performance optimizations (убираем лишние обработчики скролла)
// let ticking = false;
// 
// function updateOnScroll() {
//     if (!ticking) {
//         requestAnimationFrame(() => {
//             // Add any scroll-based animations here
//             ticking = false;
//         });
//         ticking = true;
//     }
// }
// 
// window.addEventListener('scroll', updateOnScroll);

// Preload critical resources
function preloadResources() {
    const heroImage = new Image();
    heroImage.src = 'hackathon-hero-bg.jpg';
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    preloadResources();
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .stats-card, .program-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add some easter eggs
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated
        document.body.style.animation = 'none';
        document.body.style.background = 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ff0000)';
        document.body.style.backgroundSize = '400% 400%';
        document.body.style.animation = 'gradient 2s ease infinite';
        
        setTimeout(() => {
            document.body.style.animation = 'none';
            document.body.style.background = '';
        }, 5000);
        
        konamiCode = [];
    }
});

// Add gradient animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
`;
document.head.appendChild(style);

// Analytics and tracking (placeholder)
function trackEvent(eventName, properties = {}) {
    // This would normally send data to your analytics service
    console.log('Event:', eventName, properties);
}

// Track key interactions
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_class: e.target.className
        });
    }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // We would register a service worker here for offline support
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Resize handler for responsive adjustments
const handleResize = debounce(() => {
    // Handle any responsive adjustments here
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
        // Mobile-specific adjustments
        document.body.classList.add('mobile');
    } else {
        document.body.classList.remove('mobile');
    }
}, 250);

window.addEventListener('resize', handleResize);
handleResize(); // Call on load

// Focus management for accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// Apply focus trap to modal
document.getElementById('applicationModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.querySelector('.modal-content');
        trapFocus(modal);
    }
});

// Scroll to top function
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Show/hide scroll to top button
window.addEventListener('scroll', throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // You could add a scroll to top button here
    // const scrollButton = document.getElementById('scrollToTop');
    // if (scrollTop > 300) {
    //     scrollButton.style.display = 'block';
    // } else {
    //     scrollButton.style.display = 'none';
    // }
}, 100));

// Dark mode toggle (if needed)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }
});

// Print styles optimization
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Final initialization
console.log('AI Хакатон Самарканд 2025 - Сайт загружен успешно! 🚀');
console.log('Присоединяйтесь к нам: 6-8 августа 2025');