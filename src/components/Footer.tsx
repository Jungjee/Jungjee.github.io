export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[780px] px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono font-semibold text-sm text-primary">Jee-weon Jung</p>
          <p className="text-xs text-secondary mt-1">Senior Research Scientist at Apple</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-secondary">
          <a href="mailto:jeeweonj@ieee.org" className="hover:text-primary transition-colors">jeeweonj@ieee.org</a>
          <span className="text-border">|</span>
          <a href="https://scholar.google.com/citations?user=A5OcLdAAAAAJ" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Google Scholar</a>
          <span className="text-border">|</span>
          <a href="https://github.com/Jungjee" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
