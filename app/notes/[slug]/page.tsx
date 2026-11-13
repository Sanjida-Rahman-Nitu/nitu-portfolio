import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Starfield from '@/components/Starfield';
import { profile, publishedNotes } from '@/data/content';

/** One page per published note, e.g. /notes/why-gaps-matter-in-tess-light-curves */

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedNotes.map((n) => ({ slug: n.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = publishedNotes.find((n) => n.slug === slug);
  if (!note) return {};
  return {
    title: `${note.title} — ${profile.fullName}`,
    description: note.summary,
    openGraph: { type: 'article', title: note.title, description: note.summary, url: `/notes/${note.slug}` },
  };
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params;
  const note = publishedNotes.find((n) => n.slug === slug);
  if (!note) notFound();

  return (
    <>
      <Starfield />
      <main className="wrap note-page">
        <a className="mono back" href="/#notes">
          ← Back to {profile.fullName}
        </a>
        <article>
          <p className="label">Field note · {note.date}</p>
          <h1 className="note-h1">{note.title}</h1>
          <p className="note-lede">{note.summary}</p>
          {note.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </article>
        <p className="mono dim note-sign">
          Written by {profile.fullName} ·{' '}
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </p>
      </main>
    </>
  );
}
