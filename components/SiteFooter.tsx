import Link from "next/link";
import { SITE_NAME } from "@/lib/tools";

export default function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row">
          <div>
            <div className="flex items-center gap-2 font-extrabold">
              <span className="text-xl">🏀</span>
              <span>{SITE_NAME}</span>
            </div>
            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Free basketball tools for fans and fantasy managers. No signup, no data collected — everything runs in your browser.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Site</h3>
              <div className="flex flex-col gap-2 text-gray-500">
                <Link href="/" className="hover:text-court">Home</Link>
                <Link href="/teams" className="hover:text-court">All 30 teams</Link>
                <Link href="/team-salary-trade-simulator" className="hover:text-court">Trade simulator</Link>
                <Link href="/guides" className="hover:text-court">Cap &amp; contract guides</Link>
                <Link href="/about" className="hover:text-court">About</Link>
                <Link href="/privacy" className="hover:text-court">Privacy Policy</Link>
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-gray-900">Legal</h3>
              <div className="flex flex-col gap-2 text-gray-500">
                <Link href="/terms" className="hover:text-court">Terms</Link>
                <Link href="/disclaimer" className="hover:text-court">Disclaimer</Link>
                <Link href="/about" className="hover:text-court">About</Link>
                <Link href="/contact" className="hover:text-court">Contact</Link>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-400">
          © {new Date().getFullYear()} {SITE_NAME}. Not affiliated with the NBA. All trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}
