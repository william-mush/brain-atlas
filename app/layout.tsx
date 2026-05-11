import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'The Brain Atlas',
  description:
    'An interactive 3D atlas of the human brain and nervous system — from cortex to vagus nerve to gut.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ink-900 text-ink-100">
        <Nav />
        {children}
      </body>
    </html>
  );
}
