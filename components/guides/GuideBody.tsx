import type { Block } from "@/lib/guides";

/**
 * Renders the structured blocks of a guide. Kept as plain Tailwind classes
 * rather than the typography plugin so the output matches the rest of the site.
 */
export default function GuideBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "p":
            return (
              <p key={i} className="mt-4 text-[15px] leading-7 text-gray-700">
                {block.text}
              </p>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-8 text-lg font-bold text-ink">
                {block.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-7 text-gray-700 marker:text-orange-400">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-7 text-gray-700 marker:font-semibold marker:text-orange-500">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            );
          case "table":
            return (
              <figure key={i} className="mt-6">
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[520px] border-collapse text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {block.head.map((cell) => (
                          <th
                            key={cell}
                            scope="col"
                            className="whitespace-nowrap px-4 py-2.5 text-left font-semibold text-ink"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, r) => (
                        <tr key={r} className="align-top">
                          {row.map((cell, c) => (
                            <td
                              key={c}
                              className={`border-t border-gray-100 px-4 py-2.5 ${
                                c === 0 ? "font-medium text-ink" : "text-gray-700"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && (
                  <figcaption className="mt-2 px-1 text-xs leading-relaxed text-gray-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          case "note":
            return (
              <aside key={i} className="mt-6 rounded-xl border-l-4 border-court bg-orange-50/70 px-5 py-4">
                {block.title && <p className="font-bold text-ink">{block.title}</p>}
                <p className={`text-sm leading-6 text-gray-700 ${block.title ? "mt-1" : ""}`}>{block.text}</p>
              </aside>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
