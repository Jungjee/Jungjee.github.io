import ExperienceTimeline from "@/components/ExperienceTimeline";

const honors = [
  { title: "DCASE 2024 Challenge Task 6", result: "1st place", topic: "Automated Audio Captioning" },
  { title: "DCASE 2023 Challenge Task 6-a", result: "1st place", topic: "Automated Audio Captioning" },
  { title: "Third DIHARD Challenge", result: "3rd place", topic: "Speaker Diarisation" },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center text-white font-bold text-lg">
            JJ
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Jee-weon Jung</h1>
            <p className="text-secondary text-sm">Senior Research Scientist at Apple</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-accent via-accent-light to-transparent my-6" />
        <p className="text-base leading-relaxed text-secondary max-w-prose">
          I&apos;m dedicated to advancing speech processing and machine learning.
          My expertise lies in <span className="text-primary font-medium">audio anti-spoofing</span> and{" "}
          <span className="text-primary font-medium">speaker recognition</span>, areas
          vital for the security and reliability of speech technologies.
          With a PhD from University of Seoul, experience at Naver and Carnegie Mellon,
          I&apos;ve published over 90 papers and won first-place in international challenges.
        </p>
      </section>

      {/* Experience & Education */}
      <ExperienceTimeline />

      {/* Honors */}
      <section>
        <h2 className="section-heading">Honors &amp; Awards</h2>
        <div className="grid gap-3">
          {honors.map((h) => (
            <div key={h.title} className="card flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{h.title}</p>
                <p className="text-xs text-secondary mt-0.5">{h.topic}</p>
              </div>
              <span className={`badge ${h.result === "1st place" ? "" : "badge-muted"} whitespace-nowrap`}>
                {h.result}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
