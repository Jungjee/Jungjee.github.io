import ExperienceTimeline from "@/components/ExperienceTimeline";

const honors = [
  "Ranked 1st place at the DCASE 2024 Challenge Task 6 (automated audio captioning)",
  "Ranked 1st place at the DCASE 2023 Challenge Task 6-a (automated audio captioning)",
  "Ranked 3rd place at the Third DIHARD Speech Diarisation Challenge (track 1 core)",
];

export default function Home() {
  return (
    <>
      <hr />

      {/* Bio — white band */}
      <div className="band">
        <div className="band-inner">
          <div className="text-[17px] leading-relaxed max-w-[700px]">
            Welcome to my website. I&apos;m dedicated to advancing speech processing and machine learning.
            My expertise lies in audio anti-spoofing and speaker recognition, areas that are vital for
            the security and reliability of speech technologies. With a PhD from University of Seoul,
            research scientist experience at Naver Corporation, and postdoc experience at Carnegie Mellon
            University, I&apos;ve had the privilege of working on cutting-edge research projects. My work
            has been honored with first-place awards in international challenges, and I&apos;ve published
            over 90 papers in leading academic journals and conferences.
          </div>
        </div>
      </div>

      {/* Experience — blue band */}
      <div className="band-alt">
        <div className="band-inner">
          <ExperienceTimeline />
        </div>
      </div>

      {/* Honors — white band */}
      <div className="band">
        <div className="band-inner">
          <div className="section-title">honors</div>
          <ul className="list-none p-0 m-0">
            {honors.map((honor) => (
              <li key={honor} className="text-[15px] text-primary py-2.5 border-b border-rule last:border-0 flex items-center gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-accent shrink-0" />
                {honor}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
