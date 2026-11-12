import type { RichText } from '@/data/content';

/** Renders text that may contain inline links (see RichText in data/content.ts). */
export default function Rich({ value }: { value: RichText }) {
  return (
    <>
      {value.map((part, i) =>
        typeof part === 'string' ? (
          <span key={i}>{part}</span>
        ) : (
          <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
            {part.text}
          </a>
        ),
      )}
    </>
  );
}
