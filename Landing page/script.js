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

function showSuccessModal() {
    console.log('Showing success modal');
    document.getElementById('successModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    console.log('Closing success modal');
    document.getElementById('successModal').classList.add('hidden');
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

// Smooth scrolling - disabled on mobile to prevent issues
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const isMobile = window.innerWidth <= 768;
        section.scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
    }
}

// Form submission
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    // Basic validation for team registration
    if (!data.teamName || !data.leaderName || !data.leaderTelegram || !data.leaderPhone || !data.teamSize || !data.projectDescription) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.leaderPhone)) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    // Telegram validation (should start with @)
    if (!data.leaderTelegram.startsWith('@')) {
        alert('Telegram должен начинаться с @');
        return;
    }
    
    // Project description length validation
    if (data.projectDescription.length > 2000) {
        alert('Описание проекта не должно превышать 2000 символов');
        return;
    }
    
    // Simulate form submission
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Отправляется...';
    submitButton.disabled = true;
    
    // Prepare form data for submission
    const teamData = {
        teamName: data.teamName,
        leaderName: data.leaderName,
        leaderTelegram: data.leaderTelegram,
        leaderPhone: data.leaderPhone,
        teamSize: data.teamSize,
        projectDescription: data.projectDescription,
        existingProject: data.existingProject ? true : false,
        accommodation: data.accommodation,
        equipment: data.equipment,
        submittedAt: new Date().toISOString()
    };
    
    // Send to Telegram bot
    submitTeamApplication(teamData).then(() => {
        closeModal();
        showSuccessModal();
        this.reset();
        document.getElementById('charCount').textContent = '0';
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }).catch((error) => {
        console.error('Error submitting application:', error);
        alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    });
});

// Submit team application to Telegram
async function submitTeamApplication(teamData) {
    const botToken = '7697980537:AAF_Ov07LzeZ1DiNf5RpS1kgOihD3-6LaBc';
    const chatId = '4853980563'; // Hackathon group ID
    
    const message = `🎯 *Новая заявка на AI Хакатон Самарканд 2025*
    
*Команда:* ${teamData.teamName}
*Лидер:* ${teamData.leaderName}
*Telegram:* ${teamData.leaderTelegram}
*Телефон:* ${teamData.leaderPhone}
*Участников:* ${teamData.teamSize}

*Описание проекта:*
${teamData.projectDescription}

*Дополнительно:*
${teamData.existingProject ? '✅ Есть существующий проект' : '❌ Новый проект'}
*Размещение:* ${teamData.accommodation === 'yes' ? 'Нужно' : 'Не нужно'}
*Оборудование:* ${getEquipmentText(teamData.equipment)}

*Подано:* ${new Date(teamData.submittedAt).toLocaleString('ru-RU')}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Message sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
}

function getEquipmentText(equipment) {
    switch(equipment) {
        case 'own': return 'Собственные ноутбуки';
        case 'school': return 'Компьютеры School 21 (Linux)';
        case 'combined': return 'Комбинированно';
        default: return 'Не указано';
    }
}

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
    
    // Initialize language picker
    initLanguagePicker();
    
    // Initialize character counter
    initCharacterCounter();
    
    // Initialize modal language picker
    initModalLanguagePicker();
});

// Character counter for project description
function initCharacterCounter() {
    const textarea = document.querySelector('textarea[name="projectDescription"]');
    const charCount = document.getElementById('charCount');
    
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            if (count > 1800) {
                charCount.style.color = '#ff6b6b';
            } else if (count > 1500) {
                charCount.style.color = '#ffa726';
            } else {
                charCount.style.color = '#888';
            }
        });
    }
}

// Modal Language Picker Functions
function toggleModalLanguagePicker() {
    const dropdown = document.getElementById('modalLangDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function changeModalLanguage(lang) {
    const currentLang = document.querySelector('.modal-lang-btn .current-lang');
    const dropdown = document.getElementById('modalLangDropdown');
    
    if (currentLang) {
        currentLang.textContent = lang.toUpperCase();
    }
    
    if (dropdown) {
        dropdown.classList.remove('show');
    }
    
    // Apply translations if available
    if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
    }
    
    // Update main language picker
    const mainLangOptions = document.querySelectorAll('.lang-option');
    mainLangOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.lang === lang) {
            option.classList.add('active');
        }
    });
    
    // Update main language button
    const mainCurrentLang = document.getElementById('currentLang');
    const mainCurrentFlag = document.getElementById('currentFlag');
    const languages = {
        'ru': { name: 'RU', flag: '🇷🇺' },
        'uz': { name: 'UZ', flag: '🇺🇿' },
        'en': { name: 'EN', flag: '🇬🇧' }
    };
    
    if (mainCurrentLang && mainCurrentFlag && languages[lang]) {
        mainCurrentLang.textContent = languages[lang].name;
        mainCurrentFlag.textContent = languages[lang].flag;
    }
    
    // Save to localStorage
    localStorage.setItem('hackathon-language', lang);
}

function initModalLanguagePicker() {
    // Close modal language picker when clicking outside
    document.addEventListener('click', function(e) {
        const modalPicker = document.querySelector('.modal-language-picker');
        const dropdown = document.getElementById('modalLangDropdown');
        
        if (modalPicker && dropdown && !modalPicker.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // Set initial language in modal picker
    const savedLang = localStorage.getItem('hackathon-language') || 'ru';
    const currentLang = document.querySelector('.modal-lang-btn .current-lang');
    if (currentLang) {
        currentLang.textContent = savedLang.toUpperCase();
    }
});

// Hackathon Language Picker
function initLanguagePicker() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const languagePicker = document.getElementById('languagePicker');
    const currentLang = document.getElementById('currentLang');
    const currentFlag = document.getElementById('currentFlag');
    
    // Debug: Check if all elements are found
    console.log('Language picker elements:', {
        languageBtn,
        languageDropdown,
        languagePicker,
        currentLang,
        currentFlag
    });
    
    // If any element is missing, return early
    if (!languageBtn || !languageDropdown || !languagePicker || !currentLang || !currentFlag) {
        console.error('Language picker elements not found!');
        return;
    }
    
    // Language data
    const languages = {
        'ru': { name: 'RU', flag: '🇷🇺' },
        'uz': { name: 'UZ', flag: '🇺🇿' },
        'en': { name: 'EN', flag: '🇬🇧' }
    };
    
    // Get saved language or default to 'ru'
    const savedLang = localStorage.getItem('hackathon-language') || 'ru';
    setLanguage(savedLang);
    
    // Toggle dropdown
    languageBtn.addEventListener('click', (e) => {
        console.log('Language button clicked');
        e.stopPropagation();
        const isOpen = languageDropdown.classList.contains('show');
        
        if (isOpen) {
            console.log('Closing language dropdown');
            closeLanguageDropdown();
        } else {
            console.log('Opening language dropdown');
            openLanguageDropdown();
        }
    });
    
    // Language option selection
    const langOptions = document.querySelectorAll('.lang-option');
    console.log('Found language options:', langOptions.length);
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            console.log('Language option clicked:', option.dataset.lang);
            e.stopPropagation();
            const lang = option.dataset.lang;
            setLanguage(lang);
            closeLanguageDropdown();
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!languagePicker.contains(e.target)) {
            closeLanguageDropdown();
        }
    });
    
    // Open dropdown with animation
    function openLanguageDropdown() {
        console.log('Opening language dropdown');
        languageDropdown.classList.add('show');
        languagePicker.classList.add('open');
        
        // Add stagger animation to options
        const options = languageDropdown.querySelectorAll('.lang-option');
        console.log('Found options for animation:', options.length);
        options.forEach((option, index) => {
            option.style.animationDelay = (index * 0.05) + 's';
            option.style.animation = 'slideInRight 0.3s ease forwards';
        });
    }
    
    // Close dropdown with animation
    function closeLanguageDropdown() {
        console.log('Closing language dropdown');
        languageDropdown.classList.remove('show');
        languagePicker.classList.remove('open');
        
        // Reset animations
        const options = languageDropdown.querySelectorAll('.lang-option');
        options.forEach(option => {
            option.style.animation = '';
            option.style.animationDelay = '';
        });
    }
    
    // Set language
    function setLanguage(lang) {
        console.log('Setting language to:', lang);
        if (!languages[lang]) lang = 'ru';
        
        // Update UI
        currentLang.textContent = languages[lang].name;
        currentFlag.textContent = languages[lang].flag;
        
        // Update active option
        langOptions.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === lang) {
                option.classList.add('active');
            }
        });
        
        // Save to localStorage
        localStorage.setItem('hackathon-language', lang);
        
        // Apply translations if available
        if (typeof applyTranslations === 'function') {
            console.log('Applying translations for language:', lang);
            applyTranslations(lang);
        } else {
            console.log('applyTranslations function not available, retrying...');
            // Retry after a short delay if applyTranslations is not ready
            setTimeout(() => {
                if (typeof applyTranslations === 'function') {
                    console.log('Applying translations for language (delayed):', lang);
                    applyTranslations(lang);
                } else {
                    console.error('applyTranslations function still not available');
                }
            }, 100);
        }
        
        // Add language change animation
        languageBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            languageBtn.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (languageDropdown.classList.contains('show')) {
            switch (e.key) {
                case 'Escape':
                    closeLanguageDropdown();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    navigateOptions(-1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    navigateOptions(1);
                    break;
                case 'Enter':
                    e.preventDefault();
                    const focused = document.querySelector('.lang-option:focus');
                    if (focused) focused.click();
                    break;
            }
        }
    });
    
    // Navigate through options with keyboard
    function navigateOptions(direction) {
        const options = Array.from(langOptions);
        const currentIndex = options.findIndex(opt => opt === document.activeElement);
        const nextIndex = currentIndex + direction;
        
        if (nextIndex >= 0 && nextIndex < options.length) {
            options[nextIndex].focus();
        } else if (nextIndex < 0) {
            options[options.length - 1].focus();
        } else {
            options[0].focus();
        }
    }
}

// Add CSS animations for language picker
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .lang-option:focus {
        outline: 2px solid #00D4FF;
        outline-offset: 2px;
    }
    
    .language-picker .language-btn {
        position: relative;
        overflow: hidden;
    }
    
    .language-picker .language-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%);
        transition: all 0.3s ease;
        transform: translate(-50%, -50%);
        border-radius: 50%;
    }
    
    .language-picker .language-btn:hover::before {
        width: 100px;
        height: 100px;
    }
`;
document.head.appendChild(styleSheet);

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
        const isMobile = window.innerWidth <= 768;
        sections[currentIndex + 1].scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
    }
}

function scrollToPrevSection() {
    const sections = document.querySelectorAll('section');
    const currentSection = getCurrentSection();
    const currentIndex = Array.from(sections).indexOf(currentSection);
    
    if (currentIndex > 0) {
        const isMobile = window.innerWidth <= 768;
        sections[currentIndex - 1].scrollIntoView({ behavior: isMobile ? 'auto' : 'smooth' });
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
    const isMobile = window.innerWidth <= 768;
    window.scrollTo({ top: 0, behavior: isMobile ? 'auto' : 'smooth' });
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