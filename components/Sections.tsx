import {
  about,
  catalogueStrip,
  dataSources,
  leadership,
  milestones,
  profile,
  publishedNotes,
  research,
  researchNote,
  skills,
  type TimelineItem,
} from '@/data/content';
import Image from 'next/image';
import Rich from './Rich';

function SectionHead({ label, title }: { label: string; title: string[] }) {
  return (
    <>
      <p className="label">{label}</p>
      <h2>
        {title.map((line, i) => (
          <span key={i}>
            {line}
            {i < title.length - 1 && <br />}
          </span>
        ))}
      </h2>
    </>
  );
}

export function CatalogueStrip() {
  return (
    <header className="wrap">
      <div className="strip mono">
        {catalogueStrip.map(([k, v]) => (
          <span key={k}>
            {k} <b>{v}</b>
          </span>
        ))}
      </div>
    </header>
  );
}

export function About() {
  return (
    <section id="about">
      <SectionHead label="About" title={about.heading} />
      <div className="about">
        <div>
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <dl className="facts">
          {about.facts.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function Research() {
  return (
    <section id="research">
      <SectionHead label="Research log" title={['Work in progress']} />
      <div className="log">
        {research.map((r) => (
          <article className="obs" key={r.id}>
            <div className="id">{r.id}</div>
            <div>
              <h3>{r.title}</h3>
              <p>{r.summary}</p>
              {r.figure && (
                <figure className="obs-figure">
                  <Image src={r.figure.src} alt={r.figure.alt} width={1200} height={600} sizes="(max-width: 860px) 100vw, 640px" />
                  {r.figure.caption && <figcaption className="mono">{r.figure.caption}</figcaption>}
                </figure>
              )}
              {r.links && r.links.length > 0 && (
                <div className="obs-links">
                  {r.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                      [{l.label}]
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="meta">
              <span className="chip">{r.status}</span>
              {r.meta.map((m) => (
                <span key={m}>
                  <br />
                  {m}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="honest">{researchNote}</p>
    </section>
  );
}

export function DataSources() {
  return (
    <section id="data">
      <SectionHead label="Data I work with" title={["The telescope's raw material"]} />
      <div className="data">
        {dataSources.map((c) => (
          <div className="card" key={c.title}>
            <div className="big">{c.big}</div>
            <h3>{c.title}</h3>
            <p>
              <Rich value={c.body} />
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills">
      <SectionHead label="Toolkit" title={['Skills']} />
      <div className="skills">
        {skills.map(([group, items]) => (
          <div key={group}>
            <div className="k">{group}</div>
            <ul>
              {items.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ul className="roles">
      {items.map((it) => (
        <li className={it.highlight ? 'hi' : undefined} key={it.title}>
          {it.when && <div className="when">{it.when}</div>}
          <h3>{it.title}</h3>
          {it.org && (
            <div className="org">
              <Rich value={it.org} />
            </div>
          )}
          {it.text && <p>{it.text}</p>}
          {it.posts && (
            <div className="proof">
              {it.posts.map((post) => (
                <a className="proof-link" href={post.href} target="_blank" rel="noopener noreferrer" key={post.href} title={`${post.label} on LinkedIn`}>
                  <span className="proof-in" aria-hidden="true">in</span>
                  {post.label} ↗
                </a>
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

export function Leadership() {
  return (
    <section id="leadership">
      <div className="two">
        <div>
          <SectionHead label="Leadership" title={['Building teams']} />
          <Timeline items={leadership} />
        </div>
        <div>
          <SectionHead label="Honours & stage" title={['Milestones']} />
          <Timeline items={milestones} />
        </div>
      </div>
    </section>
  );
}

export function Notes() {
  if (!publishedNotes.length) return null;
  return (
    <section id="notes">
      <SectionHead label="Notes" title={['Field notes']} />
      <ul className="notes">
        {publishedNotes.map((n) => (
          <li key={n.slug}>
            <a href={`/notes/${n.slug}`}>
              <span className="note-date mono">{n.date}</span>
              <span className="note-title">{n.title}</span>
              <span className="note-summary">{n.summary}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer() {
  const links = [
    { label: 'LinkedIn', href: profile.linkedin },
    { label: 'GitHub', href: profile.github },
    ...(profile.scholar ? [{ label: 'Google Scholar', href: profile.scholar }] : []),
    ...(profile.orcid ? [{ label: 'ORCID', href: profile.orcid }] : []),
    { label: 'CV', href: profile.cv },
  ];
  return (
    <footer className="wrap mono footer">
      <div className="footer-row">
        <span>© {new Date().getFullYear()} {profile.fullName}</span>
        <span className="footer-links">
          {links.map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </span>
      </div>
      <div className="footer-row dim">
        <span>
          Built with Next.js and deployed on Vercel ·{' '}
          <a href={profile.sourceCode} target="_blank" rel="noopener noreferrer">
            source code
          </a>
        </span>
        <span>The light curve above is simulated from the animation. Real TESS dips are usually much smaller.</span>
      </div>
    </footer>
  );
}
