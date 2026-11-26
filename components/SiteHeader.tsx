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
          <Link href="/news" className="hover:text-court">News</Link>
          <Link href="/teams" className="hover:text-court">Teams</Link>
          <Link href="/players" className="hover:text-court">Players</Link>
          <Link href="/#tools" className="hover:text-court">Tools</Link>
          <Link href="/guides" className="hover:text-court">Guides</Link>
          <Link href="/#faq" className="hover:text-court">FAQ</Link>
          <Link href="/about" className="hover:text-court">About</Link>
        </nav>
      </div>
      {/* Phones have no room for the full nav, but news is a daily-visit page,
          so give small screens a scrollable strip instead of nothing. */}
      <nav
        aria-label="Sections"
        className="flex gap-4 overflow-x-auto border-t border-gray-100 px-4 py-2 text-xs font-semibold text-gray-600 sm:hidden"
      >
        <Link href="/news" className="whitespace-nowrap hover:text-court">News</Link>
        <Link href="/teams" className="whitespace-nowrap hover:text-court">Teams</Link>
        <Link href="/players" className="whitespace-nowrap hover:text-court">Players</Link>
        <Link href="/#tools" className="whitespace-nowrap hover:text-court">Tools</Link>
        <Link href="/guides" className="whitespace-nowrap hover:text-court">Guides</Link>
        <Link href="/#faq" className="whitespace-nowrap hover:text-court">FAQ</Link>
        <Link href="/about" className="whitespace-nowrap hover:text-court">About</Link>
      </nav>
    </header>
  );
}
