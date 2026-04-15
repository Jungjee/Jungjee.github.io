interface TimelineEntry {
  title: string;
  organization: string;
  period: string;
  current?: boolean;
}

const experience: TimelineEntry[] = [
  { title: "Senior Research Scientist", organization: "Apple", period: "2024 – present", current: true },
  { title: "Postdoctoral Research Associate", organization: "Carnegie Mellon University", period: "2023 – 2024" },
  { title: "Research Scientist", organization: "Naver Clova", period: "2020 – 2023" },
];

const education: TimelineEntry[] = [
  { title: "PhD, Computer Science and Engineering", organization: "University of Seoul", period: "2017 – 2021" },
  { title: "BS, Computer Science and Engineering & BBA", organization: "University of Seoul", period: "2013 – 2017" },
];

function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <div className="relative ml-3">
      {/* Vertical line */}
      <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
      <ul className="space-y-0">
        {items.map((entry) => (
          <li key={entry.period} className="relative pl-6 pb-6 last:pb-0">
            {/* Dot */}
            <div
              className={`absolute left-0 top-2 w-2 h-2 rounded-full -translate-x-[3.5px] ${
                entry.current
                  ? "bg-accent ring-4 ring-accent-light"
                  : "bg-border"
              }`}
            />
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                <div>
                  <span className="font-medium text-sm">{entry.title}</span>
                  <span className="text-secondary text-sm"> · {entry.organization}</span>
                </div>
                <span className="text-xs text-secondary whitespace-nowrap font-mono">{entry.period}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="section-heading">Experience</h2>
        <Timeline items={experience} />
      </section>
      <section>
        <h2 className="section-heading">Education</h2>
        <Timeline items={education} />
      </section>
    </div>
  );
}
