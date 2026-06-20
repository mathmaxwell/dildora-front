// Базовый адрес backend API.
//
// По умолчанию пусто => запросы идут на ТОТ ЖЕ origin (относительный путь
// /api/v1/...). В проде их проксирует Netlify на HTTP-бэкенд (см. netlify.toml),
// в dev — прокси Vite (см. vite.config.ts). Так браузер всегда обращается
// к своему origin и нет проблемы mixed content (HTTPS-страница -> HTTP-запрос).
//
// Можно переопределить через VITE_API_URL (например, прямой адрес сервера),
// но тогда домен бэкенда должен быть HTTPS, иначе браузер заблокирует запрос.
export const API_URL = import.meta.env.VITE_API_URL ?? ''

// Полный URL до эндпоинта v1.
export const apiUrl = (path: string): string =>
  `${API_URL}/api/v1/${path.replace(/^\/+/, '')}`
