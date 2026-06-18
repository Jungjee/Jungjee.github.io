import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <hr />
      <div className="py-20 text-center">
        <h2 className="text-[34px] font-normal mb-2">404</h2>
        <p className="text-secondary italic text-lg mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          &larr; Back to home
        </Link>
      </div>
    </>
  );
}
