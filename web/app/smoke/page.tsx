import { motion } from 'framer-motion';

export const dynamic = 'force-static';

export default function SmokeTestPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Smoke Test</h1>
      <p className="text-gray-600 dark:text-gray-300">If you can see this page, routing works!</p>
      <motion.div
        className="rounded-lg border border-border bg-muted p-6"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 12 }}
      >
        <p className="text-sm">This box is animated with Framer Motion.</p>
      </motion.div>
    </div>
  );
}
