import Link from "next/link";
import { SITE_NAME } from "@/lib/tools";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="text-2xl">🏀</span>
          <span className="text-lg">{SITE_NAME}</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-gray-600 sm:flex">
          <Link href="/teams" className="hover:text-court">Teams</Link>
          <Link href="/#tools" className="hover:text-court">Tools</Link>
          <Link href="/#faq" className="hover:text-court">FAQ</Link>
          <Link href="/about" className="hover:text-court">About</Link>
        </nav>
      </div>
    </header>
  );
}
