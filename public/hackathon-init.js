// Hackathon page initialization script
console.log('Hackathon page loading...');

// Wait for all content to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing hackathon page...');
    
    // Initialize countdown timer
    initCountdownTimer();
    
    // Initialize language picker
    initHackathonLanguagePicker();
    
    // Initialize modal functionality
    initModalFunctionality();
    
    // Initialize form submission
    initFormSubmission();
    
    // Initialize character counter
    initCharacterCounter();
    
    // Initialize translations
    setTimeout(() => {
        if (typeof applyTranslations === 'function') {
            const savedLang = localStorage.getItem('hackathon-language') || 'ru';
            console.log('Applying translations for:', savedLang);
            applyTranslations(savedLang);
        }
    }, 100);
});

// Countdown Timer
function initCountdownTimer() {
    console.log('Initializing countdown timer...');
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
    console.log('Countdown timer initialized');
}

// Language Picker
function initHackathonLanguagePicker() {
    console.log('Initializing language picker...');
    const languageBtn = document.getElementById('languageBtn');
    const languageDropdown = document.getElementById('languageDropdown');
    
    if (!languageBtn || !languageDropdown) {
        console.error('Language picker elements not found');
        return;
    }
    
    // Set initial language
    const savedLang = localStorage.getItem('hackathon-language') || 'ru';
    updateLanguageDisplay(savedLang);
    
    // Toggle dropdown
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        languageDropdown.classList.toggle('show');
        console.log('Language dropdown toggled');
    });
    
    // Language options
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const lang = this.dataset.lang;
            console.log('Language selected:', lang);
            changeLanguage(lang);
            languageDropdown.classList.remove('show');
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!document.getElementById('languagePicker').contains(e.target)) {
            languageDropdown.classList.remove('show');
        }
    });
    
    console.log('Language picker initialized');
}

function updateLanguageDisplay(lang) {
    const languages = {
        'ru': { name: 'RU', flag: '🇷🇺' },
        'uz': { name: 'UZ', flag: '🇺🇿' },
        'en': { name: 'EN', flag: '🇬🇧' }
    };
    
    const currentLang = document.getElementById('currentLang');
    const currentFlag = document.getElementById('currentFlag');
    
    if (currentLang && currentFlag && languages[lang]) {
        currentLang.textContent = languages[lang].name;
        currentFlag.textContent = languages[lang].flag;
    }
}

function changeLanguage(lang) {
    console.log('Changing language to:', lang);
    localStorage.setItem('hackathon-language', lang);
    updateLanguageDisplay(lang);
    
    // Apply translations
    if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
    }
    
    // Update modal language picker
    const modalCurrentLang = document.querySelector('.modal-lang-btn .current-lang');
    if (modalCurrentLang) {
        modalCurrentLang.textContent = lang.toUpperCase();
    }
}

// Modal functionality
function initModalFunctionality() {
    console.log('Initializing modal functionality...');
    
    // Modal elements
    const modal = document.getElementById('applicationModal');
    const successModal = document.getElementById('successModal');
    
    // Modal handlers
    window.openModal = function() {
        console.log('Opening application modal...');
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    
    window.closeModal = function() {
        console.log('Closing application modal...');
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };
    
    window.closeSuccessModal = function() {
        console.log('Closing success modal...');
        successModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };
    
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            if (modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
            if (successModal && !successModal.classList.contains('hidden')) {
                closeSuccessModal();
            }
        });
    });
    
    // Cancel buttons
    document.querySelectorAll('.modal-cancel').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Modal language picker functions
    window.toggleModalLanguagePicker = function() {
        const dropdown = document.getElementById('modalLangDropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    };
    
    window.changeModalLanguage = function(lang) {
        changeLanguage(lang);
        const dropdown = document.getElementById('modalLangDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    };
    
    console.log('Modal functionality initialized');
}

// Form submission functionality
function initFormSubmission() {
    console.log('Initializing form submission...');
    
    const form = document.getElementById('applicationForm');
    if (!form) {
        console.error('Application form not found');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
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
        
        // Show loading state
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
        
        try {
            // Send to Telegram bot
            await submitTeamApplication(teamData);
            closeModal();
            showSuccessModal();
            this.reset();
            
            // Reset character counter
            const charCount = document.getElementById('charCount');
            if (charCount) charCount.textContent = '0';
            
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
    
    console.log('Form submission initialized');
}

// Submit team application to Telegram
async function submitTeamApplication(teamData) {
    const botToken = '7697980537:AAF_Ov07LzeZ1DiNf5RpS1kgOihD3-6LaBc';
    const chatId = '-4853980563'; // Hackathon group ID (must be negative for groups)
    
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
    
    console.log('Sending to Telegram:', { chatId, messageLength: message.length });
    console.log('Message content:', message);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    });
    
    const result = await response.json();
    console.log('Full Telegram API response:', result);
    
    if (!response.ok) {
        console.error('Telegram API error:', result);
        console.error('Error details:', {
            ok: result.ok,
            error_code: result.error_code,
            description: result.description,
            parameters: result.parameters
        });
        throw new Error(`Telegram API error (${result.error_code}): ${result.description || 'Unknown error'}`);
    }
    
    console.log('Message sent successfully:', result);
    return result;
}

function getEquipmentText(equipment) {
    switch(equipment) {
        case 'own': return 'Собственные ноутбуки';
        case 'school': return 'Компьютеры School 21 (Linux)';
        case 'combined': return 'Комбинированно';
        default: return 'Не указано';
    }
}

function showSuccessModal() {
    console.log('Showing success modal');
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    console.log('Closing modal');
    const modal = document.getElementById('applicationModal');
    const successModal = document.getElementById('successModal');
    
    if (modal && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
    
    if (successModal && !successModal.classList.contains('hidden')) {
        successModal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

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
        console.log('Character counter initialized');
    }
}

// Test function for debugging
window.testHackathonSubmission = async function() {
    const testData = {
        teamName: 'Test Team Debug',
        leaderName: 'Test Leader',
        leaderTelegram: '@testuser',
        leaderPhone: '+998901234567',
        teamSize: '3',
        projectDescription: 'Тестовое описание проекта для отладки',
        existingProject: false,
        accommodation: 'no',
        equipment: 'own',
        submittedAt: new Date().toISOString()
    };
    
    try {
        console.log('Testing hackathon submission...');
        await submitTeamApplication(testData);
        alert('✅ Тест прошел успешно! Проверьте Telegram группу.');
    } catch (error) {
        console.error('Test failed:', error);
        alert('❌ Тест не прошел: ' + error.message);
    }
};

// Simple Telegram API test
window.testTelegramAPI = async function() {
    const botToken = '7697980537:AAF_Ov07LzeZ1DiNf5RpS1kgOihD3-6LaBc';
    const chatId = '-4853980563';
    
    try {
        console.log('Testing basic Telegram API connection...');
        
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: 'Test message from hackathon form debug'
            })
        });
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (result.ok) {
            alert('✅ Telegram API работает!');
        } else {
            alert(`❌ Ошибка API: ${result.error_code} - ${result.description}`);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('❌ Сетевая ошибка: ' + error.message);
    }
};

// Make functions globally available
window.initCountdownTimer = initCountdownTimer;
window.initHackathonLanguagePicker = initHackathonLanguagePicker;
window.changeLanguage = changeLanguage;
window.submitTeamApplication = submitTeamApplication;
window.closeModal = closeModal;
window.showSuccessModal = showSuccessModal;

console.log('Hackathon init script loaded');