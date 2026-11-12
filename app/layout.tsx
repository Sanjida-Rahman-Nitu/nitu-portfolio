import type { Metadata, Viewport } from 'next';
import { profile } from '@/data/content';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const description =
  'Shah Sanjida Rahman Nitu — Computer Science and Engineering student at Rajshahi University of Engineering & Technology (RUET), Bangladesh, doing machine learning research on NASA TESS and Kepler exoplanet data: clustering, anomaly detection and uncertainty estimation.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${profile.fullName} — ${profile.role}`,
  description,
  authors: [{ name: profile.fullName }],
  keywords: ['machine learning', 'exoplanets', 'TESS', 'Kepler', 'anomaly detection', 'RUET', 'Rajshahi University of Engineering & Technology', 'portfolio'],
  openGraph: {
    type: 'website',
    title: `${profile.fullName} — ${profile.role}`,
    description,
    url: '/',
    images: [{ url: profile.photo, width: 800, height: 800, alt: profile.fullName }],
  },
  twitter: { card: 'summary', title: profile.fullName, description, images: [profile.photo] },
};

export const viewport: Viewport = {
  themeColor: '#0a0f1f',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@500;700;900&family=Libre+Franklin:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
