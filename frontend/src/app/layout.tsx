import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Docodo - The platform for global SMB growth",
  description: "Docodo provides global SMBs with the tools to scale. AI sales agents, marketing workflows, and enterprise websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-[var(--text-primary)] bg-[var(--color-bg)]">
        {children}
      </body>
    </html>
  );
}
