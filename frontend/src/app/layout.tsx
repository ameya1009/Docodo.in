import type { Metadata, Viewport } from "next";
import { Unbounded, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { defaultMetadata, jsonLd } from "@/lib/metadata";
import { ScrollProgress, PageTransition } from "@/components/layout/LayoutEffects";
import { LayoutProvider } from "@/components/layout/LayoutProvider";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = defaultMetadata;

export const viewport: Viewport = {
  themeColor: "#080807",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${unbounded.variable} ${dmSans.variable} ${jetbrainsMono.variable} antialiased`}>
        <LayoutProvider>
          <ScrollProgress />
          <PageTransition>
            {children}
          </PageTransition>
        </LayoutProvider>
      </body>
    </html>
  );
}
