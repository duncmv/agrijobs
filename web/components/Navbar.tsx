"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/cn';

const links = [
  { href: '/', label: 'Home' },
  { href: '/smoke', label: 'Smoke' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/70 backdrop-blur dark:bg-gray-900/70">
      <div className="container-base flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-semibold">
            <span className="text-brand-600">Next</span>
            <span className="text-gray-700 dark:text-gray-200">App</span>
          </Link>
          <nav className="hidden gap-4 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-white',
                  pathname === link.href && 'text-gray-900 dark:text-white',
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
