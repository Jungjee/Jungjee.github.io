interface TimelineEntry {
  title: string;
  organization: string;
  period: string;
  description?: string;
}

const experience: TimelineEntry[] = [
  { title: "Senior Research Scientist", organization: "Apple", period: "2024 –", description: "Speech processing and machine learning research." },
  { title: "Postdoctoral Research Associate", organization: "Carnegie Mellon University", period: "2023 – 2024" },
  { title: "Research Scientist", organization: "Naver Clova", period: "2020 – 2023" },
];

const education: TimelineEntry[] = [
  { title: "PhD, Computer Science and Engineering", organization: "University of Seoul", period: "2017 – 2021" },
  { title: "BS, Computer Science and Engineering & BBA", organization: "University of Seoul", period: "2013 – 2017" },
];

function TimelineSection({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.period} className="grid grid-cols-[80px_40px_1fr] mb-0">
          {/* Year */}
          <div className="text-sm text-right pr-2 text-muted pt-0.5">
            {entry.period}
          </div>
          {/* Dot + line */}
          <div className="relative border-l-2 border-rule flex justify-start">
            <div className="absolute top-1.5 -left-[5px] w-2 h-2 rounded-full bg-accent border-2 border-band" />
          </div>
          {/* Content */}
          <div className="pl-3 pb-5 text-[17px]">
            <span className="font-normal">{entry.title}</span>
            {" at "}
            <span>{entry.organization}</span>
            {entry.description && (
              <div className="text-secondary text-[15px] mt-1">{entry.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <>
      <div className="section-title">experience</div>
      <TimelineSection entries={experience} />

      <div className="section-title">education</div>
      <TimelineSection entries={education} />
    </>
  );
}
