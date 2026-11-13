'use client';

import { useEffect, useState } from 'react';
import { profile } from '@/data/content';

export type NavItem = { id: string; label: string };

/** Sticky section navigation. Highlights the section currently on screen. */
export default function Nav({ items }: { items: NavItem[] }) {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const sections = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="nav" aria-label="Sections">
      <div className="wrap nav-inner">
        <a className="nav-mark" href="#top" aria-label="Back to top">
          <span className="nav-dot" aria-hidden="true" />
          Nitu
        </a>
        <ul className="nav-links">
          {items.map((it) => (
            <li key={it.id}>
              <a href={`#${it.id}`} aria-current={active === it.id ? 'true' : undefined} className={active === it.id ? 'active' : undefined}>
                {it.label}
              </a>
            </li>
          ))}
          <li>
            <a className="nav-cv" href={profile.cv} target="_blank" rel="noopener noreferrer">
              CV
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
