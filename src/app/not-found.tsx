import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-7xl font-mono font-bold text-border mb-4">404</p>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-secondary text-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors no-underline"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
