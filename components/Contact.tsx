'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { profile } from '@/data/content';

type Status = { kind: 'idle' | 'sending' | 'sent' | 'error'; message?: string };

/** Contact section: a form that posts to /api/contact, plus direct contact details. */
export default function Contact() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const openedAt = useRef<number>(0);
  // The email address is only written into the page after it loads in a real browser,
  // so simple scraper bots that read the raw HTML never see it.
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    openedAt.current = Date.now();
    setShowEmail(true);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), t: openedAt.current ? Date.now() - openedAt.current : 0 };
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; detail?: string };
      if (!res.ok) {
        const msg = json.error || 'Something went wrong. Please email me directly.';
        throw new Error(json.detail ? `${msg} (${json.detail})` : msg);
      }
      form.reset();
      setStatus({ kind: 'sent', message: 'Thank you. Your message has been sent, and I will reply soon.' });
    } catch (err) {
      setStatus({ kind: 'error', message: err instanceof Error ? err.message : 'Please email me directly.' });
    }
  }

  return (
    <section id="contact" className="contact">
      <p className="label">Signal received?</p>
      <h2>
        Let&apos;s work
        <br />
        together
      </h2>

      <div className="contact-grid">
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input id="contact-name" name="name" type="text" required maxLength={100} autoComplete="name" />
          </div>
          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" name="message" required rows={5} maxLength={5000} />
          </div>
          {/* Honeypot: hidden from people, filled in by spam bots. The name is deliberately
              one that browser autofill never recognises (autofill fills fields like "company"). */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="contact-hp">Leave this field empty</label>
            <input id="contact-hp" name="hp_x7q" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>
          <button className="btn primary" type="submit" disabled={status.kind === 'sending'}>
            {status.kind === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          {status.message && (
            <p className={`form-status ${status.kind}`} role="status">
              {status.message}
            </p>
          )}
        </form>

        <div className="direct">
          <p className="mono">Or reach me directly</p>
          {showEmail ? (
            <a className="addr" href={`mailto:${profile.email}`}>{profile.email}</a>
          ) : (
            <span className="addr">{profile.email.replace('@', ' [at] ').replace(/\./g, ' [dot] ')}</span>
          )}
          <span className="addr">{profile.location}</span>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/sanjida-rahman-nitu</a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/Sanjida-Rahman-Nitu</a>
        </div>
      </div>
    </section>
  );
}
