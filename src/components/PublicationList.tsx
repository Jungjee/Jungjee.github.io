import publications from "@/data/publications.json";

interface Publication {
  authors: string;
  title: string;
  venue: string;
  year: number;
  url: string | null;
}

function highlightAuthor(authors: string): React.ReactNode {
  const parts = authors.split(/(J\. Jung)/);
  return parts.map((part, i) =>
    part === "J. Jung" ? (
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function PublicationList() {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Selected Publications</h2>
      <p className="text-sm text-secondary mb-6">
        Full publication list available in my{" "}
        <a href="/CV_Jee-weon_Jung.pdf" target="_blank" rel="noopener noreferrer">
          CV
        </a>
        .
      </p>
      <ol className="space-y-4 list-decimal list-outside pl-5">
        {(publications as Publication[]).map((pub) => (
          <li key={pub.title} className="text-sm leading-relaxed">
            {highlightAuthor(pub.authors)},{" "}
            <em>&ldquo;{pub.title}&rdquo;</em>,{" "}
            {pub.venue}, {pub.year}.
            {pub.url && (
              <>
                {" "}
                <a href={pub.url} target="_blank" rel="noopener noreferrer">
                  [Link]
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
