# Angel Connect Website

Первая экосистема для стартапов в Центральной Азии

## Описание проекта

Angel Connect - это современный веб-сайт для холдинговой структуры, которая включает хакатоны, инкубатор/акселератор, ангельский клуб инвесторов и развитие в фонд. Сайт создан для привлечения качественных ангел-инвесторов, стартапов и партнеров.

## Технологический стек

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Build Tool**: Vite
- **Backend**: Firebase (Firestore, Storage, Hosting, Functions)
- **Authentication**: Firebase Auth с Google OAuth
- **CRM System**: Встроенная система управления контентом
- **Deployment**: Firebase Hosting (Multi-site)

## Структура проекта

```
angel-connect-site/
├── index.html              # Главная страница
├── angel-connect-site.css  # Основные стили
├── angel-connect-site.js   # JavaScript логика
├── translations.js         # Мультиязычность (RU/UZ/EN)
├── crm.html               # CRM система
├── crm-styles.css         # Стили CRM
├── crm-app.js             # JavaScript CRM
├── vite.crm.config.js     # Конфигурация Vite для CRM
├── photo/                 # Изображения и медиа
├── firebase.json          # Конфигурация Firebase
├── firebase-config.js     # Конфигурация Firebase клиента
├── firestore.rules        # Правила безопасности Firestore
├── storage.rules          # Правила безопасности Storage
├── firestore.indexes.json # Индексы базы данных
├── firebase-structure.md  # Документация структуры БД
├── CRM-README.md          # Документация CRM системы
└── package.json          # Зависимости проекта
```

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка Firebase

1. Скопируйте `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Заполните переменные окружения в `.env` файле

3. Установите Firebase CLI:
```bash
npm install -g firebase-tools
```

4. Войдите в Firebase:
```bash
firebase login
```

5. Инициализируйте проект:
```bash
firebase use angelconnect-49d81
```

### 3. Разработка

**Основной сайт:**
```bash
npm run dev
```
Сайт будет доступен по адресу: http://localhost:5173

**CRM система:**
```bash
npm run dev:crm
```
CRM будет доступна по адресу: http://localhost:3001

### 4. Работа с Firebase Emulators

Для локальной разработки с эмуляторами Firebase:
```bash
npm run emulators
```

Это запустит:
- Firestore Emulator (port 8080)
- Storage Emulator (port 9199)
- Hosting Emulator (port 5000)
- Firebase UI (http://localhost:4000)

## Деплой

### Полный деплой (сайт + CRM)
```bash
npm run deploy
```

### Только основной сайт
```bash
npm run deploy:main
```

### Только CRM система
```bash
npm run deploy:crm
```

### Только база данных и правила
```bash
firebase deploy --only firestore,storage
```

### Настройка custom domains

```bash
# Настройка hosting targets
firebase target:apply hosting main angelconnect-49d81
firebase target:apply hosting crm angelconnect-crm

# В Firebase Console добавьте:
# - angelconnect.uz для основного сайта
# - crm.angelconnect.uz для CRM системы
```

## Структура Firebase

### Firestore Collections

- `startups` - Портфолио стартапов
- `investors` - Ангел-инвесторы
- `team` - Команда Angel Connect
- `events` - Мероприятия и события
- `blog` - Блог и новости
- `applications` - Заявки от стартапов и инвесторов
- `partners` - Партнеры экосистемы
- `mentors` - Менторы и советники
- `newsletter` - Подписчики рассылки
- `event_registrations` - Регистрации на мероприятия

### Storage Structure

```
/startups/{startupId}/     # Документы стартапов
/team/{memberId}/          # Фотографии команды
/events/{eventId}/         # Материалы мероприятий
/blog/{postId}/           # Изображения для блога
/partners/{partnerId}/     # Логотипы партнеров
/mentors/{mentorId}/      # Фотографии менторов
/investors/{investorId}/   # Документы инвесторов
/uploads/temp/            # Временные загрузки
```

## Основные функции

### Для стартапов
- Подача заявок в акселератор
- Просмотр портфолио компаний
- Регистрация на мероприятия
- Доступ к ресурсам и материалам

### Для инвесторов
- Регистрация в ангельском клубе
- Просмотр deal room (после одобрения)
- Участие в Demo Day
- Доступ к аналитике и отчетам

### Для партнеров
- Информация о партнерских программах
- Совместные мероприятия
- Корпоративные хакатоны

## Мультиязычность

Сайт поддерживает три языка:
- 🇷🇺 Русский
- 🇺🇿 O'zbek
- 🇺🇸 English

Переключение языков происходит через файл `translations.js`.

## CRM Система

Angel Connect включает в себя полнофункциональную CRM систему для управления контентом сайта:

### Основные возможности CRM

- 🔐 **Авторизация через Google** - безопасный вход для администраторов
- 📊 **Dashboard** - статистика и ключевые метрики в реальном времени
- 🏢 **Управление стартапами** - добавление, редактирование, фильтрация
- 👥 **База инвесторов** - управление ангел-инвесторами и их предпочтениями
- 📅 **Мероприятия** - создание и управление событиями
- 📋 **Заявки** - обработка заявок от стартапов и инвесторов
- 📝 **Блог** - система управления контентом для статей
- 📈 **Аналитика** - отчёты и статистика использования
- ⚙️ **Настройки** - управление пользователями и конфигурацией

### Доступ к CRM

- **URL**: https://crm.angelconnect.uz (после настройки DNS)
- **Локально**: http://localhost:3001 (npm run dev:crm)
- **Стилистика**: Полностью в стиле Angel Connect
- **Адаптивность**: Поддержка мобильных устройств

### Документация CRM

Подробная документация по CRM системе находится в файле [CRM-README.md](./CRM-README.md).

### Безопасность CRM

- Доступ только для авторизованных пользователей
- Интеграция с Firebase Security Rules
- Контроль прав доступа на уровне коллекций
- Логирование всех действий администраторов

## Команда

- **Артем Панферов** - Co-founder & CPO
- **Виталий Тарасюк** - Co-founder & CTO
- **Сирожиддин Аслонов** - Co-founder & Business Development
- **Артем Стрельченок** - Strategic Advisor

## Контакты

- **Website**: https://angelconnect.uz
- **Telegram**: @networkangelconnect
- **LinkedIn**: https://linkedin.com/company/angelconnect

## Лицензия

MIT License - смотрите файл LICENSE для подробностей.

---

💙 Made with love by Angel Connect Team