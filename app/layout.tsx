import type { Metadata } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'La Bande Créative — Agence de communication 360°',
  description:
    "Agence de communication 360° qui allie création artistique et performance. Audit, stratégie, production vidéo, community management — pensés pour vraiment performer.",
  keywords: [
    'agence de communication',
    'social media',
    'production vidéo',
    'community management',
    'stratégie digitale',
    'La Bande Créative',
  ],
  openGraph: {
    title: 'La Bande Créative',
    description:
      "Agence de communication 360° qui allie création artistique et performance.",
    type: 'website',
    locale: 'fr_FR',
  },
  metadataBase: new URL('https://labandecreative.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  );
}
