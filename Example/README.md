# AI Hackathon Samarkand - Landing Page

Современная посадочная страница для AI Хакатона в Самарканде, созданная в стилистике Angel Connect с использованием цветовой палитры и современных технологий.

## 🚀 Особенности

- **Современный дизайн** с градиентами Angel Connect
- **Полная мультиязычность** (RU/UZ/EN) 
- **Адаптивный дизайн** для всех устройств
- **Интерактивные элементы**: particles.js, AOS анимации, countdown таймеры
- **Регистрационная форма** с валидацией и Firebase интеграцией
- **SEO оптимизация** и accessibility

## 📁 Структура файлов

```
/Example/
├── samarkand-hackathon.html      # Основная HTML страница
├── hackathon-styles.css          # Стили с адаптацией цветовой палитры
├── hackathon-script.js           # JavaScript логика и интерактивность
├── translations-hackathon.js     # Переводы на 3 языка (RU/UZ/EN)
├── firebase-config.js            # Firebase интеграция для форм
├── CLAUDE.md                     # Техническое задание
└── README.md                     # Эта документация
```

## 🎨 Дизайн-система

### Цветовая палитра
- **Основной синий**: #0066FF (Angel Connect)
- **Градиент хакатона**: #0066FF → #8B5CF6 → #A855F7
- **Текст**: #1A1A1A (основной), #6B7280 (вторичный)
- **Фон**: #FFFFFF, #F8FAFF (светлый)

### Шрифты
- **Основной**: Inter (Google Fonts)
- **Заголовки**: Poppins (Google Fonts)

## 🛠 Технологии

### Основные
- **HTML5** - семантическая разметка
- **CSS3** - современные стили, CSS Grid, Flexbox
- **Vanilla JavaScript** - интерактивность без фреймворков

### Библиотеки
- **Particles.js** - фоновые анимации
- **AOS** - анимации при скролле
- **Lucide** - иконки
- **Day.js** - работа с датами для countdown

### Интеграции
- **Firebase** - хранение заявок (опционально)
- **Google Fonts** - типографика

## 🚀 Быстрый старт

### 1. Локальная разработка

Просто откройте `samarkand-hackathon.html` в браузере:

```bash
# Перейдите в директорию Example
cd /path/to/Example

# Откройте файл в браузере
open samarkand-hackathon.html
# или
python -m http.server 8000  # для Python 3
# или
php -S localhost:8000       # для PHP
```

### 2. С веб-сервером

```bash
# Используйте любой локальный сервер
npx serve .
# или
python -m http.server 8000
```

Откройте http://localhost:8000/samarkand-hackathon.html

## ⚙️ Настройка Firebase (опционально)

### 1. Создайте проект Firebase
1. Перейдите в [Firebase Console](https://console.firebase.google.com)
2. Создайте новый проект
3. Включите Firestore Database

### 2. Настройте конфигурацию
Отредактируйте `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};
```

### 3. Настройте Firestore правила

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Публичная запись в коллекцию заявок
    match /samarkand_hackathon_applications/{document} {
      allow create: if true;
      allow read, update, delete: if false; // Только для админов
    }
    
    // Подписки на newsletter
    match /newsletter_subscriptions/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

## 🌍 Мультиязычность

### Поддерживаемые языки
- **Русский (ru)** - основной
- **Узбекский (uz)** - локальный
- **Английский (en)** - международный

### Добавление переводов
Редактируйте `translations-hackathon.js`:

```javascript
window.hackathonTranslations = {
    ru: {
        nav: {
            about: "О хакатоне"
        }
    },
    uz: {
        nav: {
            about: "Hackathon haqida"
        }
    },
    en: {
        nav: {
            about: "About"
        }
    }
};
```

### Использование в HTML
```html
<span data-translate="nav.about">О хакатоне</span>
```

## 📱 Адаптивность

### Брейкпоинты
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Тестирование
1. Откройте Developer Tools (F12)
2. Переключитесь в режим Device Emulation
3. Протестируйте различные размеры экранов

## 🎯 Основные функции

### 1. Countdown Таймеры
- До окончания регистрации (15 июля 2025)
- До начала хакатона (6 августа 2025)

### 2. Регистрационная форма
- 4-шаговый мастер
- Валидация в реальном времени
- Сохранение в Firebase
- Поддержка команд и индивидуальных участников

### 3. Интерактивные элементы
- Particles.js анимация в Hero секции
- AOS анимации при скролле
- Hover эффекты на карточках
- Мобильное меню

### 4. FAQ секция
- Аккордеон с ответами
- Анимированные иконки

## 🔧 Кастомизация

### Изменение цветов
Отредактируйте CSS переменные в `hackathon-styles.css`:

```css
:root {
    --primary-blue: #0066FF;
    --hackathon-purple: #8B5CF6;
    --hackathon-gradient: linear-gradient(135deg, #0066FF 0%, #8B5CF6 100%);
}
```

### Изменение дат
Обновите даты в `hackathon-script.js`:

```javascript
this.registrationDeadline = new Date('2025-07-15T23:59:59+05:00');
this.hackathonStart = new Date('2025-08-06T09:00:00+05:00');
```

### Изменение контента
Отредактируйте переводы в `translations-hackathon.js` или напрямую в HTML.

## 📊 Аналитика

### Google Analytics (рекомендуется)
Добавьте в `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Facebook Pixel (опционально)
```html
<!-- Facebook Pixel -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
```

## 🚀 Деплой

### 1. Firebase Hosting
```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Войдите в аккаунт
firebase login

# Инициализируйте проект
firebase init hosting

# Деплой
firebase deploy --only hosting
```

### 2. Netlify
1. Создайте аккаунт на [Netlify](https://netlify.com)
2. Подключите Git репозиторий
3. Настройте автодеплой

### 3. GitHub Pages
1. Загрузите файлы в GitHub репозиторий
2. Включите GitHub Pages в настройках
3. Выберите ветку для деплоя

## 🧪 Тестирование

### Браузеры
- ✅ Chrome (последние 2 версии)
- ✅ Firefox (последние 2 версии)  
- ✅ Safari (последние 2 версии)
- ✅ Edge (последние 2 версии)

### Устройства
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (768x1024, 1024x768)
- ✅ Mobile (375x667, 414x896, 360x640)

### Функциональность
- ✅ Переключение языков
- ✅ Countdown таймеры
- ✅ Форма регистрации
- ✅ Мобильное меню
- ✅ FAQ аккордеон
- ✅ Плавная прокрутка

## 📈 Performance

### Оптимизации
- Минификация CSS/JS при деплое
- Lazy loading изображений
- Оптимизированные шрифты с `font-display: swap`
- CDN для библиотек

### Рекомендации
1. Сжимайте изображения (WebP формат)
2. Используйте CDN для статических ресурсов
3. Включите GZIP сжатие на сервере
4. Настройте кеширование браузера

## 🔒 Безопасность

### Checklist
- ✅ HTTPS обязательно для production
- ✅ Firebase Security Rules настроены
- ✅ Валидация форм на клиенте и сервере
- ✅ Защита от XSS атак
- ✅ Конфиденциальность пользовательских данных

## 🐛 Troubleshooting

### Часто встречающиеся проблемы

**1. Particles.js не загружается**
```javascript
// Проверьте подключение библиотеки
if (typeof particlesJS === 'undefined') {
    console.error('Particles.js not loaded');
}
```

**2. Firebase не инициализируется**
```javascript
// Проверьте конфигурацию
console.log('Firebase config:', firebaseConfig);
```

**3. Переводы не работают**
```javascript
// Проверьте загрузку переводов
console.log('Translations:', window.hackathonTranslations);
```

## 📞 Поддержка

### Контакты
- **Telegram**: @networkangelconnect
- **Email**: info@angelconnect.uz

### Документация
- [Angel Connect](https://angelconnect.uz)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Particles.js](https://vincentgarreau.com/particles.js/)

## 📄 Лицензия

© 2025 Angel Connect. Все права защищены.

---

**Создано с ❤️ для AI Хакатона в Самарканде**