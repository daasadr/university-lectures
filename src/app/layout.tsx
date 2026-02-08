import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Univerzitní Přednášky - Demokratizace přístupu k vysokoškolskému vzdělání',
  description: 'Najděte a sledujte veřejně přístupné univerzitní přednášky v České republice. Zdarma pro studenty, vyučující a veřejnost.',
  keywords: ['univerzita', 'přednášky', 'vzdělání', 'UK', 'ČVUT', 'MUNI', 'Česká republika'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
      <SessionProvider>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}