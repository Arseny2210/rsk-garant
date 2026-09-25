/**
 * Отправка сообщений в MAX.
 * Серверный модуль — никогда не используется во frontend.
 */

export interface MaxMessage {
  chatId: string;
  text: string;
}

interface MaxResponse {
  ok: boolean;
  error?: string;
}

function getConfig() {
  const base =
    (process.env.MAX_API_BASE as string | undefined)?.replace(/\/+$/, '') ||
    (process.env.MAX_BOT_URL as string | undefined)?.replace(/\/+$/, '') ||
    'https://platform-api2.max.ru';
  const token = (process.env.MAX_BOT_TOKEN as string | undefined)?.trim();
  const chatId = (process.env.MAX_CHAT_ID as string | undefined)?.trim();

  return { base, token, chatId };
}

export function isMaxConfigured(): boolean {
  const { token, chatId } = getConfig();
  return Boolean(token && chatId);
}

/**
 * Отправляет текст в указанный чат MAX.
 */
export async function sendToMax({ chatId, text }: MaxMessage): Promise<MaxResponse> {
  const { base, token } = getConfig();

  if (!token) {
    return { ok: false, error: 'MAX bot token is not configured' };
  }

  const url = `${base}/messages`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      // Технический ответ MAX может содержать чувствительные данные — не логируем тело целиком.
      await res.text().catch(() => '');
      return { ok: false, error: `MAX API responded with status ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'network error';
    console.error('[max] send failed:', message);
    return { ok: false, error: 'MAX API unreachable' };
  }
}