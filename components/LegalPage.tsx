import Link from "next/link";

export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-gray-500">Last updated: {updated}</p>
      <div className="prose mt-8 space-y-5 text-gray-700">{children}</div>
      <div className="mt-10">
        <Link href="/" className="text-court hover:underline">← Back to home</Link>
      </div>
    </main>
  );
}
