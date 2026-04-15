import type { Metadata } from "next";
import PublicationList from "@/components/PublicationList";
import MentoringSection from "@/components/MentoringSection";

export const metadata: Metadata = {
  title: "Academic",
  description:
    "Selected publications, mentoring, and research resources by Jee-weon Jung.",
};

const challenges = [
  { name: "SASV 2022", url: "https://sasv-challenge.github.io/", type: "Challenge" },
  { name: "VoxSRC 2022", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2022.html", type: "Challenge" },
  { name: "VoxSRC 2022", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2022.html", type: "Workshop" },
  { name: "VoxSRC 2023", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2023.html", type: "Challenge" },
  { name: "VoxSRC 2023", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2023.html", type: "Workshop" },
  { name: "ASVspoof 5", url: "https://www.asvspoof.org/workshop2024", type: "Workshop" },
];

type Dataset =
  | { name: string; url: string; host: string }
  | { name: string; urls: { url: string; host: string }[] };

const datasets: Dataset[] = [
  { name: "TITW", url: "https://huggingface.co/datasets/jungjee/titw", host: "HuggingFace" },
  { name: "SpoofCeleb", url: "https://huggingface.co/datasets/jungjee/spoofceleb", host: "HuggingFace" },
  {
    name: "ASVspoof 5",
    urls: [
      { url: "https://huggingface.co/datasets/jungjee/asvspoof5", host: "HuggingFace" },
      { url: "https://zenodo.org/records/14498691", host: "Zenodo" },
    ],
  },
];

export default function AcademicPage() {
  return (
    <div className="space-y-16">
      <PublicationList />
      <MentoringSection />

      <section>
        <h2 className="section-heading">Resources</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold mb-3">Challenge &amp; Workshop Organizations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {challenges.map((c) => (
                <a
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card flex items-center justify-between gap-2 no-underline group"
                >
                  <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{c.name}</span>
                  <span className="badge badge-muted text-[0.65rem]">{c.type}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Datasets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {datasets.map((d) => (
                <div key={d.name} className="card">
                  <p className="text-sm font-medium mb-1.5">{d.name}</p>
                  <div className="flex items-center gap-2">
                    {"urls" in d
                      ? d.urls.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="badge text-[0.65rem]"
                          >
                            {link.host} &rarr;
                          </a>
                        ))
                      : (
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="badge text-[0.65rem]"
                          >
                            {d.host} &rarr;
                          </a>
                        )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
