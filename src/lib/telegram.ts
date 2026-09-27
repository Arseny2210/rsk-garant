/**
 * Отправка сообщений в Telegram через Bot API.
 * Серверный модуль — никогда не используется во frontend.
 */

export interface TelegramMessage {
  chatId: string;
  text: string;
}

interface TelegramResponse {
  ok: boolean;
  error?: string;
}

function getConfig() {
  const token = (process.env.TELEGRAM_BOT_TOKEN as string | undefined)?.trim();
  const chatId = (process.env.TELEGRAM_CHAT_ID as string | undefined)?.trim();
  return { token, chatId };
}

export function isTelegramConfigured(): boolean {
  const { token, chatId } = getConfig();
  return Boolean(token && chatId);
}

/**
 * Отправляет текст в указанный чат Telegram через sendMessage.
 */
export async function sendToTelegram({
  chatId,
  text,
}: TelegramMessage): Promise<TelegramResponse> {
  const { token } = getConfig();

  if (!token) {
    return { ok: false, error: 'Telegram bot token is not configured' };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      return { ok: false, error: `Telegram API responded with status ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'network error';
    console.error('[telegram] send failed:', message);
    return { ok: false, error: 'Telegram API unreachable' };
  }
}