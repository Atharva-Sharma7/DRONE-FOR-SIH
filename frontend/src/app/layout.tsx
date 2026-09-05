import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, IBM_Plex_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from './providers';
import { AppShell } from '@/components/layout/AppShell';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Waranga Krishi Drone — Nagpur',
  description: 'Precision agriculture drone analytics for Waranga, Hingna, Nagpur. Disease detection, NDVI mapping, and terrain analysis for cotton and soybean.',
  keywords: ['drone', 'agriculture', 'NDVI', 'Waranga', 'Nagpur', 'cotton', 'soybean'],
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Krishi Drone' },
};

export const viewport: Viewport = {
  themeColor: '#17160F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className={`${spaceGrotesk.className} antialiased bg-[var(--bg)] text-[var(--text-primary)]`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
