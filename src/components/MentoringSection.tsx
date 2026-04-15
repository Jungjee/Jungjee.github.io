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
    <li className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-3 flex items-baseline justify-between gap-4 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
        aria-expanded={isOpen}
      >
        <span>
          <a
            href={mentee.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {mentee.name}
          </a>
          <span className="text-secondary text-sm"> ({period})</span>
        </span>
        <span className="text-secondary text-sm shrink-0">
          {isOpen ? "▾" : "▸"}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pl-2 space-y-2">
          <p className="text-sm text-secondary">
            <span className="font-medium">Topic:</span> {mentee.topic}
          </p>
          {mentee.outcomes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Publications:</p>
              <ul className="space-y-1">
                {mentee.outcomes.map((outcome, i) => (
                  <li key={i} className="text-sm text-secondary leading-relaxed">
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function MentoringSection() {
  const ongoing = (mentoring as Mentee[]).filter((m) => m.status === "ongoing");
  const previous = (mentoring as Mentee[]).filter((m) => m.status === "previous");

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Mentoring</h2>
      <p className="text-sm text-secondary mb-6">
        I&apos;m always excited to mentor new individuals. Feel free to reach out
        via e-mail if you&apos;re interested in exploring a collaboration!
      </p>

      <h3 className="text-base font-medium mb-2">Ongoing</h3>
      <ul className="mb-8">
        {ongoing.map((mentee) => (
          <MenteeEntry key={mentee.name} mentee={mentee} />
        ))}
      </ul>

      <h3 className="text-base font-medium mb-2">Previous</h3>
      <ul>
        {previous.map((mentee) => (
          <MenteeEntry key={mentee.name} mentee={mentee} />
        ))}
      </ul>
    </section>
  );
}
