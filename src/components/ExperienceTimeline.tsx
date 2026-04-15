interface TimelineEntry {
  title: string;
  organization: string;
  period: string;
}

const experience: TimelineEntry[] = [
  {
    title: "Senior Research Scientist",
    organization: "Apple",
    period: "2024 – present",
  },
  {
    title: "Postdoctoral Research Associate",
    organization: "Carnegie Mellon University",
    period: "2023 – 2024",
  },
  {
    title: "Research Scientist",
    organization: "Naver Clova",
    period: "2020 – 2023",
  },
];

const education: TimelineEntry[] = [
  {
    title: "PhD, Computer Science and Engineering",
    organization: "University of Seoul",
    period: "2017 – 2021",
  },
  {
    title: "BS, Computer Science and Engineering & BBA",
    organization: "University of Seoul",
    period: "2013 – 2017",
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold mb-4">Experience</h2>
        <ul className="space-y-3">
          {experience.map((entry) => (
            <li key={entry.period} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <div>
                <span className="font-medium">{entry.title}</span>
                <span className="text-secondary"> · {entry.organization}</span>
              </div>
              <span className="text-sm text-secondary whitespace-nowrap">{entry.period}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-4">Education</h2>
        <ul className="space-y-3">
          {education.map((entry) => (
            <li key={entry.period} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <div>
                <span className="font-medium">{entry.title}</span>
                <span className="text-secondary"> · {entry.organization}</span>
              </div>
              <span className="text-sm text-secondary whitespace-nowrap">{entry.period}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
