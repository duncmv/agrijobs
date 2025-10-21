import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <motion.h1
          className="text-4xl font-extrabold tracking-tight sm:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to your Next.js + Tailwind scaffold
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          This project is set up with a base layout, theme toggle, and a smoke test page.
        </motion.p>
        <motion.div
          className="mt-8 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Link href="/smoke" className="btn-primary">
            Go to smoke test
          </Link>
          <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer" className="link">
            Read the docs
          </a>
        </motion.div>
      </section>
    </div>
  );
}
