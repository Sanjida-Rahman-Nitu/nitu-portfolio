import {
  about,
  catalogueStrip,
  dataSources,
  leadership,
  milestones,
  profile,
  research,
  researchNote,
  skills,
  type TimelineItem,
} from '@/data/content';
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
          {(it.text || it.link) && (
            <p>
              {it.text}{' '}
              {it.link && (
                <a href={it.link.href} target="_blank" rel="noopener noreferrer">
                  {it.link.text} ↗
                </a>
              )}
            </p>
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

export function Footer() {
  return (
    <footer className="wrap mono">
      The light curve at the top is simulated from the animation. Real TESS dips are usually much smaller. · ©{' '}
      {new Date().getFullYear()} {profile.fullName}
    </footer>
  );
}
