const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

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
    const response = await axios.post(telegramApiUrl, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });
    
    if (response.data.ok) {
      console.log('Telegram message sent successfully:', response.data);
      return response.data;
    } else {
      throw new Error(`Telegram API error: ${response.data.description}`);
    }
    
  } catch (error) {
    if (error.response) {
      console.error('Telegram API responded with error:', error.response.data);
      throw new Error(`Telegram API error: ${error.response.data.description || error.response.status}`);
    } else if (error.request) {
      console.error('No response from Telegram API:', error.message);
      throw new Error('Failed to reach Telegram API');
    } else {
      console.error('Error setting up Telegram request:', error.message);
      throw new Error(`Request setup error: ${error.message}`);
    }
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
  
  // Add CRM link (if you have CRM system)
  message += `\n🔗 *Управление:* [Открыть в CRM](https://angelconnect-49d81.firebaseapp.com/crm.html)`;
  
  return message;
}

/**
 * HTTP function for receiving application notifications
 * This can be called from frontend after saving to Firestore
 */
exports.notifyApplication = functions.https.onRequest(async (req, res) => {
  // Enable CORS for Angel Connect domain
  res.set('Access-Control-Allow-Origin', 'https://angelconnect-49d81.firebaseapp.com');
  res.set('Access-Control-Allow-Methods', 'GET, POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  
  try {
    const { applicationId, applicationData } = req.body;
    
    if (!applicationId || !applicationData) {
      res.status(400).json({ 
        success: false, 
        error: 'Missing applicationId or applicationData' 
      });
      return;
    }
    
    console.log('Received application notification:', applicationId, applicationData);
    
    // Format and send message
    const message = formatApplicationMessage(applicationData, applicationId);
    await sendTelegramMessage(message);
    
    res.status(200).json({ 
      success: true, 
      message: 'Notification sent successfully' 
    });
    
  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * HTTP function for testing Telegram integration
 */
exports.testTelegramNotification = functions.https.onRequest(async (req, res) => {
  try {
    const testMessage = `🧪 *ТЕСТ УВЕДОМЛЕНИЯ*\n\nТест интеграции Angel Connect с Telegram.\nВремя: ${new Date().toLocaleString('ru-RU')}`;
    
    await sendTelegramMessage(testMessage);
    
    res.status(200).json({ 
      success: true, 
      message: 'Test notification sent successfully' 
    });
    
  } catch (error) {
    console.error('Test notification failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});