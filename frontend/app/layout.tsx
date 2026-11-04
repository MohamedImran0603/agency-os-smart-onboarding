import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Agency OS — Neirah Tech',
    default: 'Agency OS — Neirah Tech',
  },
  description:
    'Agency OS by Neirah Tech — your all-in-one platform for running a modern creative or digital agency.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-textPrimary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
