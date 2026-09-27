import type { APIRoute } from 'astro';
import { loadLocalEnv } from '../../lib/env';
import { sendToTelegram, isTelegramConfigured } from '../../lib/telegram';

loadLocalEnv();

export const prerender = false;

const MAX_BODY_BYTES = 16 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

const rateLimit = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

function allowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;

  const site = (process.env.SITE as string | undefined) || 'https://rsk-garant.ru';
  const envOrigins = (process.env.ALLOWED_ORIGINS as string | undefined)?.split(',').map((s) => s.trim()).filter(Boolean) || [];

  const allowed = new Set([
    site,
    'http://localhost:4321',
    'http://127.0.0.1:4321',
    'http://localhost:3000',
    ...envOrigins,
  ]);

  return allowed.has(origin);
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimit.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    rateLimit.set(ip, hits);
    return false;
  }
  hits.push(now);
  rateLimit.set(ip, hits);
  return true;
}

function clean(value: unknown, maxLen: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLen);
}

interface LeadPayload {
  name?: string;
  phone?: string;
  service?: string;
  comment?: string;
  consent?: boolean;
  website?: string;
  page?: string;
  utm?: Record<string, string>;
}

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ status: 'error', error: 'method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!allowedOrigin(request)) {
    return new Response(JSON.stringify({ status: 'error', error: 'forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return new Response(JSON.stringify({ status: 'error', error: 'unsupported media type' }), {
      status: 415,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ status: 'error', error: 'too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return new Response(JSON.stringify({ status: 'error', error: 'payload too large' }), {
      status: 413,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return new Response(JSON.stringify({ status: 'error', error: 'invalid json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Honeypot: если поле заполнено — тихо принимаем, но не отправляем.
  if (payload.website && payload.website.length > 0) {
    return new Response(JSON.stringify({ status: 'ok' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = clean(payload.name, 120);
  const phone = clean(payload.phone, 40);
  const service = clean(payload.service, 200);
  const comment = clean(payload.comment, 2000);
  const page = clean(payload.page, 300);
  const consent = payload.consent === true;

  if (name.length < 2) {
    return new Response(JSON.stringify({ status: 'error', error: 'invalid name' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 11 || phoneDigits.length > 15) {
    return new Response(JSON.stringify({ status: 'error', error: 'invalid phone' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!consent) {
    return new Response(JSON.stringify({ status: 'error', error: 'consent required' }), {
      status: 422,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utmLines = utmKeys
    .map((k) => (payload.utm?.[k] ? `${k}=${clean(payload.utm[k], 500)}` : ''))
    .filter(Boolean);

  const date = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    dateStyle: 'short',
    timeStyle: 'short',
  });

  const message = [
    '🆕 НОВАЯ ЗАЯВКА С САЙТА',
    '',
    `Услуга: ${service || 'Не указана'}`,
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    comment ? `Комментарий: ${comment}` : '',
    page ? `Страница: ${page}` : '',
    '',
    'Источник: сайт',
    ...(utmLines.length ? utmLines.map((l) => `UTM: ${l}`) : []),
    '',
    `Дата: ${date}`,
  ]
    .filter((line) => line !== '')
    .join('\n');

  if (!isTelegramConfigured()) {
    console.error('[lead] Telegram is not configured. Lead skipped.');
    return new Response(JSON.stringify({ status: 'error', error: 'delivery not configured' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const chatId = (process.env.TELEGRAM_CHAT_ID as string)?.trim();
  const result = await sendToTelegram({ chatId, text: message });

  if (!result.ok) {
    return new Response(JSON.stringify({ status: 'error', error: 'delivery failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};