import ExperienceTimeline from "@/components/ExperienceTimeline";

const honors = [
  "Ranked 1st place at the DCASE 2024 Challenge Task 6 (automated audio captioning)",
  "Ranked 1st place at the DCASE 2023 Challenge Task 6-a (automated audio captioning)",
  "Ranked 3rd place at the Third DIHARD Speech Diarisation Challenge (track 1 core)",
];

export default function Home() {
  return (
    <article className="space-y-12 py-8">
      <section>
        <p className="text-base leading-relaxed">
          Welcome! I&apos;m Jee-weon Jung, a Senior Research Scientist at Apple,
          dedicated to advancing speech processing and machine learning. My
          expertise lies in audio anti-spoofing and speaker recognition, areas
          that are vital for the security and reliability of speech technologies.
          With a PhD from University of Seoul, research scientist experience at
          Naver Corporation, and postdoc experience at Carnegie Mellon
          University, I&apos;ve had the privilege of working on cutting-edge
          research projects. My work has been honored with first-place awards in
          international challenges, and I&apos;ve published over 90 papers in
          leading academic journals and conferences.
        </p>
      </section>

      <ExperienceTimeline />

      <section>
        <h2 className="text-lg font-semibold mb-4">Selected Honors</h2>
        <ul className="space-y-2">
          {honors.map((honor) => (
            <li key={honor} className="text-secondary">
              {honor}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
