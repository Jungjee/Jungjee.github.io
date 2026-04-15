"use client";

import { useState } from "react";
import mentoring from "@/data/mentoring.json";

interface Mentee {
  name: string;
  url: string;
  startYear: number;
  endYear: number | null;
  status: "ongoing" | "previous";
  topic: string;
  outcomes: string[];
}

function MenteeEntry({ mentee }: { mentee: Mentee }) {
  const [isOpen, setIsOpen] = useState(false);
  const period = mentee.endYear
    ? `${mentee.startYear} – ${mentee.endYear}`
    : `${mentee.startYear} – present`;

  return (
    <div className="card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3">
          {/* Avatar placeholder */}
          <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-xs font-semibold text-secondary flex-shrink-0 mt-0.5">
            {mentee.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <a
              href={mentee.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {mentee.name}
            </a>
            <p className="text-xs text-secondary mt-0.5">{mentee.topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-secondary font-mono">{period}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`w-4 h-4 text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-[500px] opacity-100 mt-3 pt-3 border-t border-border-light" : "max-h-0 opacity-0"
        }`}
      >
        {mentee.outcomes.length > 0 && (
          <div className="pl-12">
            <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">Publications</p>
            <ul className="space-y-2">
              {mentee.outcomes.map((outcome, i) => (
                <li key={i} className="text-xs text-secondary leading-relaxed pl-3 border-l-2 border-border-light">
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MentoringSection() {
  const ongoing = (mentoring as Mentee[]).filter((m) => m.status === "ongoing");
  const previous = (mentoring as Mentee[]).filter((m) => m.status === "previous");

  return (
    <section>
      <h2 className="section-heading">Mentoring</h2>
      <p className="text-sm text-secondary mb-6">
        I&apos;m always excited to mentor new individuals. Feel free to{" "}
        <a href="mailto:jeeweonj@ieee.org">reach out</a> if you&apos;re interested
        in exploring a collaboration!
      </p>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold">Ongoing</h3>
            <span className="badge">{ongoing.length}</span>
          </div>
          <div className="space-y-3">
            {ongoing.map((mentee) => (
              <MenteeEntry key={mentee.name} mentee={mentee} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold">Previous</h3>
            <span className="badge badge-muted">{previous.length}</span>
          </div>
          <div className="space-y-3">
            {previous.map((mentee) => (
              <MenteeEntry key={mentee.name} mentee={mentee} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
