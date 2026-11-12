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

  // Spam bots fill the hidden honeypot field; pretend success and drop it.
  if (clean(body.hp_x7q, 200)) {
    console.warn('contact: dropped as spam (honeypot field was filled)');
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 200);
  const message = clean(body.message, 5000);

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
      subject: `Portfolio message from ${name}`,
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
