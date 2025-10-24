import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Feasts AgriJobs - Connecting Hands That Grow the Nation",
  description: "Bridge the gap between agricultural employers and skilled workers. Find your next opportunity or discover the perfect candidate for your farm.",
  icons: {
    icon: [
      { url: '/favicon-new.ico?v=3', sizes: 'any' },
      { url: '/favicon.png?v=3', type: 'image/png' },
      { url: '/images/logo.png?v=3', type: 'image/png' }
    ],
    shortcut: '/favicon-new.ico?v=3',
    apple: '/favicon.png?v=3',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-new.ico?v=3" sizes="any" />
        <link rel="icon" href="/favicon.png?v=3" type="image/png" />
        <link rel="shortcut icon" href="/favicon-new.ico?v=3" />
        <link rel="apple-touch-icon" href="/favicon.png?v=3" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}