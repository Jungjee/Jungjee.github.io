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
      <strong key={i} className="text-primary">{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function PublicationList() {
  return (
    <section>
      <h2 className="section-heading">Selected Publications</h2>
      <p className="text-sm text-secondary mb-5">
        Full publication list available in my{" "}
        <a
          href="/CV_Jee-weon_Jung.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1"
        >
          CV
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
            <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
          </svg>
        </a>
      </p>
      <div className="space-y-3">
        {(publications as Publication[]).map((pub, index) => (
          <div key={pub.title} className="card group flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-xs font-mono font-semibold text-secondary group-hover:bg-accent-light group-hover:text-accent transition-colors">
              {index + 1}
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed">
                {highlightAuthor(pub.authors)},{" "}
                <em className="text-primary">&ldquo;{pub.title}&rdquo;</em>
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="badge-muted badge">{pub.venue}</span>
                <span className="text-xs text-secondary font-mono">{pub.year}</span>
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs">
                    View paper &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
