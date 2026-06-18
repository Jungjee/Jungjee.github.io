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
    <div>
      <div className="section-title">selected publications</div>
      <p className="text-[15px] text-secondary mb-5">
        Full publication list available in my{" "}
        <a href="/CV_Jee-weon_Jung.pdf" target="_blank" rel="noopener noreferrer">
          CV
        </a>
        .
      </p>
      {(publications as Publication[]).map((pub) => (
        <div key={pub.title} className="pub">
          <div className="inline">
            {pub.url ? (
              <a href={pub.url} target="_blank" rel="noopener noreferrer">{pub.title}</a>
            ) : (
              <span className="text-primary">{pub.title}</span>
            )}
          </div>
          {" "}
          <div className="inline text-venue font-medium">{pub.venue} {pub.year}</div>
          <div className="text-primary">{highlightAuthor(pub.authors)}</div>
        </div>
      ))}
    </div>
  );
}
