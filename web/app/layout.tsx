import type { Metadata } from 'next';
import './globals.css';
import { Inter, Poppins, Lato } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600', '700'], variable: '--font-poppins' });
const lato = Lato({ subsets: ['latin'], weight: ['300', '400', '700', '900'], variable: '--font-lato' });

export const metadata: Metadata = {
  title: 'Next.js Web App',
  description: 'Scaffolded Next.js app with Tailwind CSS and base layout.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${lato.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-inter text-foreground antialiased">
        <Navbar />
        <main className="container-base py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
