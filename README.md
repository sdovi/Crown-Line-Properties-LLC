# CROWN LINE PROPERTY - Премиум сайт недвижимости

Элитный сайт для продажи и аренды недвижимости в Дубае с темной темой и золотыми акцентами.

## Технологии

- **Next.js 14** - React фреймворк с App Router
- **TypeScript** - Типобезопасность
- **Tailwind CSS** - Utility-first CSS
- **GSAP** - Мощные анимации
- **Lenis** - Плавный скролл с инерцией
- **React Hook Form** - Управление формами
- **Zod** - Валидация схем

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env.local` и добавьте переменные окружения:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

3. Запустите dev сервер:
```bash
npm run dev
```

4. Откройте [http://localhost:3000](http://localhost:3000)

## Настройка Telegram бота

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Создайте группу в Telegram и добавьте бота
4. Получите Chat ID группы (можно через [@userinfobot](https://t.me/userinfobot) или API)
5. Добавьте токен и Chat ID в `.env.local`

## Структура проекта

```
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── globals.css     # Глобальные стили
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Главная страница
├── components/         # React компоненты
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── PropertyCategories.tsx
│   └── ...
└── public/            # Статические файлы
```

## Основные функции

- ✅ Темная тема с золотыми акцентами
- ✅ Плавный скролл с инерцией (Lenis)
- ✅ Анимации при скролле (GSAP)
- ✅ Фильтрация объектов недвижимости
- ✅ Формы с отправкой в Telegram
- ✅ Адаптивный дизайн
- ✅ SEO оптимизация

## Сборка для продакшена

```bash
npm run build
npm start
```

## Лицензия

© 2024 CROWN LINE PROPERTY. Все права защищены.

