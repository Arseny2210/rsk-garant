/**
 * Загрузка локального .env в process.env.
 * Нужно, чтобы API-роуты видели секреты независимо от способа запуска
 * (astro dev, node entry.mjs, npm start). На проде (Render и т.п.)
 * переменные приходят из окружения платформы, .env отсутствует — молча пропускаем.
 */
export function loadLocalEnv(): void {
  try {
    if (typeof process.loadEnvFile === 'function') {
      process.loadEnvFile('.env');
    }
  } catch {
    /* .env отсутствует — используем системное окружение */
  }
}