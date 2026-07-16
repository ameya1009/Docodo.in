import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Docodo | AI Agents & Premium Web Solutions',
  description: 'Docodo is a premium SaaS digital marketing brand building AI agents, modern websites, high-end apps, and custom dashboards.',
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
