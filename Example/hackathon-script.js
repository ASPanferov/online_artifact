/**
 * AI Hackathon Samarkand - Interactive JavaScript
 * Modern vanilla JavaScript implementation with all features
 */

class HackathonSite {
    constructor() {
        this.currentLanguage = 'ru';
        this.currentStep = 1;
        this.totalSteps = 4;
        this.registrationData = {};
        this.countdownIntervals = [];
        
        this.init();
    }
    
    init() {
        this.initializeLanguage();
        this.setupEventListeners();
        this.initializeParticles();
        this.initializeAOS();
        this.initializeCountdowns();
        this.initializeLucideIcons();
        this.setupFormValidation();
        this.setupMobileNavigation();
        this.setupFAQ();
        this.setupSmoothScrolling();
        
        // Initialize everything after DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.finalizeInitialization();
            });
        } else {
            this.finalizeInitialization();
        }
    }
    
    finalizeInitialization() {
        // Update all translations
        this.updateTranslations();
        
        // Initialize AOS with custom settings
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }
        
        // Start countdowns
        this.startCountdowns();
        
        // Setup intersection observer for navigation
        this.setupNavigationHighlight();
        
        console.log('🤖 AI Hackathon Samarkand site initialized successfully!');
    }
    
    // ============ LANGUAGE MANAGEMENT ============
    initializeLanguage() {
        const savedLanguage = localStorage.getItem('hackathon-language');
        if (savedLanguage && ['ru', 'uz', 'en'].includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
        } else {
            // Auto-detect browser language
            const browserLang = navigator.language.slice(0, 2);
            if (['ru', 'uz', 'en'].includes(browserLang)) {
                this.currentLanguage = browserLang;
            }
        }
        
        this.updateLanguageUI();
    }
    
    updateLanguageUI() {
        const languageBtn = document.getElementById('languageBtn');
        const currentLangSpan = languageBtn?.querySelector('.current-lang');
        const langOptions = document.querySelectorAll('.lang-option');
        
        if (currentLangSpan) {
            currentLangSpan.textContent = this.currentLanguage.toUpperCase();
        }
        
        langOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === this.currentLanguage);
        });
        
        document.documentElement.lang = this.currentLanguage;
    }
    
    changeLanguage(lang) {
        if (['ru', 'uz', 'en'].includes(lang)) {
            this.currentLanguage = lang;
            localStorage.setItem('hackathon-language', lang);
            this.updateLanguageUI();
            this.updateTranslations();
        }
    }
    
    updateTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update document title and meta description
        this.updateMetaTags();
    }
    
    getTranslation(key) {
        if (!window.hackathonTranslations || !window.hackathonTranslations[this.currentLanguage]) {
            return null;
        }
        
        const keys = key.split('.');
        let value = window.hackathonTranslations[this.currentLanguage];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || null;
    }
    
    updateMetaTags() {
        const titles = {
            ru: 'AI Хакатон в Самарканде - 6-8 августа 2025 | Angel Connect',
            uz: "Samarqandda AI Hackathon - 6-8 avgust 2025 | Angel Connect",
            en: 'AI Hackathon in Samarkand - August 6-8, 2025 | Angel Connect'
        };
        
        const descriptions = {
            ru: 'Примите участие в первом AI Хакатоне в Самарканде! 3 дня разработки, ноутбуки в качестве призов, менторство от экспертов Angel Connect.',
            uz: "Samarqandda birinchi AI Hackathonda qatnashing! 3 kun ishlab chiqish, mukofot sifatida noutbuklar, Angel Connect ekspertlaridan maslahat.",
            en: 'Participate in the first AI Hackathon in Samarkand! 3 days of development, laptops as prizes, mentorship from Angel Connect experts.'
        };
        
        document.title = titles[this.currentLanguage];
        
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptions[this.currentLanguage]);
        }
    }
    
    // ============ EVENT LISTENERS ============
    setupEventListeners() {
        // Language switcher
        document.addEventListener('click', (e) => {
            if (e.target.closest('.lang-option')) {
                const lang = e.target.closest('.lang-option').dataset.lang;
                this.changeLanguage(lang);
            }
        });
        
        // Smooth scrolling for navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                    
                    // Close mobile nav if open
                    this.closeMobileNav();
                }
            }
        });
        
        // Form navigation
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitForm');
        
        nextBtn?.addEventListener('click', () => this.nextFormStep());
        prevBtn?.addEventListener('click', () => this.prevFormStep());
        submitBtn?.addEventListener('click', (e) => this.handleFormSubmit(e));
        
        // Team selection logic
        const hasTeamRadios = document.querySelectorAll('input[name="hasTeam"]');
        hasTeamRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handleTeamSelection());
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleNavbarScroll());
        
        // Resize handler for responsive particles
        window.addEventListener('resize', () => this.handleResize());
    }
    
    // ============ PARTICLES INITIALIZATION ============
    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: {
                        value: 50,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: ['#0066FF', '#8B5CF6', '#A855F7']
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#000000'
                        }
                    },
                    opacity: {
                        value: 0.4,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false
                        }
                    },
                    size: {
                        value: 4,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 0.5,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#0066FF',
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: true,
                        straight: false,
                        out_mode: 'out',
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse'
                        },
                        onclick: {
                            enable: true,
                            mode: 'push'
                        },
                        resize: true
                    },
                    modes: {
                        grab: {
                            distance: 140,
                            line_linked: {
                                opacity: 1
                            }
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3
                        },
                        repulse: {
                            distance: 100,
                            duration: 0.4
                        },
                        push: {
                            particles_nb: 4
                        },
                        remove: {
                            particles_nb: 2
                        }
                    }
                },
                retina_detect: true
            });
        }
    }
    
    // ============ AOS INITIALIZATION ============
    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            // Custom AOS settings will be applied in finalizeInitialization
        }
    }
    
    // ============ COUNTDOWN TIMERS ============
    initializeCountdowns() {
        // Target dates
        this.registrationDeadline = new Date('2025-07-15T23:59:59+05:00'); // Uzbekistan timezone
        this.hackathonStart = new Date('2025-08-06T09:00:00+05:00');
        
        // Extend Day.js with plugins if available
        if (typeof dayjs !== 'undefined') {
            if (dayjs.extend) {
                dayjs.extend(window.dayjs_plugin_duration);
                dayjs.extend(window.dayjs_plugin_relativeTime);
            }
        }
    }
    
    startCountdowns() {
        // Clear existing intervals
        this.countdownIntervals.forEach(interval => clearInterval(interval));
        this.countdownIntervals = [];
        
        // Registration countdown
        const regInterval = setInterval(() => {
            this.updateCountdown('registration', this.registrationDeadline);
        }, 1000);
        this.countdownIntervals.push(regInterval);
        
        // Event countdown
        const eventInterval = setInterval(() => {
            this.updateCountdown('event', this.hackathonStart);
        }, 1000);
        this.countdownIntervals.push(eventInterval);
        
        // Initial update
        this.updateCountdown('registration', this.registrationDeadline);
        this.updateCountdown('event', this.hackathonStart);
    }
    
    updateCountdown(type, targetDate) {
        const now = new Date();
        const difference = targetDate - now;
        
        const prefix = type === 'registration' ? 'reg' : 'event';
        const daysEl = document.getElementById(`${prefix}Days`);
        const hoursEl = document.getElementById(`${prefix}Hours`);
        const minutesEl = document.getElementById(`${prefix}Minutes`);
        
        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            
            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        } else {
            // Time's up
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
        }
    }
    
    // ============ LUCIDE ICONS ============
    initializeLucideIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            
            // Re-create icons after dynamic content changes
            const observer = new MutationObserver(() => {
                lucide.createIcons();
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }
    
    // ============ FORM HANDLING ============
    setupFormValidation() {
        const form = document.getElementById('registrationForm');
        if (!form) return;
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = this.getTranslation('form.errors.required') || 'Это поле обязательно';
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = this.getTranslation('form.errors.email') || 'Введите корректный email';
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = this.getTranslation('form.errors.phone') || 'Введите корректный номер телефона';
            }
        }
        
        // Age validation
        if (field.name === 'age' && value) {
            const age = parseInt(value);
            if (age < 18 || age > 65) {
                isValid = false;
                errorMessage = this.getTranslation('form.errors.age') || 'Возраст должен быть от 18 до 65 лет';
            }
        }
        
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorEl = field.parentNode.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            field.parentNode.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }
    
    nextFormStep() {
        if (this.validateCurrentStep()) {
            this.currentStep++;
            this.updateFormStep();
        }
    }
    
    prevFormStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateFormStep();
        }
    }
    
    validateCurrentStep() {
        const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (!currentStepEl) return false;
        
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    updateFormStep() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStepEl = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentStepEl) {
            currentStepEl.classList.add('active');
        }
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prevStep');
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitForm');
        
        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : 'flex';
        }
        
        if (nextBtn && submitBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.style.display = 'none';
            }
        }
        
        // Update progress bar
        this.updateProgressBar();
    }
    
    updateProgressBar() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill) {
            const percentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${this.currentStep} / ${this.totalSteps}`;
        }
    }
    
    handleTeamSelection() {
        const hasTeamYes = document.querySelector('input[name="hasTeam"][value="yes"]');
        const teamNameGroup = document.getElementById('teamNameGroup');
        const teamMembersGroup = document.getElementById('teamMembersGroup');
        
        const showTeamFields = hasTeamYes?.checked;
        
        if (teamNameGroup) {
            teamNameGroup.style.display = showTeamFields ? 'block' : 'none';
            const input = teamNameGroup.querySelector('input');
            if (input) {
                input.required = showTeamFields;
            }
        }
        
        if (teamMembersGroup) {
            teamMembersGroup.style.display = showTeamFields ? 'block' : 'none';
            const textarea = teamMembersGroup.querySelector('textarea');
            if (textarea) {
                textarea.required = showTeamFields;
            }
        }
    }
    
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        const form = document.getElementById('registrationForm');
        const formData = new FormData(form);
        
        // Convert FormData to object
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Add timestamp
        data.submittedAt = new Date().toISOString();
        data.language = this.currentLanguage;
        
        this.registrationData = data;
        
        // Show loading state
        const submitBtn = document.getElementById('submitForm');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="btn-icon animate-spin"></i><span>Отправка...</span>';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call (replace with actual Firebase integration)
            await this.submitToFirebase(data);
            
            // Show success message
            this.showFormSuccess();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormError(error.message);
        } finally {
            // Restore button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Re-initialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }
    
    async submitToFirebase(data) {
        // Placeholder for Firebase integration
        // In real implementation, this would use Firebase SDK
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Registration data:', data);
                resolve({ success: true, id: Date.now() });
            }, 2000);
        });
    }
    
    showFormSuccess() {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.innerHTML = `
                <div class="form-success">
                    <div class="success-icon">✅</div>
                    <h3>${this.getTranslation('form.success.title') || 'Заявка отправлена!'}</h3>
                    <p>${this.getTranslation('form.success.message') || 'Мы свяжемся с вами в течение 3 рабочих дней.'}</p>
                    <button type="button" class="btn btn-primary" onclick="location.reload()">
                        ${this.getTranslation('form.success.new_application') || 'Подать еще одну заявку'}
                    </button>
                </div>
            `;
        }
    }
    
    showFormError(message) {
        // Show error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-notification';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i data-lucide="alert-circle"></i>
                <span>${message || 'Произошла ошибка. Попробуйте еще раз.'}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
        
        // Re-initialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
    
    // ============ MOBILE NAVIGATION ============
    setupMobileNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileNav = document.getElementById('mobileNav');
        
        navToggle?.addEventListener('click', () => {
            this.toggleMobileNav();
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-header') && mobileNav?.classList.contains('active')) {
                this.closeMobileNav();
            }
        });
    }
    
    toggleMobileNav() {
        const mobileNav = document.getElementById('mobileNav');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (mobileNav && navToggle) {
            const isActive = mobileNav.classList.contains('active');
            
            if (isActive) {
                this.closeMobileNav();
            } else {
                mobileNav.classList.add('active');
                navToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }
    
    closeMobileNav() {
        const mobileNav = document.getElementById('mobileNav');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (mobileNav && navToggle) {
            mobileNav.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // ============ FAQ FUNCTIONALITY ============
    setupFAQ() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                const faqItem = e.target.closest('.faq-item');
                const isActive = faqItem.classList.contains('active');
                
                // Close all other FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            }
        });
    }
    
    // ============ SMOOTH SCROLLING ============
    setupSmoothScrolling() {
        // This is handled in the event listeners
    }
    
    scrollToElement(element) {
        const headerHeight = document.querySelector('.nav-header')?.offsetHeight || 70;
        const targetPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // ============ NAVIGATION HIGHLIGHT ============
    setupNavigationHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    
                    // Update navigation highlighting
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            rootMargin: '-70px 0px -50% 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // ============ SCROLL EFFECTS ============
    handleNavbarScroll() {
        const navbar = document.querySelector('.nav-header');
        if (!navbar) return;
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // ============ RESPONSIVE HANDLING ============
    handleResize() {
        // Reinitialize particles for mobile
        if (window.innerWidth <= 768) {
            // Reduce particles on mobile
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.particles.number.value = 20;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
        } else {
            // Full particles on desktop
            if (window.pJSDom && window.pJSDom[0] && window.pJSDom[0].pJS) {
                window.pJSDom[0].pJS.particles.number.value = 50;
                window.pJSDom[0].pJS.fn.particlesRefresh();
            }
        }
        
        // Close mobile nav on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileNav();
        }
    }
    
    // ============ UTILITY METHODS ============
    
    // Debounce function for performance
    debounce(func, wait) {
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
    
    // Analytics tracking (placeholder)
    trackEvent(eventName, data = {}) {
        console.log('Analytics Event:', eventName, data);
        // Integrate with Google Analytics, Facebook Pixel, etc.
    }
    
    // Cleanup method
    destroy() {
        // Clear all intervals
        this.countdownIntervals.forEach(interval => clearInterval(interval));
        this.countdownIntervals = [];
        
        // Remove event listeners
        document.removeEventListener('click', this.globalClickHandler);
        window.removeEventListener('scroll', this.scrollHandler);
        window.removeEventListener('resize', this.resizeHandler);
        
        console.log('🧹 Hackathon site cleaned up');
    }
}

// CSS for dynamic elements
const dynamicStyles = `
    <style>
        .error {
            border-color: #ef4444 !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .field-error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
        }
        
        .form-success {
            text-align: center;
            padding: 3rem 2rem;
            background: linear-gradient(135deg, #E5F0FF 0%, #F3E8FF 100%);
            border-radius: 20px;
        }
        
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        
        .form-error-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #fee2e2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            animation: slideInRight 0.3s ease;
        }
        
        .error-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #dc2626;
        }
        
        .error-content button {
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            color: #dc2626;
            margin-left: 0.5rem;
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
        
        .nav-header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .nav-link.active {
            color: #0066FF;
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .mobile-nav.active {
            display: block;
        }
        
        .animate-spin {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    </style>
`;

// Add dynamic styles to document
if (!document.querySelector('#dynamic-hackathon-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'dynamic-hackathon-styles';
    styleElement.innerHTML = dynamicStyles;
    document.head.appendChild(styleElement);
}

// Initialize the site when the script loads
let hackathonSiteInstance;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        hackathonSiteInstance = new HackathonSite();
    });
} else {
    hackathonSiteInstance = new HackathonSite();
}

// Global access for debugging
window.hackathonSite = hackathonSiteInstance;