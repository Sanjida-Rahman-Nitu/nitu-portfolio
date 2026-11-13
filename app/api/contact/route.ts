import { NextResponse } from 'next/server';

/**
 * POST /api/contact — receives the contact form and emails it to you via Resend.
 * Needs RESEND_API_KEY and CONTACT_TO_EMAIL (see .env.example).
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

/* ---------- spam protection ----------
 * 1. Honeypot: a hidden field people never see; bots fill it.
 * 2. Time trap: the form reports how long it was open; bots submit within a second or two.
 * 3. Origin check: the request must come from this website, not a script posting directly.
 * 4. Link limit: spam is usually stuffed with links.
 * 5. Rate limit: at most a few messages per visitor in a short time (best effort; resets on redeploy).
 * Spam is dropped silently (the bot sees "success") so it gets no hint to adapt.
 */
const MIN_FILL_MS = 3000;
const MAX_LINKS = 2;
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear(); // keep memory bounded
  return hits.length > RATE_LIMIT;
}

function countLinks(s: string): number {
  return (s.match(/https?:\/\/|www\./gi) ?? []).length;
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function dropSpam(reason: string) {
  console.warn(`contact: dropped as spam (${reason})`);
  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (clean(body.hp_x7q, 200)) return dropSpam('honeypot field was filled');
  if (!sameOrigin(request)) return dropSpam('not sent from this website');
  const elapsed = Number(body.t);
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return dropSpam('form submitted too fast');

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many messages in a short time. Please try again later.' }, { status: 429 });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);

  if (countLinks(name) > 0) return dropSpam('link in name');
  if (countLinks(message) > MAX_LINKS) {
    return NextResponse.json({ error: `Please include at most ${MAX_LINKS} links in your message.` }, { status: 400 });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Please fill in your name, email and message.' }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  console.log('contact: message received');
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return NextResponse.json(
      { error: 'The contact form is not set up yet. Please use the email address shown on this page.' },
      { status: 503 },
    );
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Portfolio <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `[Portfolio] Message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });

  if (!res.ok) {
    const raw = await res.text().catch(() => '');
    console.error('Resend error', res.status, raw);
    let reason = '';
    try {
      reason = (JSON.parse(raw) as { message?: string }).message ?? '';
    } catch {
      /* not JSON */
    }
    return NextResponse.json(
      {
        error: 'Your message could not be sent. Please email me directly.',
        // Resend's own explanation (e.g. wrong API key, or sending to an address the account does not own)
        detail: reason ? `Email service said: ${reason}` : `Email service error ${res.status}`,
      },
      { status: 502 },
    );
  }
  const sent = (await res.json().catch(() => ({}))) as { id?: string };
  console.log('contact: sent via Resend, id =', sent.id ?? '(none)');
  return NextResponse.json({ ok: true, id: sent.id });
}

/**
 * GET /api/contact — setup check. Open this URL in a browser to see whether the
 * environment variables reached the deployment. It never shows the values themselves.
 */
export async function GET() {
  const key = process.env.RESEND_API_KEY ?? '';
  const to = process.env.CONTACT_TO_EMAIL ?? '';
  return NextResponse.json({
    RESEND_API_KEY: key ? (key.startsWith('re_') ? 'set' : 'set, but does not start with re_ (check the value)') : 'MISSING',
    CONTACT_TO_EMAIL: to ? (EMAIL_RE.test(to) ? 'set' : 'set, but not a valid email') : 'MISSING',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'MISSING',
    ready: Boolean(key && to),
  });
}
