import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dhyan - Task Scheduling & Management',
  description: 'A modern, clean task scheduling web application for daily task management with progress tracking.',
  keywords: 'task management, productivity, scheduling, focus, daily tasks',
  authors: [{ name: 'Dhyan Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}