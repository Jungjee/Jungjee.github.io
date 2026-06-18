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
    <div className="border-b border-[#eee] pb-3 mb-3 last:border-0">
      <div
        className="flex items-baseline justify-between gap-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <a
            href={mentee.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {mentee.name}
          </a>
          <span className="text-secondary text-[15px]"> &middot; {mentee.topic}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-muted">{period}</span>
          <span className="text-muted text-sm">{isOpen ? "▾" : "▸"}</span>
        </div>
      </div>
      {isOpen && mentee.outcomes.length > 0 && (
        <div className="mt-3 ml-4">
          {mentee.outcomes.map((outcome, i) => (
            <div key={i} className="pub">
              <span className="text-primary">{outcome}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MentoringSection() {
  const ongoing = (mentoring as Mentee[]).filter((m) => m.status === "ongoing");
  const previous = (mentoring as Mentee[]).filter((m) => m.status === "previous");

  return (
    <div>
      <div className="section-title">mentoring</div>
      <p className="text-[15px] text-secondary mb-5">
        I&apos;m always excited to mentor new individuals. Feel free to{" "}
        <a href="mailto:jeeweonj@ieee.org">reach out</a> if you&apos;re interested
        in exploring a collaboration!
      </p>

      <h3 className="text-[15px] font-semibold text-secondary uppercase tracking-wide mb-3">Ongoing</h3>
      {ongoing.map((mentee) => (
        <MenteeEntry key={mentee.name} mentee={mentee} />
      ))}

      <h3 className="text-[15px] font-semibold text-secondary uppercase tracking-wide mb-3 mt-6">Previous</h3>
      {previous.map((mentee) => (
        <MenteeEntry key={mentee.name} mentee={mentee} />
      ))}
    </div>
  );
}
