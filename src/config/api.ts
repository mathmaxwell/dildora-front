// Базовый адрес backend API.
// По умолчанию — боевой сервер; переопределяется через VITE_API_URL в .env
// (например, http://localhost:8080 для локальной разработки).
// Важно: переменные Vite подхватываются только при старте dev-сервера/сборки,
// поэтому дефолт держим прямо в коде, чтобы запрос всегда уходил на сервер.
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://194.163.144.40:8080'

// Полный URL до эндпоинта v1.
export const apiUrl = (path: string): string =>
  `${API_URL}/api/v1/${path.replace(/^\/+/, '')}`
