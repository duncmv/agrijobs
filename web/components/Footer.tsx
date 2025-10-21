export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-muted/40 py-8">
      <div className="container-base flex flex-col items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-300 md:flex-row">
        <p>
          © {new Date().getFullYear()} NextApp. Built with Next.js and Tailwind CSS.
        </p>
        <div className="flex items-center gap-4">
          <a
            className="link"
            href="https://github.com/vercel/next.js"
            target="_blank"
            rel="noreferrer"
          >
            Next.js
          </a>
          <a className="link" href="https://tailwindcss.com" target="_blank" rel="noreferrer">
            Tailwind
          </a>
        </div>
      </div>
    </footer>
  );
}
