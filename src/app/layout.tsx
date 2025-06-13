import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Dhyan - Task Scheduling & Management',
  description: 'A modern, clean task scheduling web application for daily productivity',
  keywords: 'task management, productivity, scheduling, todo, daily tasks',
  authors: [{ name: 'Dhyan Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}