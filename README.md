# DreamTales2

Мобильное веб-приложение **«Сказочный мир»** — каталог детских сказок с озвучкой, избранным и детским режимом.

[![CI](https://github.com/gewog/DreamTales2/actions/workflows/ci.yml/badge.svg)](https://github.com/gewog/DreamTales2/actions/workflows/ci.yml)

## Цель проекта

DreamTales2 — адаптированное под мобильные устройства веб-приложение для чтения и прослушивания детских сказок. Родители могут выбирать сказки по возрасту и категории, включать голосовое чтение (Web Speech API, русский язык), сохранять избранное и блокировать интерфейс в детском режиме.

**Реализовано:**

- каталог сказок с фильтрацией по возрасту и категориям;
- «сказка дня» с ротацией featured-сказок;
- страница чтения с TTS и регулировкой скорости;
- избранное (localStorage);
- детский lock-режим;
- админ-панель с защитой по секретному ключу;
- REST API + PostgreSQL.

**В планах:** PWA offline, история чтения, родительский таймер, редактирование сказок в UI. Подробнее — [docs/SPEC.md](./docs/SPEC.md).

## Стек

| Слой | Технологии |
| --- | --- |
| Монорепозиторий | pnpm workspaces, TypeScript 5.9, Node.js 24 |
| Frontend | React 19, Vite 7, Tailwind CSS 4, Framer Motion, Radix UI, TanStack Query |
| Backend | Express 5, Pino |
| База данных | PostgreSQL, Drizzle ORM |
| API | OpenAPI 3.1, Orval, Zod |
| CI | GitHub Actions |

### Структура

```text
artifacts/
  skazki/       — frontend (PWA-ready responsive web)
  api-server/   — REST API
lib/
  db/           — Drizzle schema
  api-spec/     — OpenAPI + codegen
  api-client-react/
  api-zod/
scripts/        — утилиты (seed и др.)
```

## Быстрый старт

### Требования

- Node.js 24+
- [pnpm](https://pnpm.io/) 9+
- PostgreSQL

### 1. Установка

```bash
git clone https://github.com/gewog/DreamTales2.git
cd DreamTales2
pnpm install
cp .env.example .env
# отредактируйте .env — как минимум DATABASE_URL и ADMIN_API_KEY
```

### 2. База данных

```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/scripts run seed
```

Seed добавит категории и две демо-сказки, если таблицы пустые.

### 3. Запуск

**API** (терминал 1):

```powershell
$env:DATABASE_URL = "postgresql://user:password@localhost:5432/dreamtales2"
$env:PORT = "8080"
$env:ADMIN_API_KEY = "your-secret-key"
pnpm --filter @workspace/api-server run dev
```

**Frontend** (терминал 2):

```powershell
$env:PORT = "5173"
$env:BASE_PATH = "/"
pnpm --filter @workspace/skazki run dev
```

- Приложение: http://localhost:5173  
- API: http://localhost:8080/api  
- Health check: http://localhost:8080/api/healthz  

### 4. Админ-панель

1. Откройте `/admin`.
2. Введите значение `ADMIN_API_KEY` с сервера.
3. Ключ сохраняется в `sessionStorage` текущей вкладки.

Без ключа операции создания и удаления сказок возвращают `401 Unauthorized`.

## Сборка

```bash
# проверка типов + сборка всех пакетов
pnpm run build

# production API
pnpm --filter @workspace/api-server run build
pnpm --filter @workspace/api-server run start

# production frontend
pnpm --filter @workspace/skazki run build
pnpm --filter @workspace/skazki run serve
```

Для сборки frontend и CI обязательны переменные `PORT` и `BASE_PATH`.

## Переменные окружения

| Переменная | Обязательна | Описание |
| --- | --- | --- |
| `DATABASE_URL` | да | PostgreSQL connection string |
| `PORT` | да | Порт API или Vite dev server |
| `BASE_PATH` | да (frontend) | Базовый путь приложения, обычно `/` |
| `ADMIN_API_KEY` | да (для админки) | Секрет для POST/PUT/DELETE `/api/tales` |
| `CORS_ORIGIN` | нет | Разрешённые origins через запятую |

Шаблон — в [.env.example](./.env.example).

## Безопасность

- Мутации API защищены Bearer-токеном (`ADMIN_API_KEY`).
- Не коммитьте `.env` — он в `.gitignore`.
- Для production задайте `CORS_ORIGIN` на домен frontend.
- Админ-ключ в браузере — компромисс для MVP; для production рассмотрите полноценную авторизацию.

## Лицензия

[MIT](./LICENSE)

## Дополнительно

- Архитектура monorepo: [replit.md](./replit.md)
- Исходное ТЗ: [docs/SPEC.md](./docs/SPEC.md)
