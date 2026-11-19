import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms of Use" };

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" updated="November 2026">
      <p>
        By using NBA Tools, you agree to these terms. If you do not agree, please do not use the site.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">General use</h2>
      <p>
        Our tools are provided free of charge for personal, informational, and entertainment purposes. You may use them as you wish, but you may not attempt to disrupt the site or reverse-engineer its underlying code for redistribution.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">No professional advice</h2>
      <p>
        Results are estimates based on published formulas and typical league figures. They are not financial, legal, or betting advice. Salary cap and tax figures use projections and may differ from official NBA values. Always verify against official sources before making decisions.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Trademarks</h2>
      <p>
        NBA Tools is not affiliated with the NBA. All league and team names, logos, and marks are the property of their respective owners. We do not claim ownership of any third-party trademarks.
      </p>
      <h2 className="pt-2 text-xl font-bold text-ink">Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the revised terms.
      </p>
    </LegalPage>
  );
}
