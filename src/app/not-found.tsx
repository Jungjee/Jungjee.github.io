import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
      <p className="text-secondary mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-accent">
        Go back home
      </Link>
    </div>
  );
}
