/**
 * Transit simulation and canvas drawing for the hero.
 * A planet orbits the portrait; the light curve records how much light it blocks.
 * Pure functions — no React here.
 */

export const PERIOD = 9000; // ms per orbit
export const DEPTH = 0.01; // maximum fractional brightness drop
export const RP = 0.17; // planet radius / star radius
export const STEP = 60; // ms between light-curve samples
export const N = 320; // samples shown on the curve
export const TRANSIT_THRESHOLD = 0.996;

export type Palette = { flux: string; dim: string; grid: string; ink: string };
export type Star = { x: number; y: number; r: number; p: number };

/** Area of overlap between two circles with radii R, r whose centres are d apart. */
export function circleOverlap(d: number, R: number, r: number): number {
  if (d >= R + r) return 0;
  if (d <= R - r) return Math.PI * r * r;
  const a = r * r * Math.acos((d * d + r * r - R * R) / (2 * d * r));
  const b = R * R * Math.acos((d * d + R * R - r * r) / (2 * d * R));
  const c = 0.5 * Math.sqrt((-d + r + R) * (d + r - R) * (d - r + R) * (d + r + R));
  return a + b - c;
}

/** Planet position (in star radii) and relative flux at time t (ms). */
export function orbit(t: number) {
  const th = (2 * Math.PI * (((t % PERIOD) + PERIOD) % PERIOD)) / PERIOD;
  const x = 1.75 * Math.cos(th);
  const y = 0.28;
  const z = Math.sin(th); // z > 0: planet in front of the star
  const blocked = z > 0 ? circleOverlap(Math.hypot(x, y), 1, RP) / (Math.PI * RP * RP) : 0;
  return { x, y, z, flux: 1 - DEPTH * blocked };
}

/** Small deterministic random generator so the noise looks the same on every visit. */
export function makeNoise(seed: number) {
  let s = seed;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const gauss = () => {
    let u = 0;
    for (let i = 0; i < 6; i++) u += rnd();
    return (u - 3) / 1.4;
  };
  return { rnd, gauss };
}

export function makeStars(count: number): Star[] {
  const { rnd } = makeNoise(7);
  return Array.from({ length: count }, () => ({ x: rnd(), y: rnd(), r: rnd() * 1.1 + 0.2, p: rnd() * 6.28 }));
}

export function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const get = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
  return {
    flux: get('--flux', '#f4b860'),
    dim: get('--dim', '#939ab4'),
    grid: get('--grid', '#24305a'),
    ink: get('--ink', '#ece8dc'),
  };
}

function fitCanvas(c: HTMLCanvasElement) {
  const rect = c.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  const ctx = c.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w: rect.width, h: rect.height };
}

export function drawStars(c: HTMLCanvasElement, stars: Star[], t: number) {
  const { ctx, w, h } = fitCanvas(c);
  ctx.clearRect(0, 0, w, h);
  for (const s of stars) {
    const a = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(s.p + t * 0.0008));
    ctx.fillStyle = `rgba(236,232,220,${a})`;
    ctx.beginPath();
    ctx.arc(s.x * w, s.y * h, s.r, 0, 6.283);
    ctx.fill();
  }
}

export function drawPlanet(c: HTMLCanvasElement, t: number, col: Palette) {
  const { ctx, w, h } = fitCanvas(c);
  const cx = w / 2;
  const cy = h / 2;
  const R = w * 0.35;
  const s = orbit(t);
  ctx.clearRect(0, 0, w, h);

  // dashed orbit
  ctx.strokeStyle = col.grid;
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 5]);
  ctx.beginPath();
  ctx.ellipse(cx, cy + s.y * R, 1.75 * R, 0.12 * R, 0, 0, 6.283);
  ctx.stroke();
  ctx.setLineDash([]);

  const px = cx + s.x * R;
  const py = cy + s.y * R + 0.12 * R * s.z * 0.9;
  const pr = RP * R;
  ctx.save();
  if (s.z < 0) {
    // behind the star: hide the part covered by the portrait
    ctx.beginPath();
    ctx.rect(0, 0, w, h);
    ctx.arc(cx, cy, R, 0, 6.283, true);
    ctx.clip();
  }
  ctx.fillStyle = '#05070f';
  ctx.beginPath();
  ctx.arc(px, py, pr, 0, 6.283);
  ctx.fill();
  ctx.strokeStyle = s.z > 0 ? col.flux : col.grid;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(px, py, pr, Math.PI * 0.15, Math.PI * 0.95);
  ctx.stroke();
  ctx.restore();
}

/** Draws the light curve and returns the text for the flux readout. */
export function drawCurve(c: HTMLCanvasElement, buf: number[], hoverX: number | null, col: Palette): string {
  const { ctx, w, h } = fitCanvas(c);
  const padL = 58, padR = 14, padT = 14, padB = 26;
  const lo = 0.9865, hi = 1.0035;
  const X = (i: number) => padL + (i / (N - 1)) * (w - padL - padR);
  const Y = (f: number) => padT + ((hi - f) / (hi - lo)) * (h - padT - padB);

  ctx.clearRect(0, 0, w, h);
  ctx.font = '11px "IBM Plex Mono", monospace';
  ctx.textBaseline = 'middle';
  for (const f of [1.0, 0.995, 0.99]) {
    ctx.strokeStyle = col.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, Y(f));
    ctx.lineTo(w - padR, Y(f));
    ctx.stroke();
    ctx.fillStyle = col.dim;
    ctx.textAlign = 'right';
    ctx.fillText(f.toFixed(3), padL - 8, Y(f));
  }
  ctx.fillStyle = col.dim;
  ctx.textAlign = 'left';
  ctx.fillText('time →', padL, h - 10);
  ctx.textAlign = 'right';
  ctx.fillText('now', w - padR, h - 10);

  const off = N - buf.length;
  buf.forEach((f, i) => {
    const dip = f < TRANSIT_THRESHOLD;
    ctx.fillStyle = dip ? col.flux : 'rgba(236,232,220,0.55)';
    ctx.beginPath();
    ctx.arc(X(i + off), Y(f), dip ? 1.9 : 1.4, 0, 6.283);
    ctx.fill();
  });

  let f = buf[buf.length - 1];
  let label = ' · transit detected';
  if (hoverX !== null && buf.length) {
    const i = Math.max(off, Math.min(N - 1, Math.round(((hoverX - padL) / (w - padL - padR)) * (N - 1))));
    f = buf[i - off];
    label = ' · transit';
    ctx.strokeStyle = col.ink;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(X(i), padT);
    ctx.lineTo(X(i), h - padB);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = col.flux;
    ctx.beginPath();
    ctx.arc(X(i), Y(f), 4, 0, 6.283);
    ctx.fill();
  }
  if (f === undefined) return '';
  return `relative flux ${f.toFixed(4)}${f < TRANSIT_THRESHOLD ? label : ''}`;
}
