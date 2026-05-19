import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Montserrat } from 'next/font/google';
import './globals.css';
import {
  DEFAULT_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  TAGLINE,
  jsonLdScript,
  localBusinessLd,
  organizationLd,
  websiteLd,
} from '@/lib/seo';

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Agence de communication à Mantes-la-Jolie (Yvelines)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  generator: 'Next.js',
  keywords: [
    'agence de communication Mantes-la-Jolie',
    'agence de communication Yvelines',
    'agence de communication 78',
    'agence communication Île-de-France',
    'production vidéo Mantes-la-Jolie',
    'production vidéo Yvelines',
    'production photo Mantes-la-Jolie',
    'stratégie de communication',
    'community management Yvelines',
    'social media Yvelines',
    'film de marque',
    'reels Instagram TikTok',
    'podcast vidéo Yvelines',
    'La Bande Créative',
  ],
  category: 'Marketing & Communication',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: SITE_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Agence de communication à Mantes-la-Jolie`,
    description: TAGLINE,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME}, agence de communication 360° à Mantes-la-Jolie`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Agence de communication à Mantes-la-Jolie`,
    description: TAGLINE,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

// Next 15: `viewport` lives in its own export (separate from metadata).
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF1E6' },
    { media: '(prefers-color-scheme: dark)', color: '#4F60F1' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${montserrat.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationLd())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(websiteLd())}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(localBusinessLd())}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
