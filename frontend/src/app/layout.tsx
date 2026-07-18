import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://docodo.in'),
  title: 'Docodo | #1 AI Agents & Premium SaaS Dashboards',
  description: 'Docodo is the premier digital marketing brand building custom AI agents, high-end SaaS dashboards, and modern websites for scaling businesses. Ranked top 1% for AI solutions.',
  keywords: ['AI agents', 'SaaS dashboard', 'digital marketing', 'custom websites', 'Docodo', 'AI solutions', 'web development', 'Next.js apps', 'premium websites'],
  openGraph: {
    title: 'Docodo | Leading AI Agents & SaaS Dashboards',
    description: 'Empower your business with Docodo. We build top-tier AI agents and custom SaaS dashboards.',
    url: 'https://docodo.in',
    siteName: 'Docodo',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Docodo | AI Agents & Web Solutions',
    description: 'Transform your brand with Docodo\'s AI agents and premium dashboards.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
