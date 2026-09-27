# РСК Гарант — сайт ремонтно-строительной компании

Современный, быстрый и SEO-ориентированный сайт для ремонтно-строительной компании РСК Гарант.

## Стек

- **Astro 5** (статическая генерация + минимальный server-side API)
- Vanilla CSS (собственный design system, без фреймворков)
- Vanilla JS (меню, модальные окна, формы, маска телефона)
- Native `<dialog>` для модальных окон
- WebP-изображения, `loading="lazy"`, `fetchpriority` для hero

JavaScript на клиенте — только один небольшой бандл (~7 КБ). Никаких React/Vue/Tailwind/jQuery.

## Быстрый старт

```bash
npm install
npm run dev          # http://localhost:4321
```

## Сборка и запуск

```bash
npm run build        # статический сайт + server bundle в dist/
npm start            # production-сервер (node ./dist/server/entry.mjs)
```

Проверка типов:

```bash
npm run check
```

## Структура проекта

```
src/
  components/        # Header, Footer, Hero-блоки, LeadForm, Faq, модалки и т.д.
  data/              # Единый источник данных: услуги, проекты, FAQ, контакты
  layouts/           # BaseLayout (мета, SEO, JSON-LD), ServiceLayout (шаблон лендинга)
  lib/               # server-side интеграция с Telegram-ботом
  pages/             # главная, 8 лендингов услуг, privacy, 404, api/lead, api/health
  scripts/           # единственный клиентский JS
  styles/            # design system (CSS custom properties)
public/
  images/            # hero, services, projects, og
  robots.txt
  sitemap.xml
  favicon.svg
```

## Страницы

| URL | Описание |
| --- | --- |
| `/` | Главная |
| `/remont-pod-klyuch/` | Ремонт под ключ |
| `/kosmeticheskiy-remont-komnaty/` | Косметический ремонт комнаты |
| `/remont-sanuzlov/` | Ремонт санузлов |
| `/plitochnye-raboty/` | Плиточные работы |
| `/okleyka-oboev/` | Оклейка обоев |
| `/ukladka-laminata/` | Укладка ламината |
| `/natyazhnye-potolki/` | Натяжные потолки |
| `/ustanovka-dverey/` | Установка дверей |
| `/privacy/` | Политика конфиденциальности |
| `/api/lead` | Прием заявок (server-side) |
| `/api/health` | Проверка работоспособности |

## Отзывы клиентов

Блок «Отзывы» на главной включается автоматически, как только в `src/data/reviews.ts`
появятся реальные отзывы. Пока массив пуст — блок скрыт.

**Важно:** не публикуйте вымышленные отзывы. Добавляйте только реальные отзывы,
полученные из переписки или чатов, с согласия клиента (см. комментарии в файле).

## Фотографии

Клик по фотографии открывает полноэкранный просмотр (lightbox) с кнопкой «До/После»
для парных фото. Курсор `zoom-in` подсказывает, что фото можно открыть.

## Интеграция с Telegram-ботом

Заявки отправляются в Telegram **строго со стороны сервера** (Bot API). Токен никогда
не попадает во фронтенд, HTML, git или публичные файлы.

### Настройка

1. Создайте бота через [@BotFather](https://t.me/BotFather) и получите токен вида
   `123456789:AA...`.
2. Узнайте идентификатор чата, куда должны падать заявки (`chat_id`):
   напишите боту первым, затем посмотрите свой ID у [@userinfobot](https://t.me/userinfobot),
   либо вызовите `getUpdates` для своего токена.
3. Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

4. Заполните переменные:

```bash
TELEGRAM_BOT_TOKEN=123456789:AA...
TELEGRAM_CHAT_ID=123456789
```

5. Пересоберите и запустите:

```bash
npm run build && npm start
```

6. Проверьте работоспособность:

```bash
curl http://localhost:4321/api/health   # {"status":"ok"}
```

7. Отправьте тестовую заявку с сайта и убедитесь, что сообщение пришло в чат Telegram.

### Формат сообщения

```
🆕 НОВАЯ ЗАЯВКА С САЙТА

Услуга: Плиточные работы
Имя: Иван
Телефон: +7 925 XXX XX XX
Комментарий: Нужно уложить плитку в ванной
Страница: /plitochnye-raboty/

Источник: сайт
UTM: utm_source=...
UTM: utm_medium=...

Дата: 25.09.2026, 23:53
```

### Поведение при ошибках

- Если Telegram недоступен — API возвращает `502`, пользователь видит понятное сообщение
  «Не удалось отправить заявку…» (заявка не теряется молча).
- Если бот не настроен — API возвращает `503` и пишет техническую ошибку в лог
  **без персональных данных**.
- Токен и `chat_id` не передаются в query-параметрах.

## Безопасность API `/api/lead`

- Проверка HTTP-метода и `Content-Type`
- Проверка `Origin` против `ALLOWED_ORIGINS`
- Лимит размера тела запроса (16 КБ)
- Rate limit: не более 5 заявок за 10 минут с одного IP
- Honeypot-поле (`website`) — заполненные заявки тихо отбрасываются
- Серверная валидация имени, телефона и обязательного согласия на обработку данных
- Санитизация входных строк (удаление управляющих символов, ограничение длины)
- Никакого логирования персональных данных в application log

## Аналитика

Счетчики не подключены — они включатся, когда появятся реальные ID.

Все события собираются в `window.RSK_TRACK(event, payload)`:
`lead_form_open`, `lead_form_submit`, `lead_form_success`, `phone_click`,
`service_card_click`, `portfolio_open`, `additional_service_open`.

Чтобы подключить Яндекс Метрику / GA, добавьте обработчик `window.rskOnTrack`
в `src/scripts/main.js` (секция «аналитика») и впишите ID счетчика.

## Перед production: заменить placeholders

Контакты и данные компании вынесены в `src/data/company.ts`:

| Плейсхолдер | Где |
| --- | --- |
| `[LEGAL_NAME]`, `[INN]`, `[OGRN]` | `src/data/company.ts`, `/privacy/` |
| `[ADDRESS]` | `src/data/company.ts`, футер, контакты, privacy |
| `[WORKING_HOURS]` | `src/data/company.ts` |
| `[PRIVACY_EMAIL]` | `src/data/company.ts`, privacy |
| `[PHONE]` | уже заполнен реальными номерами — проверьте актуальность |
| `[EMAIL]` | уже заполнен — проверьте актуальность |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | `.env` (не коммитить!) |
| `yandex-verification` | `src/layouts/BaseLayout.astro` |

## Изображения

Рекомендации по размерам и формату — в [IMAGE_GUIDE.md](./IMAGE_GUIDE.md).

Изображения из `public/images/` заменяются без изменения кода:
герой — `images/hero/`, карточки услуг — `images/services/`,
портфолио — `images/projects/`, примеры для доп. услуг — `images/additional/`.

## Быстрый деплой на Render.com (бесплатно)

Проект уже подготовлен под Render: файл `render.yaml` (blueprint), `.node-version`,
health-check на `/api/health`. Код менять не нужно — используется текущий Node-сервер.

### Шаги

1. **Зальите код на GitHub**
   ```bash
   git init
   git add .
   git commit -m "РСК Гарант — новый сайт"
   ```
   Создайте репозиторий на github.com и запушьте:
   ```bash
   git remote add origin https://github.com/ВАШ_ЛОГИН/rsk-garant.git
   git push -u origin main
   ```

2. **Создайте сервис на Render**
   - Зайдите на https://render.com и зарегистрируйтесь (можно через GitHub)
   - **New → Blueprint** и укажите ваш репозиторий
   - Render найдёт `render.yaml`, создаст веб-сервис и сам соберёт проект

3. **Задайте переменные окружения** (Dashboard сервиса → Environment)
   - `ALLOWED_ORIGINS` — обязательно добавьте URL вашего приложения:
     `https://rsk-garant.ru,https://rsk-garant.onrender.com`
     (без этого форма будет отклонять заявки проверкой Origin)
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` — когда будете готовы принимать заявки

4. **Откройте сайт** — ссылка вида `https://rsk-garant.onrender.com`

### Особенности бесплатного тарифа

- Сервис **засыпает после ~15 минут без трафика**; первый запрос после сна
  занимает 20–60 секунд (страница загрузится, просто подождите)
- Без `TELEGRAM_BOT_TOKEN` форма покажет честное сообщение об ошибке отправки —
  это ожидаемо до настройки бота
- Для теста можно отправлять заявки, только когда настроен бот:
  тогда они придут в чат как на проде

### Production

Для боевого запуска: смените план с free на paid, привяжите домен
`rsk-garant.ru` (вкладка Settings → Custom Domains), включите HTTPS,
обновите `ALLOWED_ORIGINS` на продакшен-домен.

## Деплой на любой VPS

Проект собирается в `dist/` и запускается как Node-сервер:

```bash
npm install
npm run build
node ./dist/server/entry.mjs
```

Переменные окружения (HOST, PORT, TELEGRAM_*, ALLOWED_ORIGINS) передаются через окружение/систему управления секретами.

Можно развернуть на любом VPS или платформе с поддержкой Node (Vercel, Railway, Render, Яндекс Облако и т.д.).

Для VPS с nginx — проксировать домен на порт 4321, включить HTTPS (certbot), и указать
`ALLOWED_ORIGINS=https://rsk-garant.ru`.

## SEO

- У каждой страницы уникальные `title`, `description`, `canonical`, OG
- Один `H1` на страницу, логичная структура `H2/H3`
- JSON-LD: `LocalBusiness`, `WebSite`, `Service`, `BreadcrumbList`
- `robots.txt` + `sitemap.xml`
- Адресная структура `/remont-pod-klyuch/` и т.д.
- Весь контент лендингов уникален (данные в `src/data/services.ts`)