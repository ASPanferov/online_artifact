/**
 * Simple Telegram notification sender for Angel Connect
 * This can be deployed as a serverless function or called from backend
 */

// Telegram bot credentials
const TELEGRAM_BOT_TOKEN = '7697980537:AAF_Ov07LzeZ1DiNf5RpS1kgOihD3-6LaBc';
const TELEGRAM_CHAT_ID = '-4781719100';

/**
 * Send message to Telegram using Bot API
 */
async function sendTelegramMessage(message) {
    const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const payload = {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
    };
    
    try {
        const response = await fetch(telegramApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('Telegram message sent successfully:', data);
            return data;
        } else {
            throw new Error(`Telegram API error: ${data.description}`);
        }
        
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        throw error;
    }
}

/**
 * Format application data into readable Telegram message
 */
function formatApplicationMessage(data, applicationId) {
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
 * Main function to send application notification
 */
async function notifyTelegramApplication(applicationId, applicationData) {
    try {
        const message = formatApplicationMessage(applicationData, applicationId);
        const result = await sendTelegramMessage(message);
        console.log('Application notification sent successfully');
        return result;
    } catch (error) {
        console.error('Failed to send application notification:', error);
        throw error;
    }
}

/**
 * Test function
 */
async function testTelegramNotification() {
    try {
        const testMessage = `🧪 *ТЕСТ УВЕДОМЛЕНИЯ*\n\nТест интеграции Angel Connect с Telegram.\nВремя: ${new Date().toLocaleString('ru-RU')}`;
        const result = await sendTelegramMessage(testMessage);
        console.log('Test notification sent successfully');
        return result;
    } catch (error) {
        console.error('Test notification failed:', error);
        throw error;
    }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sendTelegramMessage,
        formatApplicationMessage,
        notifyTelegramApplication,
        testTelegramNotification
    };
}

// For browser usage
if (typeof window !== 'undefined') {
    window.TelegramNotify = {
        sendTelegramMessage,
        formatApplicationMessage,
        notifyTelegramApplication,
        testTelegramNotification
    };
}