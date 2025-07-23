/**
 * Angel Connect Website JavaScript
 * Interactive features and animations
 */

// Import CSS
import './angel-connect-site.css';

// Import Firebase functions
import { db } from './firebase-config.prod.js';
import { 
    collection, 
    getDocs, 
    addDoc, 
    query, 
    where, 
    orderBy,
    limit 
} from 'firebase/firestore';

// Import translations
import { translations } from './translations.js';

// Prevent FOUC and smooth page loading
function initPageLoading() {
    // Add loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loadingOverlay);
    
    // Hide loading and show content when ready
    function showContent() {
        // Add loaded class for smooth transition
        document.body.classList.add('loaded');
        
        // Hide loading overlay after transition
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            // Remove overlay completely after animation
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.remove();
                }
            }, 300);
        }, 100);
        
        // Initialize sections visibility
        initSectionVisibility();
    }
    
    // Wait for fonts and critical resources
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(showContent);
    } else {
        // Fallback for browsers without font loading API
        setTimeout(showContent, 200);
    }
}

// Initialize section visibility for smooth transitions
function initSectionVisibility() {
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });
    
    sections.forEach(section => {
        // Make sections visible initially if they're in viewport
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            section.classList.add('visible');
        }
        observer.observe(section);
    });
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize smooth loading first
    initPageLoading();
    
    // Initialize Lucide icons first for static content
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        try {
            lucide.createIcons();
            console.log('🔄 Initial Lucide icons initialized');
        } catch (error) {
            console.error('❌ Error initializing initial Lucide icons:', error);
        }
    } else {
        console.warn('⚠️ Lucide library not available at initialization');
    }
    
    // Initialize version info
    initVersionInfo();
    
    // Initialize all modules
    initNavigation();
    initCompanyFilters();
    initSmoothScrolling();
    initScrollAnimations();
    initMobileMenu();
    initCounterAnimations();
    initFormHandling();
    initCursorFollower();
    initClickGlow();
    initRockToggle();
    initLanguageSwitcher();
    initPhotoSwipeGallery();
    initHackathonBanner();
    loadBlogPosts();
    
    // Force remove loading states after 2 seconds as emergency fallback
    setTimeout(() => {
        hideLoadingStates();
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        console.log('🔧 Emergency hideLoadingStates() and body classes fixed');
    }, 2000);
    
    // Load dynamic content from Firebase
    loadFirebaseContent();
    
    console.log('Angel Connect website initialized ✨');
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const nav = document.querySelector('.nav-header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navigation scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    });
    
    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * Enhanced Mobile menu functionality
 */
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (!toggle || !mobileNav) return;
    
    toggle.addEventListener('click', function() {
        const isOpen = toggle.classList.contains('open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking on links
    mobileNav.querySelectorAll('.mobile-nav-link, .btn').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Close menu on outside click
    document.addEventListener('click', function(e) {
        if (!toggle.contains(e.target) && !mobileNav.contains(e.target) && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function openMobileMenu() {
        toggle.classList.add('open');
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        const firstLink = mobileNav.querySelector('.mobile-nav-link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }
    
    function closeMobileMenu() {
        toggle.classList.remove('open');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to toggle button
        toggle.focus();
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

/**
 * Company filtering functionality
 */
function initCompanyFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Set hackathon filter as active by default (first group)
    const hackathonFilter = document.querySelector('.filter-btn[data-filter="hackathon"]');
    const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
    
    // Remove existing event listeners to prevent duplicates
    filterBtns.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Re-select buttons after cloning
    const newFilterBtns = document.querySelectorAll('.filter-btn');
    const newHackathonFilter = document.querySelector('.filter-btn[data-filter="hackathon"]');
    const newAllFilter = document.querySelector('.filter-btn[data-filter="all"]');
    
    if (newHackathonFilter && newAllFilter) {
        newAllFilter.classList.remove('active');
        newHackathonFilter.classList.add('active');
        
        // Apply initial filter to show only hackathon companies
        applyFilter('hackathon');
    }
    
    newFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            const filterGroup = this.closest('.filter-group');
            
            // Update active button within the same group
            if (filterGroup) {
                const groupButtons = filterGroup.querySelectorAll('.filter-btn');
                groupButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            } else {
                // Fallback for buttons not in groups
                newFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            }
            
            // Apply filter
            applyFilter(filter);
        });
    });
}

/**
 * Apply filter to company cards with animation
 */
function applyFilter(filter) {
    // Always get fresh cards from DOM (including dynamically added ones)
    const companyCards = document.querySelectorAll('.company-card');
    
    console.log(`🔍 Applying filter: ${filter}, found ${companyCards.length} cards`);
    
    companyCards.forEach((card, index) => {
        const category = card.dataset.category;
        const program = card.dataset.program || 'hackathon'; // Default to hackathon if not set
        
        let shouldShow = false;
        
        if (filter === 'all') {
            shouldShow = true;
        } else if (filter === 'hackathon' || filter === 'incubator') {
            // Filter by program
            shouldShow = program === filter;
        } else {
            // Filter by category (industry)
            shouldShow = category === filter;
        }
        
        console.log(`Card ${index}: category="${category}", program="${program}", shouldShow=${shouldShow}`);
        
        if (shouldShow) {
            // Ensure card is visible before animating
            card.style.display = 'block';
            // Stagger animation for smooth effect
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1) translateY(0)';
            }, index * 50);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95) translateY(10px)';
            setTimeout(() => {
                if (card.style.opacity === '0') {
                    card.style.display = 'none';
                }
            }, 250);
        }
    });
}

/**
 * Enhanced smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Add transitioning class to prevent layout shifts
                document.body.classList.add('smooth-scrolling');
                
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                // Ensure target section is visible before scrolling
                if (!target.classList.contains('visible')) {
                    target.classList.add('visible');
                }
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Remove transitioning class after scroll
                setTimeout(() => {
                    document.body.classList.remove('smooth-scrolling');
                }, 800);
            }
        });
    });
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Stagger animations for grid items
                const children = entry.target.querySelectorAll('.program-card, .company-card, .event-card, .team-member');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
    
    // Initially hide grid items for animation
    document.querySelectorAll('.program-card, .company-card, .event-card, .team-member').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

/**
 * Counter animations for hero stats
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    let animationTriggered = false;
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationTriggered) {
                animationTriggered = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, { threshold: 0.5 });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
    
    function animateCounter(element) {
        const target = element.textContent;
        const number = parseInt(target.replace(/[^0-9]/g, ''));
        const prefix = target.replace(/[0-9]/g, '').split(number.toString())[0] || '';
        const suffix = target.replace(/[0-9]/g, '').split(number.toString())[1] || '';
        
        let current = 0;
        const increment = number / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = prefix + Math.floor(current) + suffix;
        }, 40);
    }
}

/**
 * Form handling and validation
 */
/**
 * Initialize version information display
 */
function initVersionInfo() {
    try {
        if (typeof window.AngelConnectVersion !== 'undefined') {
            const version = window.AngelConnectVersion;
            
            // Update version display in footer
            const versionEl = document.getElementById('siteVersion');
            if (versionEl) {
                versionEl.textContent = `v${version.number}`;
                versionEl.title = `${version.name} - ${version.date}`;
            }
            
            // Add version to console for debugging
            console.log(`🚀 Angel Connect v${version.number} - ${version.name}`);
            console.log(`📅 Release Date: ${version.date}`);
            console.log(`🏗️ Build: ${version.build}`);
            console.log(`✨ Features: ${version.features.join(', ')}`);
        } else {
            console.warn('⚠️ Version information not available');
        }
    } catch (error) {
        console.error('❌ Error initializing version info:', error);
    }
}

function initFormHandling() {
    // Apply button click tracking
    const applyBtns = document.querySelectorAll('a[href="#apply"]');
    applyBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showApplicationModal();
        });
    });
    
    // Join club button click tracking
    const joinBtns = document.querySelectorAll('a[href="#join"]');
    joinBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            showJoinModal();
        });
    });
}

/**
 * Show application modal (placeholder)
 */
function showApplicationModal() {
    // Create modal for startup application
    const modal = createModal('Подача заявки стартапа', `
        <form id="application-form" class="modal-form">
            <div class="form-group">
                <label for="startup-name">Название стартапа *</label>
                <input type="text" id="startup-name" name="startupName" required>
            </div>
            <div class="form-group">
                <label for="founder-name">Имя основателя *</label>
                <input type="text" id="founder-name" name="founderName" required>
            </div>
            <div class="form-group">
                <label for="email">Email *</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="phone">Номер телефона *</label>
                <input type="tel" id="phone" name="phone" required placeholder="+998 90 123 45 67">
            </div>
            <div class="form-group">
                <label for="telegram">Telegram *</label>
                <input type="text" id="telegram" name="telegram" required placeholder="@username">
            </div>
            <div class="form-group">
                <label for="stage">Стадия развития *</label>
                <select id="stage" name="stage" required>
                    <option value="">Выберите стадию</option>
                    <option value="idea">Идея</option>
                    <option value="prototype">Прототип</option>
                    <option value="mvp">MVP</option>
                    <option value="traction">Есть тракция</option>
                </select>
            </div>
            <div class="form-group">
                <label for="description">Описание проекта *</label>
                <textarea id="description" name="description" rows="4" required placeholder="Опишите ваш стартап в нескольких предложениях"></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-outline modal-cancel">Отмена</button>
                <button type="submit" class="btn btn-primary">Отправить заявку</button>
            </div>
        </form>
    `);
    
    // Form submission handling
    const form = modal.querySelector('#application-form');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Заявка отправлена! Мы свяжемся с вами в течение 3 рабочих дней.');
    });
    
    cancelBtn.addEventListener('click', closeModal);
}

/**
 * Show join club modal (placeholder)
 */
function showJoinModal() {
    const modal = createModal('Присоединиться к ангельскому клубу', `
        <form id="join-form" class="modal-form">
            <div class="form-group">
                <label for="investor-name">Ваше имя *</label>
                <input type="text" id="investor-name" name="investorName" required>
            </div>
            <div class="form-group">
                <label for="investor-email">Email *</label>
                <input type="email" id="investor-email" name="email" required>
            </div>
            <div class="form-group">
                <label for="investor-phone">Номер телефона *</label>
                <input type="tel" id="investor-phone" name="phone" required placeholder="+998 90 123 45 67">
            </div>
            <div class="form-group">
                <label for="investor-telegram">Telegram *</label>
                <input type="text" id="investor-telegram" name="telegram" required placeholder="@username">
            </div>
            <div class="form-group">
                <label for="experience">Опыт инвестирования *</label>
                <select id="experience" name="experience" required>
                    <option value="">Выберите опыт</option>
                    <option value="first-time">Первый раз</option>
                    <option value="some">Есть опыт (1-5 сделок)</option>
                    <option value="experienced">Опытный (5+ сделок)</option>
                </select>
            </div>
            <div class="form-group">
                <label for="investment-range">Размер инвестиций *</label>
                <select id="investment-range" name="investmentRange" required>
                    <option value="">Выберите диапазон</option>
                    <option value="5k-25k">$5K - $25K</option>
                    <option value="25k-100k">$25K - $100K</option>
                    <option value="100k+">$100K+</option>
                </select>
            </div>
            <div class="form-group">
                <label for="sectors">Интересные сектора</label>
                <textarea id="sectors" name="sectors" rows="3" placeholder="FinTech, HealthTech, EdTech..."></textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-outline modal-cancel">Отмена</button>
                <button type="submit" class="btn btn-primary">Подать заявку</button>
            </div>
        </form>
    `);
    
    // Form submission handling
    const form = modal.querySelector('#join-form');
    const cancelBtn = modal.querySelector('.modal-cancel');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Заявка на вступление отправлена! Мы рассмотрим ее и свяжемся с вами.');
    });
    
    cancelBtn.addEventListener('click', closeModal);
}

/**
 * Create modal utility function
 */
function createModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        closeModal();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for closing
    const backdrop = modal.querySelector('.modal-backdrop');
    const closeBtn = modal.querySelector('.modal-close');
    
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
    
    // Add keyboard listener for Escape key
    document.addEventListener('keydown', handleModalKeydown);
    
    // Animate in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    return modal;
}

/**
 * Close modal utility function
 */
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
            // Remove keyboard listener
            document.removeEventListener('keydown', handleModalKeydown);
        }, 300);
    }
}

/**
 * Handle keyboard events for modal
 */
function handleModalKeydown(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

/**
 * Send notification directly to Telegram Bot API
 */
async function sendTelegramNotification(applicationId, applicationData) {
    const TELEGRAM_BOT_TOKEN = '7697980537:AAF_Ov07LzeZ1DiNf5RpS1kgOihD3-6LaBc';
    const TELEGRAM_CHAT_ID = '-4781719100';
    
    console.log('🚀 Starting Telegram notification process...');
    console.log('📱 Bot Token (first 10 chars):', TELEGRAM_BOT_TOKEN.substring(0, 10) + '...');
    console.log('💬 Chat ID:', TELEGRAM_CHAT_ID);
    console.log('🆔 Application ID:', applicationId);
    console.log('📋 Application Data Type:', applicationData.type);
    
    try {
        // Format message
        console.log('📝 Formatting message...');
        const message = formatTelegramMessage(applicationData, applicationId);
        console.log('📄 Formatted message length:', message.length);
        console.log('📄 Message preview:', message.substring(0, 100) + '...');
        
        // Send to Telegram Bot API
        const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        console.log('🌐 Telegram API URL:', telegramApiUrl.replace(TELEGRAM_BOT_TOKEN, 'TOKEN_HIDDEN'));
        
        const payload = {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        };
        
        console.log('📦 Sending payload to Telegram...');
        
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response status text:', response.statusText);
        
        const result = await response.json();
        console.log('📨 Telegram API response:', result);
        
        if (result.ok) {
            console.log('✅ Telegram notification sent successfully!');
            console.log('📩 Message ID:', result.result.message_id);
            return result;
        } else {
            console.error('❌ Telegram API returned error:', result);
            throw new Error(`Telegram API error: ${result.description || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('💥 Exception in sendTelegramNotification:', error);
        console.error('💥 Error name:', error.name);
        console.error('💥 Error message:', error.message);
        console.error('💥 Error stack:', error.stack);
        throw error;
    }
}

/**
 * Format application data for Telegram message
 */
function formatTelegramMessage(data, applicationId) {
    const emoji = data.type === 'startup' ? '🚀' : '💼';
    const title = data.type === 'startup' ? 'НОВАЯ ЗАЯВКА СТАРТАПА' : 'НОВАЯ ЗАЯВКА ИНВЕСТОРА';
    
    let message = `${emoji} *${title}*\n\n`;
    message += `📋 *ID:* \`${applicationId}\`\n`;
    
    if (data.type === 'startup') {
        message += `🏢 *Стартап:* ${data.companyName || 'Не указано'}\n`;
        message += `👤 *Основатель:* ${data.formData?.founderName || data.name || 'Не указано'}\n`;
        message += `📧 *Email:* ${data.email || 'Не указан'}\n`;
        message += `📞 *Телефон:* ${data.phone || 'Не указан'}\n`;
        message += `🎯 *Стадия:* ${data.stage || 'Не указано'}\n`;
        message += `📝 *Описание:* ${data.description || 'Не указано'}\n`;
    } else {
        message += `👤 *Инвестор:* ${data.name || 'Не указано'}\n`;
        message += `📧 *Email:* ${data.email || 'Не указан'}\n`;
        message += `📞 *Телефон:* ${data.phone || 'Не указан'}\n`;
        message += `💡 *Опыт:* ${data.experience || 'Не указано'}\n`;
        message += `💰 *Бюджет:* ${data.investmentRange || 'Не указано'}\n`;
        message += `🎯 *Сектора:* ${data.sectors || 'Не указано'}\n`;
    }
    
    message += `\n⏰ *Время подачи:* ${new Date(data.submittedAt?.toDate ? data.submittedAt.toDate() : data.submittedAt).toLocaleString('ru-RU')}\n`;
    message += `📊 *Статус:* ${data.status || 'submitted'}\n`;
    
    // Add CRM link
    message += `\n🔗 *Управление:* [Открыть в CRM](https://angelconnect-49d81.firebaseapp.com/crm.html)`;
    
    return message;
}

/**
 * Handle form submission with Firebase
 */
async function handleFormSubmission(form, successMessage) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Determine application type based on form ID
        const applicationType = form.id === 'application-form' ? 'startup' : 'investor';
        
        // Validate phone and telegram for both startup and investor applications
        if (data.phone || data.telegram) {
            // Phone validation
            if (data.phone) {
                const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(data.phone)) {
                    throw new Error('Пожалуйста, введите корректный номер телефона');
                }
            }
            
            // Telegram validation
            if (data.telegram && !data.telegram.startsWith('@')) {
                throw new Error('Telegram должен начинаться с @');
            }
        }
        
        // Create application object with flattened structure for CRM compatibility
        const application = {
            type: applicationType,
            // Flatten main fields for easier CRM display
            companyName: data.startupName || data.investorName || 'Не указано',
            name: data.startupName || data.investorName || 'Не указано', 
            email: data.email || 'Не указан',
            phone: data.phone || 'Не указан',
            telegram: data.telegram || 'Не указан',
            description: data.description || 'Описание не указано',
            stage: data.stage || 'Не указано',
            experience: data.experience || 'Не указано',
            investmentRange: data.investmentRange || 'Не указано',
            sectors: data.sectors || 'Не указано',
            // Keep original form data for reference
            formData: data,
            status: 'submitted',
            submittedAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        // Save to Firebase
        const docRef = await addDoc(collection(db, 'applications'), application);
        const applicationId = docRef.id;
        
        // Send notification to Telegram via HTTP function
        try {
            console.log('📱 Attempting to send Telegram notification...', { applicationId, application });
            const telegramResult = await sendTelegramNotification(applicationId, application);
            console.log('✅ Telegram notification sent successfully:', telegramResult);
        } catch (notificationError) {
            console.error('❌ Error sending Telegram notification:', notificationError);
            console.error('📋 Application data:', application);
            console.error('🆔 Application ID:', applicationId);
            
            // Show additional notification about Telegram error
            setTimeout(() => {
                showSuccessMessage('⚠️ Заявка сохранена, но уведомление в Telegram не отправлено. Мы обработаем заявку вручную.');
            }, 2000);
        }
        
        // Success
        closeModal();
        showSuccessMessage(successMessage);
        form.reset();
        
        // Track submission
        console.log(`${applicationType} application submitted:`, data);
        
    } catch (error) {
        console.error('Error submitting application:', error);
        showSuccessMessage('Произошла ошибка. Попробуйте еще раз или свяжитесь с нами напрямую.');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Show success message
 */
function showSuccessMessage(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Auto remove
    setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

/**
 * Utility functions
 */

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

// Throttle function for scroll events
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
    }
}

// Add CSS for modal and notifications dynamically
const dynamicStyles = `
<style>
/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.9);
    background: white;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    transition: transform 0.3s ease;
}

.modal.active .modal-content {
    transform: translate(-50%, -50%) scale(1);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-light);
}

.modal-header h3 {
    margin: 0;
    color: var(--text-primary);
}

.modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--text-secondary);
    transition: color 0.3s ease;
}

.modal-close:hover {
    color: var(--text-primary);
}

.modal-body {
    padding: 1.5rem;
}

.modal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: var(--text-primary);
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.75rem;
    border: 2px solid var(--border-light);
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary-blue);
}

.form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light);
}

/* Mobile Menu Styles */
.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    z-index: 999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.mobile-menu.active {
    opacity: 1;
    visibility: visible;
}

.mobile-menu-content {
    padding: 100px 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    height: 100%;
}

.mobile-menu .nav-link {
    font-size: 1.2rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-light);
}

.mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: auto;
}

/* Navigation toggle animation */
.nav-toggle.open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.nav-toggle.open span:nth-child(2) {
    opacity: 0;
}

.nav-toggle.open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

/* Notification Styles */
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    background: white;
    border-radius: 12px;
    box-shadow: var(--shadow-large);
    border-left: 4px solid var(--primary-blue);
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
}

.notification.active {
    opacity: 1;
    transform: translateX(0);
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
}

.notification-icon {
    font-size: 1.2rem;
}

.notification-message {
    color: var(--text-primary);
    font-weight: 500;
}

.notification.success {
    border-left-color: #10B981;
}

/* Animation classes */
.animate-in {
    animation: slideInUp 0.6s ease forwards;
}

@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive modal */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .notification {
        left: 20px;
        right: 20px;
        top: auto;
        bottom: 20px;
    }
}
</style>
`;

// Inject dynamic styles
document.head.insertAdjacentHTML('beforeend', dynamicStyles);

/**
 * Flying rock physics
 */
function initCursorFollower() {
    console.log('🗿 Initializing cursor follower...');
    const follower = document.getElementById('cursorFollower');
    console.log('🗿 Follower element:', follower);
    console.log('🗿 Window width:', window.innerWidth);
    
    if (!follower) {
        console.error('🗿 Cursor follower element not found!');
        return;
    }
    
    // Don't initialize on mobile devices
    if (window.innerWidth <= 768) {
        console.log('🗿 Mobile device detected, hiding cursor follower');
        follower.style.display = 'none';
        return;
    }
    
    console.log('🗿 Desktop device, proceeding with initialization...');
    
    // Rock physics properties
    let rockX = window.innerWidth / 2;
    let rockY = window.innerHeight / 2;
    let velocityX = (Math.random() - 0.5) * 2; // Random initial direction
    let velocityY = (Math.random() - 0.5) * 2;
    let gravityX = 0;
    let gravityY = 0;
    const speed = 1.5; // Base speed
    const bounceDecay = 0.8; // Energy loss on bounce
    const gravityStrength = 0.02; // How strong the gravity effect is
    const gravityDecay = 0.98; // How gravity fades over time
    const rockSize = 650; // Rock size for collision detection
    
    // Normalize initial velocity
    const initialMagnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    velocityX = (velocityX / initialMagnitude) * speed;
    velocityY = (velocityY / initialMagnitude) * speed;
    
    // Handle mouse clicks for gravity
    document.addEventListener('click', function(e) {
        // Ignore clicks on interactive elements
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate gravity direction towards click
        const deltaX = mouseX - rockX;
        const deltaY = mouseY - rockY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > 0) {
            // Set gravity towards click point
            gravityX = (deltaX / distance) * gravityStrength;
            gravityY = (deltaY / distance) * gravityStrength;
        }
    });
    
    // Animation function
    function animateRock() {
        // Apply gravity
        velocityX += gravityX;
        velocityY += gravityY;
        
        // Decay gravity over time
        gravityX *= gravityDecay;
        gravityY *= gravityDecay;
        
        // Normalize velocity to maintain consistent speed
        const currentMagnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        if (currentMagnitude > 0) {
            velocityX = (velocityX / currentMagnitude) * speed;
            velocityY = (velocityY / currentMagnitude) * speed;
        }
        
        // Update position
        rockX += velocityX;
        rockY += velocityY;
        
        // Collision detection with screen edges
        const halfSize = rockSize / 2;
        
        // Left edge collision
        if (rockX - halfSize <= 0) {
            rockX = halfSize;
            velocityX = Math.abs(velocityX) * bounceDecay;
        }
        
        // Right edge collision
        if (rockX + halfSize >= window.innerWidth) {
            rockX = window.innerWidth - halfSize;
            velocityX = -Math.abs(velocityX) * bounceDecay;
        }
        
        // Top edge collision
        if (rockY - halfSize <= 0) {
            rockY = halfSize;
            velocityY = Math.abs(velocityY) * bounceDecay;
        }
        
        // Bottom edge collision
        if (rockY + halfSize >= window.innerHeight) {
            rockY = window.innerHeight - halfSize;
            velocityY = -Math.abs(velocityY) * bounceDecay;
        }
        
        // Apply position
        follower.style.left = (rockX - halfSize) + 'px';
        follower.style.top = (rockY - halfSize) + 'px';
        
        requestAnimationFrame(animateRock);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Keep rock within new boundaries
        const halfSize = rockSize / 2;
        rockX = Math.max(halfSize, Math.min(window.innerWidth - halfSize, rockX));
        rockY = Math.max(halfSize, Math.min(window.innerHeight - halfSize, rockY));
    });
    
    // Start animation
    console.log('🗿 Starting rock animation...');
    follower.style.display = 'block';
    follower.style.opacity = '0.7';
    console.log('🗿 Rock visibility set:', follower.style.display, follower.style.opacity);
    animateRock();
    console.log('🗿 Cursor follower initialized successfully!');
}

/**
 * Click glow effect for Angel Connect title
 */
function initClickGlow() {
    const titleElement = document.querySelector('.hero-title-main');
    if (!titleElement) return;
    
    // Set data-text attribute for the pseudo-element
    titleElement.setAttribute('data-text', titleElement.textContent);
    
    let clickCooldown = false;
    
    document.addEventListener('click', function(e) {
        // Ignore clicks on interactive elements
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
            return;
        }
        
        // Check cooldown
        if (clickCooldown) return;
        
        // Activate cooldown
        clickCooldown = true;
        
        // Add glowing effect
        titleElement.classList.add('glowing');
        
        // Remove effect after animation completes (2 seconds)
        setTimeout(() => {
            titleElement.classList.remove('glowing');
        }, 2000);
        
        // Reset cooldown after 1.5 seconds to prevent spam
        setTimeout(() => {
            clickCooldown = false;
        }, 1500);
    });
}

/**
 * Rock toggle functionality
 */
function initRockToggle() {
    console.log('🎛️ Initializing rock toggle...');
    const toggle = document.getElementById('rockToggle');
    const follower = document.getElementById('cursorFollower');
    console.log('🎛️ Toggle element:', toggle);
    console.log('🎛️ Follower element:', follower);
    
    if (!toggle || !follower) {
        console.error('🎛️ Toggle or follower element not found!');
        return;
    }
    
    // Hide toggle on mobile devices
    if (window.innerWidth <= 768) {
        const toggleContainer = toggle.closest('.rock-toggle-container');
        if (toggleContainer) {
            toggleContainer.style.display = 'none';
        }
        follower.style.display = 'none';
        return;
    }
    
    // Load saved state from localStorage
    const savedState = localStorage.getItem('rockFollowerEnabled');
    const isEnabled = savedState !== null ? savedState === 'true' : true; // По умолчанию включен
    
    toggle.checked = isEnabled;
    updateRockVisibility(isEnabled);
    
    // Handle toggle change
    toggle.addEventListener('change', function() {
        const enabled = this.checked;
        updateRockVisibility(enabled);
        
        // Save state to localStorage
        localStorage.setItem('rockFollowerEnabled', enabled.toString());
        
        // Visual feedback
        const container = this.closest('.rock-toggle-container');
        container.style.transform = 'scale(0.95)';
        setTimeout(() => {
            container.style.transform = 'scale(1)';
        }, 150);
    });
    
    function updateRockVisibility(enabled) {
        if (enabled) {
            follower.style.display = 'block';
            follower.style.opacity = '0.7';
        } else {
            follower.style.display = 'none';
        }
    }
}

/**
 * Language Switcher functionality
 */
function initLanguageSwitcher() {
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentLangSpan = document.querySelector('.current-lang');
    const langOptions = document.querySelectorAll('.lang-option');
    const mobileLangBtns = document.querySelectorAll('.mobile-lang-btn');
    
    if (!languageBtn || !languageDropdown) return;
    
    // Load saved language or default to Russian
    const savedLang = localStorage.getItem('angelconnect_language') || 'ru';
    setLanguage(savedLang);
    
    // Desktop language switcher
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleLanguageDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
            closeLanguageDropdown();
        }
    });
    
    // Language option clicks
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
            closeLanguageDropdown();
        });
    });
    
    // Mobile language switcher
    mobileLangBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            setLanguage(lang);
            
            // Close mobile menu
            const mobileNav = document.querySelector('.mobile-nav');
            if (mobileNav) {
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    function toggleLanguageDropdown() {
        const isActive = languageDropdown.classList.contains('active');
        if (isActive) {
            closeLanguageDropdown();
        } else {
            openLanguageDropdown();
        }
    }
    
    function openLanguageDropdown() {
        languageDropdown.classList.add('active');
        languageBtn.classList.add('active');
    }
    
    function closeLanguageDropdown() {
        languageDropdown.classList.remove('active');
        languageBtn.classList.remove('active');
    }
    
    function setLanguage(lang) {
        // Save to localStorage
        localStorage.setItem('angelconnect_language', lang);
        
        // Update current language display
        const langNames = { ru: 'RU', uz: 'UZ', en: 'EN' };
        currentLangSpan.textContent = langNames[lang];
        
        // Update active states
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
        
        mobileLangBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Apply translations
        applyTranslations(lang);
        
        // Reload Firebase content with new language
        loadFirebaseContent();
        
        // Update page language attribute
        document.documentElement.lang = lang;
    }
    
    function applyTranslations(lang) {
        if (!translations || !translations[lang]) {
            console.warn(`Translations for language "${lang}" not found`);
            return;
        }
        
        const t = translations[lang];
        
        // Translate all elements with data-translate attribute
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            const translation = getNestedValue(t, key);
            
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Update page title
        const titles = {
            ru: 'Angel Connect - Первая экосистема для стартапов в Центральной Азии',
            uz: 'Angel Connect - Markaziy Osiyodagi birinchi startap ekosistema',
            en: 'Angel Connect - The first startup ecosystem in Central Asia'
        };
        document.title = titles[lang] || titles.ru;
        
        // Update meta description
        const descriptions = {
            ru: 'Angel Connect создает процветающую стартап-экосистему в Центральной Азии. Программы для стартапов, ангельские инвестиции, менторство и развитие.',
            uz: 'Angel Connect Markaziy Osiyoda gullab-yashnayotgan startap ekosistemani yaratmoqda. Startaplar uchun dasturlar, farishta investitsiyalar, mentorlik va rivojlanish.',
            en: 'Angel Connect creates a thriving startup ecosystem in Central Asia. Programs for startups, angel investments, mentorship and development.'
        };
        
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = descriptions[lang] || descriptions.ru;
        }
    }
    
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }
}

/**
 * Get localized text from multilingual object or return string as-is
 * @param {string|Object} text - Text string or multilingual object
 * @param {string} lang - Language code (default: 'ru')
 * @returns {string} - Localized text
 */
function getLocalizedText(text, lang = 'ru') {
    if (!text) return '';
    
    // If it's a string, return as-is
    if (typeof text === 'string') {
        return text;
    }
    
    // If it's an object, try to get localized version
    if (typeof text === 'object' && text !== null) {
        // Try requested language first
        if (text[lang]) {
            return text[lang];
        }
        
        // Fallback to Russian
        if (text.ru) {
            return text.ru;
        }
        
        // Fallback to English
        if (text.en) {
            return text.en;
        }
        
        // Fallback to Uzbek
        if (text.uz) {
            return text.uz;
        }
        
        // If none of the above, try to get any available value
        const values = Object.values(text);
        if (values.length > 0) {
            return values[0];
        }
    }
    
    // If all else fails, return empty string
    return '';
}

/**
 * Load dynamic content from Firebase with smooth transitions
 */
async function loadFirebaseContent() {
    try {
        console.log('📡 Loading content from Firebase...');
        
        // Show loading states for content areas
        showLoadingStates();
        
        // Load all data in parallel for faster loading
        const [teamData, startupsData, eventsData, statisticsData] = await Promise.allSettled([
            loadTeamData(),
            loadStartupsData(),
            loadEventsData(),
            updateStatistics()
        ]);
        
        // Hide loading states after content is loaded
        setTimeout(() => {
            hideLoadingStates();
        }, 300);
        
        console.log('✅ Firebase content loaded successfully');
    } catch (error) {
        console.error('❌ Error loading Firebase content:', error);
        // Fallback to static content if Firebase fails
        hideLoadingStates();
        console.log('📄 Using static content as fallback');
    }
}

/**
 * Show loading states for content areas
 */
function showLoadingStates() {
    const contentAreas = [
        '.companies-grid',
        '.events-grid', 
        '.team-grid',
        '.gallery-grid'
    ];
    
    contentAreas.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('loading-content');
        }
    });
}

/**
 * Hide loading states after content is loaded
 */
function hideLoadingStates() {
    const contentAreas = document.querySelectorAll('.loading-content');
    contentAreas.forEach(element => {
        element.classList.remove('loading-content');
        element.classList.add('content-loaded');
    });
}

/**
 * Load team data from Firebase
 */
async function loadTeamData() {
    try {
        const teamQuery = query(
            collection(db, 'team'),
            where('isVisible', '==', true),
            orderBy('order', 'asc')
        );
        
        const teamSnapshot = await getDocs(teamQuery);
        const teamGrid = document.querySelector('.team-grid');
        
        if (!teamGrid) return;
        
        // Clear existing content
        teamGrid.innerHTML = '';
        
        // Get current language
        const currentLang = localStorage.getItem('angelconnect_language') || 'ru';
        
        if (teamSnapshot.empty) {
            teamGrid.innerHTML = `
                <div class="no-data-placeholder">
                    <i data-lucide="users" class="placeholder-icon"></i>
                    <h3>Команда не загружена</h3>
                    <p>Информация о команде будет добавлена через CRM</p>
                </div>
            `;
            return;
        }
        
        teamSnapshot.forEach((doc) => {
            const member = doc.data();
            const memberCard = createTeamMemberCard(member, currentLang);
            teamGrid.appendChild(memberCard);
        });
        
        console.log('👥 Team data loaded');
    } catch (error) {
        console.error('Error loading team data:', error);
    }
}

/**
 * Load startups data from Firebase
 */
async function loadStartupsData() {
    try {
        const startupsQuery = query(
            collection(db, 'startups'),
            where('status', '==', 'portfolio'),
            orderBy('createdAt', 'desc')
        );
        
        const startupsSnapshot = await getDocs(startupsQuery);
        const companiesGrid = document.querySelector('.companies-grid');
        
        if (!companiesGrid) return;
        
        // Get current language
        const currentLang = localStorage.getItem('angelconnect_language') || 'ru';
        
        // Clear existing static content
        companiesGrid.innerHTML = '';
        
        if (startupsSnapshot.empty) {
            companiesGrid.innerHTML = `
                <div class="no-data-placeholder">
                    <i data-lucide="building" class="placeholder-icon"></i>
                    <h3>Нет данных о стартапах</h3>
                    <p>Компании будут отображаться после добавления через CRM</p>
                </div>
            `;
            
            // Initialize icons for placeholder
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                try {
                    lucide.createIcons();
                    console.log('🔄 Lucide icons initialized for placeholder');
                } catch (error) {
                    console.error('❌ Error initializing Lucide icons for placeholder:', error);
                }
            } else {
                console.warn('⚠️ Lucide library not available for placeholder icons');
            }
            
            return;
        }
        
        startupsSnapshot.forEach((doc) => {
            const startup = doc.data();
            const startupCard = createStartupCard(startup, currentLang);
            companiesGrid.appendChild(startupCard);
        });
        
        // Re-initialize Lucide icons for new startup cards with small delay
        setTimeout(() => {
            if (typeof lucide !== 'undefined' && lucide.createIcons) {
                try {
                    lucide.createIcons();
                    console.log('🔄 Lucide icons reinitialized for startups');
                } catch (error) {
                    console.error('❌ Error reinitializing Lucide icons:', error);
                }
            } else {
                console.warn('⚠️ Lucide library not available for icon initialization');
            }
            
            // Re-initialize company filters after DOM update
            initCompanyFilters();
            console.log('🏷️ Company filters reinitialized');
        }, 100);
        
        console.log('🚀 Startups data loaded');
    } catch (error) {
        console.error('Error loading startups data:', error);
    }
}

/**
 * Load events data from Firebase
 */
async function loadEventsData() {
    try {
        const eventsQuery = query(
            collection(db, 'events'),
            orderBy('date', 'desc'),
            limit(5)
        );
        
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsGrid = document.querySelector('.events-grid');
        
        if (!eventsGrid) return;
        
        // Get current language
        const currentLang = localStorage.getItem('angelconnect_language') || 'ru';
        
        // Clear existing static content
        eventsGrid.innerHTML = '';
        
        if (eventsSnapshot.empty) {
            eventsGrid.innerHTML = `
                <div class="no-data-placeholder">
                    <i data-lucide="calendar" class="placeholder-icon"></i>
                    <h3>Нет запланированных событий</h3>
                    <p>События будут добавляться через CRM</p>
                </div>
            `;
            return;
        }
        
        eventsSnapshot.forEach((doc) => {
            const event = doc.data();
            const eventCard = createEventCard(event, currentLang);
            eventsGrid.appendChild(eventCard);
        });
        
        console.log('📅 Events data loaded');
    } catch (error) {
        console.error('Error loading events data:', error);
    }
}

/**
 * Update statistics from Firebase data
 */
async function updateStatistics() {
    try {
        // Count startups
        const startupsSnapshot = await getDocs(query(
            collection(db, 'startups'),
            where('status', '==', 'portfolio')
        ));
        
        // Count applications (as participants)
        const applicationsSnapshot = await getDocs(collection(db, 'applications'));
        
        // Count events
        const eventsSnapshot = await getDocs(query(
            collection(db, 'events'),
            where('status', '==', 'completed')
        ));
        
        // Update stat numbers (only 3 stats now: teams, participants, projects)
        const stats = document.querySelectorAll('.stat-number');
        if (stats.length >= 3) {
            stats[0].textContent = '50+'; // Teams (static for now)
            stats[1].textContent = `${Math.max(500, applicationsSnapshot.size * 10)}+`; // Participants
            stats[2].textContent = `${startupsSnapshot.size}+`; // Projects
        }
        
        console.log('📊 Statistics updated');
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

/**
 * Create team member card element
 */
function createTeamMemberCard(member, lang) {
    const memberDiv = document.createElement('div');
    memberDiv.className = 'team-member';
    
    const memberName = getLocalizedText(member.name, lang);
    const memberRole = getLocalizedText(member.role, lang);
    const memberBio = getLocalizedText(member.bio, lang);
    
    memberDiv.innerHTML = `
        <div class="member-photo">
            <img src="${member.photo}" alt="${memberName}" loading="lazy">
        </div>
        <h3 class="member-name">${memberName}</h3>
        <p class="member-role">${memberRole}</p>
        <p class="member-bio">${memberBio}</p>
        <div class="member-links">
            <a href="${member.linkedinProfile || member.linkedin || '#'}" class="member-link" target="_blank" rel="noopener">LinkedIn</a>
        </div>
    `;
    
    return memberDiv;
}

/**
 * Create startup card element
 */
function createStartupCard(startup, lang) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'company-card';
    cardDiv.setAttribute('data-category', startup.industry);
    cardDiv.setAttribute('data-program', startup.program || 'hackathon'); // Default to hackathon
    
    // Handle multilingual name field
    const startupName = getLocalizedText(startup.name, lang) || 'Без названия';
    const startupDescription = getLocalizedText(startup.description, lang) || 'Описание недоступно';
    
    // Process logo URL - handle Firebase Storage URLs and fallbacks
    let logoElement = '<i data-lucide="building" class="company-logo-icon"></i>';
    if (startup.logo && typeof startup.logo === 'string' && startup.logo.trim() !== '') {
        // Clean up the logo URL
        let logoUrl = startup.logo.trim();
        
        // Check if it's a Firebase Storage URL that might need token refresh
        if (logoUrl.includes('firebasestorage.googleapis.com')) {
            // For Firebase Storage URLs, add error handling
            logoElement = `<img src="${logoUrl}" alt="${startupName}" loading="lazy" onerror="this.style.display='none'; this.parentNode.innerHTML='<i data-lucide=\\"building\\" class=\\"company-logo-icon\\"></i>'; if(typeof lucide !== \\'undefined\\') lucide.createIcons();">`;
        } else if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://') || logoUrl.startsWith('/')) {
            // Regular URL or relative path
            logoElement = `<img src="${logoUrl}" alt="${startupName}" loading="lazy" onerror="this.style.display='none'; this.parentNode.innerHTML='<i data-lucide=\\"building\\" class=\\"company-logo-icon\\"></i>'; if(typeof lucide !== \\'undefined\\') lucide.createIcons();">`;
        }
    }
    
    cardDiv.innerHTML = `
        <div class="company-logo">
            ${logoElement}
        </div>
        <h3 class="company-name">${startupName}</h3>
        <p class="company-description">${startupDescription}</p>
        <div class="company-meta">
            <span class="company-stage">${startup.stage || 'стартап'}</span>
            <span class="company-funding">${startup.industry || 'разное'}</span>
        </div>
    `;
    
    return cardDiv;
}

/**
 * Create event card element
 */
function createEventCard(event, lang) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'event-card';
    
    if (event.status === 'upcoming') {
        cardDiv.classList.add('featured-event');
    }
    
    const eventDate = event.date.toDate ? event.date.toDate() : new Date(event.date);
    const day = eventDate.getDate();
    const monthNames = {
        ru: ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'],
        uz: ['YAN', 'FEV', 'MAR', 'APR', 'MAY', 'IYU', 'IYL', 'AVG', 'SEN', 'OKT', 'NOY', 'DEK'],
        en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
    };
    const month = monthNames[lang][eventDate.getMonth()];
    
    const eventTitle = getLocalizedText(event.title, lang);
    const eventDescription = getLocalizedText(event.description, lang);
    const eventVenue = getLocalizedText(event.location.venue, lang) || event.location.venue;
    
    // Status translations
    const statusTexts = {
        completed: {
            ru: 'Завершен',
            uz: 'Tugallangan',
            en: 'Completed'
        },
        upcoming: {
            ru: 'Предстоящий',
            uz: 'Kelgusi',
            en: 'Upcoming'
        },
        cancelled: {
            ru: 'Отменен',
            uz: 'Bekor qilingan',
            en: 'Cancelled'
        }
    };
    
    const statusText = statusTexts[event.status]?.[lang] || 'Планируется';
    
    // Participate button texts
    const participateTexts = {
        ru: 'Участвовать',
        uz: 'Qatnashish',
        en: 'Participate'
    };
    
    const participateText = participateTexts[lang] || 'Участвовать';
    
    // Add participate button for upcoming events
    const participateButton = event.status === 'upcoming' ? 
        `<button class="btn btn-primary btn-small event-participate-btn" onclick="window.open('${event.registrationUrl || '#'}', '_blank')">
            <span>${participateText}</span>
            <i data-lucide="external-link" class="btn-icon"></i>
        </button>` : '';
    
    cardDiv.innerHTML = `
        <div class="event-date">
            <span class="event-day">${day}</span>
            <span class="event-month">${month}</span>
        </div>
        <div class="event-content">
            <h3 class="event-title">${eventTitle}</h3>
            <p class="event-description">${eventDescription}</p>
            <div class="event-meta">
                <span class="event-location">${eventVenue}</span>
                <span class="event-type">${statusText}</span>
            </div>
            ${participateButton}
        </div>
    `;
    
    return cardDiv;
}


/**
 * PhotoSwipe gallery functionality
 */
function initPhotoSwipeGallery() {
    loadGalleryPhotos();
    initPhotoSwipe();
}

/**
 * Load photos for PhotoSwipe gallery
 */
async function loadGalleryPhotos() {
    const gallery = document.getElementById('galleryGrid');
    if (!gallery) return;
    
    try {
        // Load photos from Firebase
        const photos = await loadPhotosFromFirebase();
        
        if (photos.length < 10) {
            // Use static photos if Firebase has few or no photos
            const fallbackPhotos = [
                {
                    filename: 'DSC07782-2.jpg',
                    title: 'Первый хакатон Angel Connect',
                    description: 'Участники работают над проектами',
                    url: '/HackaTons/DSC07782-2.jpg'
                },
                {
                    filename: 'DSC07790.jpg',
                    title: 'Командная работа',
                    description: 'Интенсивная разработка решений',
                    url: '/HackaTons/DSC07790.jpg'
                },
                {
                    filename: 'DSC07804.jpg',
                    title: 'Презентация проектов',
                    description: 'Демонстрация результатов',
                    url: '/HackaTons/DSC07804.jpg'
                },
                {
                    filename: 'DSC07966-2.jpg',
                    title: 'Networking',
                    description: 'Общение участников между собой',
                    url: '/HackaTons/DSC07966-2.jpg'
                },
                {
                    filename: 'DSC08012.jpg',
                    title: 'Менторство',
                    description: 'Консультации с экспертами',
                    url: '/HackaTons/DSC08012.jpg'
                },
                {
                    filename: 'DSC08197.jpg',
                    title: 'Работа в команде',
                    description: 'Совместная разработка идей',
                    url: '/HackaTons/DSC08197.jpg'
                },
                {
                    filename: 'DSC08333.jpg',
                    title: 'Финальные презентации',
                    description: 'Защита проектов перед жюри',
                    url: '/HackaTons/DSC08333.jpg'
                },
                {
                    filename: 'DSC_3053.jpg',
                    title: 'UzbekNeftegaz Hackathon',
                    description: 'Корпоративный хакатон на стадионе',
                    url: '/HackaTons/DSC_3053.jpg'
                },
                {
                    filename: 'photo_2025-03-06_13-05-27.jpg',
                    title: 'Церемония награждения',
                    description: 'Объявление победителей',
                    url: '/HackaTons/photo_2025-03-06_13-05-27.jpg'
                },
                {
                    filename: 'photo_2025-03-11 13.07.14.jpg',
                    title: 'Участники хакатона',
                    description: 'Общее фото участников',
                    url: '/HackaTons/photo_2025-03-11 13.07.14.jpg'
                },
                {
                    filename: 'photo_2025-03-11 13.07.23.jpg',
                    title: 'Рабочий процесс',
                    description: 'Разработка инновационных решений',
                    url: '/HackaTons/photo_2025-03-11 13.07.23.jpg'
                },
                {
                    filename: 'photo_2025-03-11 13.07.28.jpg',
                    title: 'Командное фото',
                    description: 'Участники одной из команд',
                    url: '/HackaTons/photo_2025-03-11 13.07.28.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-40-18.jpg',
                    title: 'Новый формат мероприятий',
                    description: 'Современный подход к хакатонам',
                    url: '/HackaTons/photo_2025-06-12_11-40-18.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-40-21.jpg',
                    title: 'Интерактивные сессии',
                    description: 'Обмен опытом и знаниями',
                    url: '/HackaTons/photo_2025-06-12_11-40-21.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-40-22.jpg',
                    title: 'Презентационная зона',
                    description: 'Специально оборудованное пространство',
                    url: '/HackaTons/photo_2025-06-12_11-40-22.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-40-23.jpg',
                    title: 'Экспертная оценка',
                    description: 'Жюри оценивает проекты',
                    url: '/HackaTons/photo_2025-06-12_11-40-23.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-40-25.jpg',
                    title: 'Инновационные идеи',
                    description: 'Демонстрация креативных решений',
                    url: '/HackaTons/photo_2025-06-12_11-40-25.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-40-26.jpg',
                    title: 'Технологический фокус',
                    description: 'Работа с современными технологиями',
                    url: '/HackaTons/photo_2025-06-12_11-40-26.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-40-27.jpg',
                    title: 'Колаборация',
                    description: 'Совместная работа над проектами',
                    url: '/HackaTons/photo_2025-06-12_11-40-27.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-41-20.jpg',
                    title: 'Итоговые результаты',
                    description: 'Подведение итогов мероприятия',
                    url: '/HackaTons/photo_2025-06-12_11-41-20.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-41-21.jpg',
                    title: 'Успешное завершение',
                    description: 'Радость от достигнутых результатов',
                    url: '/HackaTons/photo_2025-06-12_11-41-21.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-41-22.jpg',
                    title: 'Следующие шаги',
                    description: 'Планирование дальнейшего развития',
                    url: '/HackaTons/photo_2025-06-12_11-41-22.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-41-26.jpg',
                    title: 'Обратная связь',
                    description: 'Получение отзывов от участников',
                    url: '/HackaTons/photo_2025-06-12_11-41-26.jpg'
                },
                {
                    filename: 'photo_2025-06-12_11-41-28.jpg',
                    title: 'Новые возможности',
                    description: 'Перспективы развития проектов',
                    url: '/HackaTons/photo_2025-06-12_11-41-28.jpg'
                }
            ];
            
            // Use fallback photos if Firebase is empty
            createGalleryGrid(fallbackPhotos, gallery);
        } else {
            // Use photos from Firebase
            createGalleryGrid(photos, gallery);
        }
        
    } catch (error) {
        console.error('Error loading photos:', error);
        // Load static photos as fallback
        const fallbackPhotos = [
            {
                filename: 'DSC07782-2.jpg',
                title: 'Первый хакатон Angel Connect',
                description: 'Участники работают над проектами',
                url: '/HackaTons/DSC07782-2.jpg'
            }
            // Add minimal fallback photos here if needed
        ];
        createMosaicRows(fallbackPhotos, gallery);
    }
}

/**
 * Load photos from Firebase gallery collection
 */
async function loadPhotosFromFirebase() {
    try {
        // Check if Firebase is available
        if (typeof db === 'undefined') {
            console.log('Firebase not available, using static photos');
            return [];
        }
        
        // Query for published photos in hackathon category
        const q = query(
            collection(db, 'gallery'),
            where('status', '==', 'published'),
            where('category', '==', 'hackathon'),
            orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const photos = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            photos.push({
                id: doc.id,
                filename: data.originalName || data.filename,
                title: data.title,
                description: data.description,
                url: data.url,
                category: data.category
            });
        });
        
        console.log(`Loaded ${photos.length} photos from Firebase`);
        return photos;
        
    } catch (error) {
        console.error('Error loading photos from Firebase:', error);
        return [];
    }
}

/**
 * Load and display blog posts
 */
async function loadBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    const blogPlaceholder = document.getElementById('blogPlaceholder');
    
    if (!blogGrid) return;
    
    try {
        // Check if Firebase is available
        if (typeof db === 'undefined') {
            console.log('Firebase not available, showing placeholder');
            showBlogPlaceholder();
            return;
        }
        
        // Query for published blog posts
        const q = query(
            collection(db, 'blog'),
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc'),
            limit(6) // Show maximum 6 posts
        );
        
        const querySnapshot = await getDocs(q);
        const posts = [];
        
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            posts.push({
                id: doc.id,
                title: data.title,
                content: data.content,
                excerpt: data.excerpt || extractExcerpt(data.content),
                author: data.author || 'Angel Connect',
                createdAt: data.createdAt,
                status: data.status,
                imageUrl: data.imageUrl
            });
        });
        
        console.log(`Loaded ${posts.length} blog posts from Firebase`);
        
        if (posts.length > 0) {
            createBlogGrid(posts, blogGrid);
            blogPlaceholder.style.display = 'none';
        } else {
            showBlogPlaceholder();
        }
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        showBlogPlaceholder();
    }
}

/**
 * Create blog posts grid
 */
function createBlogGrid(posts, blogGrid) {
    blogGrid.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'blog-card';
        postElement.onclick = () => openBlogPost(post);
        
        // Extract text from HTML content for excerpt
        const excerpt = post.excerpt || extractExcerpt(post.content);
        
        // Format date
        const date = post.createdAt?.toDate ? 
            post.createdAt.toDate().toLocaleDateString('ru-RU') : 
            new Date().toLocaleDateString('ru-RU');
        
        postElement.innerHTML = `
            <div class="blog-card-image">
                ${post.imageUrl ? 
                    `<img src="${post.imageUrl}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
                    `<i data-lucide="file-text"></i>`
                }
            </div>
            <div class="blog-card-content">
                <h3 class="blog-card-title">${post.title}</h3>
                <p class="blog-card-excerpt">${excerpt}</p>
                <div class="blog-card-meta">
                    <div class="blog-card-date">
                        <i data-lucide="calendar" style="width: 1rem; height: 1rem;"></i>
                        <span>${date}</span>
                    </div>
                    <div class="blog-card-author">${post.author}</div>
                </div>
            </div>
        `;
        
        blogGrid.appendChild(postElement);
    });
    
    // Re-initialize Lucide icons for new content
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Extract excerpt from HTML content
 */
function extractExcerpt(htmlContent, maxLength = 150) {
    if (!htmlContent) return '';
    
    // Create temporary element to strip HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Return truncated text
    return textContent.length > maxLength ? 
        textContent.substring(0, maxLength) + '...' : 
        textContent;
}

/**
 * Show blog placeholder when no posts available
 */
function showBlogPlaceholder() {
    const blogGrid = document.getElementById('blogGrid');
    const blogPlaceholder = document.getElementById('blogPlaceholder');
    
    if (blogGrid) blogGrid.innerHTML = '';
    if (blogPlaceholder) blogPlaceholder.style.display = 'block';
}

/**
 * Open blog post in modal or new page
 */
function openBlogPost(post) {
    // For now, just log the post
    console.log('Opening blog post:', post);
    
    // TODO: Implement blog post modal or redirect to full post page
    alert(`Функция чтения полной статьи будет добавлена в следующем обновлении.\n\nЗаголовок: ${post.title}`);
}

/**
 * Create modern PhotoSwipe gallery grid
 */
function createGalleryGrid(photos, gallery) {
    // Clear existing content
    gallery.innerHTML = '';
    
    // Create gallery items
    photos.forEach((photo, index) => {
        const galleryItem = createGalleryItem(photo, index);
        gallery.appendChild(galleryItem);
    });
}

/**
 * Create gallery item element for PhotoSwipe
 */
function createGalleryItem(photo, index) {
    const galleryDiv = document.createElement('a');
    galleryDiv.href = photo.url || `/HackaTons/${photo.filename}`;
    galleryDiv.className = 'gallery-item';
    galleryDiv.setAttribute('data-pswp-width', '1200');
    galleryDiv.setAttribute('data-pswp-height', '800');
    galleryDiv.setAttribute('data-index', index);
    
    // Use Firebase URL if available, otherwise use local path
    const thumbnailUrl = photo.url || `/HackaTons/${photo.filename}`;
    
    galleryDiv.innerHTML = `
        <img src="${thumbnailUrl}" alt="${photo.title}" loading="lazy">
        <div class="gallery-overlay">
            <div class="gallery-title">${photo.title}</div>
            <p class="gallery-description">${photo.description}</p>
        </div>
    `;
    
    return galleryDiv;
}

/**
 * PhotoSwipe initialization
 */
function initPhotoSwipe() {
    // Check if PhotoSwipe libraries are available
    const checkPhotoSwipe = () => {
        if (typeof PhotoSwipeLightbox !== 'undefined' && typeof PhotoSwipe !== 'undefined') {
            try {
                const lightbox = new PhotoSwipeLightbox({
                    gallery: '#galleryGrid',
                    children: 'a',
                    pswpModule: PhotoSwipe,
                    // Angel Connect customizations
                    bgOpacity: 0.95,
                    showHideAnimationType: 'zoom',
                    padding: { 
                        top: 20, 
                        bottom: 40, 
                        left: window.innerWidth > 768 ? 100 : 20, 
                        right: window.innerWidth > 768 ? 100 : 20 
                    },
                    // Mobile optimizations
                    tapAction: 'toggle-controls',
                    doubleTapAction: 'zoom',
                    clickToCloseNonZoomable: false,
                    // Performance optimizations
                    preload: [1, 1],
                    // Accessibility
                    ariaLabelledby: 'pswp__caption',
                    // Custom UI icons
                    arrowPrevSVG: '<svg width="32" height="32" viewBox="0 0 32 32"><path d="M20 6 L10 16 L20 26" stroke="currentColor" stroke-width="3" fill="none"/></svg>',
                    arrowNextSVG: '<svg width="32" height="32" viewBox="0 0 32 32"><path d="M12 6 L22 16 L12 26" stroke="currentColor" stroke-width="3" fill="none"/></svg>',
                    closeSVG: '<svg width="32" height="32" viewBox="0 0 32 32"><path d="M8 8 L24 24 M24 8 L8 24" stroke="currentColor" stroke-width="3"/></svg>',
                    zoomSVG: '<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="14" cy="14" r="8" stroke="currentColor" stroke-width="2" fill="none"/><path d="L22 22" stroke="currentColor" stroke-width="2"/></svg>'
                });
                
                // Add custom caption with title and description
                lightbox.on('itemData', (e) => {
                    const { itemData } = e;
                    const galleryItem = e.target;
                    
                    if (galleryItem) {
                        const title = galleryItem.querySelector('.gallery-title')?.textContent || '';
                        const description = galleryItem.querySelector('.gallery-description')?.textContent || '';
                        
                        if (title || description) {
                            itemData.caption = `
                                <div class="pswp-caption-content">
                                    ${title ? `<h3>${title}</h3>` : ''}
                                    ${description ? `<p>${description}</p>` : ''}
                                </div>
                            `;
                        }
                    }
                });
                
                // Additional event handlers for Angel Connect
                lightbox.on('openingAnimationStart', () => {
                    document.body.classList.add('pswp-open');
                });
                
                lightbox.on('closingAnimationStart', () => {
                    document.body.classList.remove('pswp-open');
                });
                
                lightbox.init();
                
                // Store reference for potential use elsewhere
                window.angelConnectLightbox = lightbox;
                console.log('PhotoSwipe gallery initialized successfully');
                
            } catch (error) {
                console.error('Error initializing PhotoSwipe:', error);
            }
        } else {
            console.warn('PhotoSwipe libraries not loaded, retrying...');
            setTimeout(checkPhotoSwipe, 1000);
        }
    };
    
    // Start checking for PhotoSwipe availability
    setTimeout(checkPhotoSwipe, 500);
}


// Export functions for potential external use
window.AngelConnect = {
    showApplicationModal,
    showJoinModal,
    closeModal,
    showSuccessMessage,
    loadFirebaseContent,
    initPhotoSwipeGallery,
    loadGalleryPhotos,
    loadBlogPosts,
    sendTelegramNotification,
    formatTelegramMessage
};

// Add debug function for testing Telegram notifications
window.testTelegramNotification = async function() {
    try {
        console.log('🧪 Testing Telegram notification...');
        
        const testData = {
            type: 'startup',
            companyName: 'TestStartup Debug',
            name: 'TestStartup Debug',
            email: 'debug@test.com',
            phone: '+998901234567',
            stage: 'mvp',
            description: 'Тестовая заявка для отладки системы уведомлений',
            formData: {
                founderName: 'Тест Дебаггер',
                startupName: 'TestStartup Debug'
            },
            status: 'submitted',
            submittedAt: new Date()
        };
        
        const testId = 'DEBUG-' + Date.now();
        const result = await sendTelegramNotification(testId, testData);
        
        console.log('✅ Test notification sent successfully:', result);
        alert('✅ Тестовое уведомление отправлено! Проверьте Telegram группу.');
        
    } catch (error) {
        console.error('❌ Test notification failed:', error);
        alert('❌ Ошибка при отправке тестового уведомления: ' + error.message);
    }
};

// ==========================================
// HACKATHON BANNER FUNCTIONALITY
// ==========================================

/**
 * Initialize Hackathon Banner features
 */
function initHackathonBanner() {
    initHackathonCountdown();
    initHackathonCarousel();
}

/**
 * Hackathon Countdown Timer
 */
function initHackathonCountdown() {
    // Set hackathon date: August 6, 2025, 10:00 AM (Tashkent time)
    const hackathonDate = new Date('2025-08-06T10:00:00+05:00').getTime();
    
    function updateHackathonCountdown() {
        const now = new Date().getTime();
        const distance = hackathonDate - now;
        
        // If countdown finished
        if (distance < 0) {
            document.getElementById('hackathon-days').textContent = '0';
            document.getElementById('hackathon-hours').textContent = '00';
            document.getElementById('hackathon-minutes').textContent = '00';
            document.getElementById('hackathon-seconds').textContent = '00';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM elements
        const daysEl = document.getElementById('hackathon-days');
        const hoursEl = document.getElementById('hackathon-hours');
        const minutesEl = document.getElementById('hackathon-minutes');
        const secondsEl = document.getElementById('hackathon-seconds');
        
        if (daysEl) daysEl.textContent = days.toString();
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown immediately and then every second
    updateHackathonCountdown();
    setInterval(updateHackathonCountdown, 1000);
}

/**
 * Hackathon Carousel Functionality
 */
function initHackathonCarousel() {
    const carousel = document.querySelector('.hackathon-banners-carousel');
    if (!carousel) return;
    
    const wrapper = carousel.querySelector('.carousel-wrapper');
    const banners = carousel.querySelectorAll('.hackathon-banner');
    const dots = carousel.querySelectorAll('.carousel-dot');
    
    let currentSlide = 0;
    let autoplayInterval;
    
    // Show specific slide
    function showSlide(index) {
        // Hide all banners
        banners.forEach(banner => {
            banner.classList.remove('active');
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current banner
        if (banners[index]) {
            banners[index].classList.add('active');
        }
        
        // Activate current dot
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % banners.length;
        showSlide(nextIndex);
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + banners.length) % banners.length;
        showSlide(prevIndex);
    }
    
    // Autoplay functionality
    function startAutoplay() {
        if (banners.length > 1) {
            autoplayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
        }
    }
    
    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoplay();
            startAutoplay(); // Restart autoplay after manual navigation
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
            stopAutoplay();
            startAutoplay();
        }
    }
    
    // Pause autoplay on hover
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
    
    // Initialize first slide and start autoplay
    showSlide(0);
    startAutoplay();
}

/**
 * Navigate to hackathon landing page
 */
function navigateToHackathon() {
    console.log('Navigating to hackathon page...');
    
    // Navigate to hackathon landing page in the same tab
    const targetPath = '/samarcand_hackathon.html';
    
    // Try different methods for navigation
    try {
        // First try direct navigation
        window.location.href = targetPath;
    } catch (error) {
        console.error('Navigation failed:', error);
        
        // Fallback method
        try {
            window.location.assign(targetPath);
        } catch (fallbackError) {
            console.error('Fallback navigation failed:', fallbackError);
            
            // Last resort - direct window.open
            window.open(targetPath, '_self');
        }
    }
}

// Make navigateToHackathon globally available
window.navigateToHackathon = navigateToHackathon;

// Also create a direct event listener for the hackathon buttons
document.addEventListener('DOMContentLoaded', function() {
    // Find all hackathon navigation buttons
    const hackathonButtons = document.querySelectorAll('[onclick*="navigateToHackathon"]');
    
    hackathonButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hackathon button clicked');
            navigateToHackathon();
        });
    });
    
    // Also handle click events on hackathon cards
    const hackathonCards = document.querySelectorAll('.hackathon-event, .featured-event');
    hackathonCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hackathon card clicked');
            navigateToHackathon();
        });
    });
});