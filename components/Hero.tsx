'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { profile } from '@/data/content';
import { N, PERIOD, STEP, drawCurve, drawPlanet, makeNoise, orbit, readPalette } from '@/lib/transit';

/**
 * Hero: name and intro on the left, the portrait with a transiting planet on the right,
 * and a live light curve below that records each transit.
 */
export default function Hero() {
  const planetRef = useRef<HTMLCanvasElement>(null);
  const curveRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const planet = planetRef.current;
    const curve = curveRef.current;
    const readout = readoutRef.current;
    if (!planet || !curve || !readout) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const palette = readPalette();
    const shift = PERIOD * 0.4; // start mid-orbit so a dip is already on screen
    const { gauss } = makeNoise(11);
    const sample = (t: number) => orbit(t).flux + gauss() * 0.0009;

    const t0 = performance.now();
    const buf: number[] = [];
    for (let k = N; k > 0; k--) buf.push(sample(t0 - k * STEP + shift));

    let hoverX: number | null = null;
    let last = t0;
    let raf = 0;
    // Count transits as they happen (the planet entering the disc), like a tiny survey.
    let transits = 0;
    let inTransit = orbit(t0 + shift).flux < 1;

    const render = (now: number) => {
      drawPlanet(planet, reduce ? PERIOD * 0.25 : now + shift, palette);
      readout.textContent = drawCurve(curve, buf, hoverX, palette);
    };

    const onMove = (e: PointerEvent) => {
      hoverX = e.clientX - curve.getBoundingClientRect().left;
      if (reduce) render(0);
    };
    const onLeave = () => {
      hoverX = null;
      if (reduce) render(0);
    };
    const onResize = () => {
      if (reduce) render(0);
    };
    curve.addEventListener('pointermove', onMove);
    curve.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);

    if (reduce) {
      render(0);
    } else {
      const frame = (now: number) => {
        while (now - last >= STEP) {
          last += STEP;
          buf.push(sample(last + shift));
          if (buf.length > N) buf.shift();
          const blocked = orbit(last + shift).flux < 1;
          if (blocked && !inTransit) {
            transits += 1;
            if (countRef.current) countRef.current.textContent = String(transits);
          }
          inTransit = blocked;
        }
        render(now);
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      curve.removeEventListener('pointermove', onMove);
      curve.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      <div className="hero">
        <div>
          <p className="kicker">{profile.kicker}</p>
          <h1>
            <span className="first">{profile.firstName}</span>
            {profile.lastName[0]}
            <br />
            {profile.lastName[1]}
          </h1>
          <p className="thesis">
            {profile.tagline.before}
            <em>{profile.tagline.highlight}</em>
            {profile.tagline.after}
          </p>
          <div className="cta">
            <a className="btn primary" href="#research">See my research</a>
            <a className="btn" href={profile.cv} target="_blank" rel="noopener noreferrer">Download CV</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a className="btn" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            {profile.scholar && (
              <a className="btn" href={profile.scholar} target="_blank" rel="noopener noreferrer">Google Scholar ↗</a>
            )}
            {profile.orcid && (
              <a className="btn" href={profile.orcid} target="_blank" rel="noopener noreferrer">ORCID ↗</a>
            )}
          </div>
        </div>

        <div className="scope" aria-label={`Portrait of ${profile.fullName} with an animated planet passing in front of it`}>
          <div className="reticle" />
          <Image src={profile.photo} alt={profile.fullName} width={800} height={800} priority sizes="(max-width: 860px) 224px, 280px" />
          <canvas ref={planetRef} aria-hidden="true" />
          <div className="tag mono">
            target: <span className="ink">NITU-b</span>
          </div>
        </div>
      </div>

      <div className="lc" role="img" aria-label="Live light curve recording the brightness drop each time the planet passes in front of the portrait">
        <div className="lc-head mono">
          <span>
            <span className="live">● LIVE</span> light curve of the target above
          </span>
          <span>
            transits detected this visit: <span ref={countRef} className="ink">0</span>
          </span>
          <span ref={readoutRef}>relative flux 1.0000</span>
        </div>
        <canvas id="curve" ref={curveRef} />
      </div>
    </>
  );
}
