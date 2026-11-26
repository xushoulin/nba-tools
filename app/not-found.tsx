import type { Metadata } from "next";
import Link from "next/link";

// A soft 404 must not compete with the real pages in the index.
export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="text-6xl">🏀</div>
      <h1 className="mt-6 text-3xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-3 text-gray-600">Looks like this one went out of bounds.</p>
      <Link href="/" className="mt-8 inline-block rounded-lg bg-court px-6 py-3 font-bold text-white hover:bg-orange-600">
        Back to all tools
      </Link>
    </main>
  );
}
