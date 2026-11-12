'use client';

import { useEffect, useRef } from 'react';
import { drawStars, makeStars } from '@/lib/transit';

/** Fixed, softly twinkling star background behind the whole page. */
export default function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const stars = makeStars(220);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      const draw = () => drawStars(canvas, stars, 0);
      draw();
      window.addEventListener('resize', draw);
      return () => window.removeEventListener('resize', draw);
    }

    let raf = 0;
    const frame = (now: number) => {
      drawStars(canvas, stars, now);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas id="stars" ref={ref} aria-hidden="true" />;
}
