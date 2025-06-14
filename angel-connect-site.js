/**
 * Angel Connect Website JavaScript
 * Interactive features and animations
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
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
    const companyCards = document.querySelectorAll('.company-card');
    
    // Set AI filter as active by default
    const aiFilter = document.querySelector('.filter-btn[data-filter="ai"]');
    const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
    
    if (aiFilter && allFilter) {
        allFilter.classList.remove('active');
        aiFilter.classList.add('active');
        
        // Show only AI companies initially
        companyCards.forEach(card => {
            const category = card.dataset.category;
            if (category === 'ai') {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
            }
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter companies with animation
            companyCards.forEach(card => {
                const category = card.dataset.category;
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
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
                <button type="button" class="btn btn-outline" onclick="closeModal()">Отмена</button>
                <button type="submit" class="btn btn-primary">Отправить заявку</button>
            </div>
        </form>
    `);
    
    // Form submission handling
    const form = modal.querySelector('#application-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Заявка отправлена! Мы свяжемся с вами в течение 3 рабочих дней.');
    });
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
                <button type="button" class="btn btn-outline" onclick="closeModal()">Отмена</button>
                <button type="submit" class="btn btn-primary">Подать заявку</button>
            </div>
        </form>
    `);
    
    // Form submission handling
    const form = modal.querySelector('#join-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this, 'Заявка на вступление отправлена! Мы рассмотрим ее и свяжемся с вами.');
    });
}

/**
 * Create modal utility function
 */
function createModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
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
        }, 300);
    }
}

/**
 * Handle form submission
 */
function handleFormSubmission(form, successMessage) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        closeModal();
        showSuccessMessage(successMessage);
        form.reset();
    }, 1500);
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
    const follower = document.getElementById('cursorFollower');
    if (!follower) return;
    
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
    animateRock();
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
    const toggle = document.getElementById('rockToggle');
    const follower = document.getElementById('cursorFollower');
    
    if (!toggle || !follower) return;
    
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

// Export functions for potential external use
window.AngelConnect = {
    showApplicationModal,
    showJoinModal,
    closeModal,
    showSuccessMessage
};