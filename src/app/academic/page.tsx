import type { Metadata } from "next";
import PublicationList from "@/components/PublicationList";
import MentoringSection from "@/components/MentoringSection";

export const metadata: Metadata = {
  title: "Academic",
  description:
    "Selected publications, mentoring, and research resources by Jee-weon Jung.",
};

const challenges = [
  { name: "SASV 2022", url: "https://sasv-challenge.github.io/" },
  {
    name: "VoxSRC 2022 Challenge",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2022.html",
  },
  {
    name: "VoxSRC 2022 Workshop",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2022.html",
  },
  {
    name: "VoxSRC 2023 Challenge",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2023.html",
  },
  {
    name: "VoxSRC 2023 Workshop",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2023.html",
  },
  {
    name: "ASVspoof 5 Workshop",
    url: "https://www.asvspoof.org/workshop2024",
  },
];

type Dataset =
  | { name: string; url: string; host: string }
  | { name: string; urls: { url: string; host: string }[] };

const datasets: Dataset[] = [
  {
    name: "TITW",
    url: "https://huggingface.co/datasets/jungjee/titw",
    host: "HuggingFace",
  },
  {
    name: "SpoofCeleb",
    url: "https://huggingface.co/datasets/jungjee/spoofceleb",
    host: "HuggingFace",
  },
  {
    name: "ASVspoof 5",
    urls: [
      {
        url: "https://huggingface.co/datasets/jungjee/asvspoof5",
        host: "HuggingFace",
      },
      {
        url: "https://zenodo.org/records/14498691",
        host: "Zenodo",
      },
    ],
  },
];

export default function AcademicPage() {
  return (
    <article className="space-y-12 py-8">
      <PublicationList />
      <MentoringSection />

      <section>
        <h2 className="text-lg font-semibold mb-4">Resources</h2>

        <h3 className="text-base font-medium mb-2">
          Challenge &amp; Workshop Organizations
        </h3>
        <ul className="space-y-1 mb-6">
          {challenges.map((c) => (
            <li key={c.url} className="text-sm">
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.name}
              </a>
            </li>
          ))}
        </ul>

        <h3 className="text-base font-medium mb-2">Datasets</h3>
        <ul className="space-y-1">
          {datasets.map((d) => (
            <li key={d.name} className="text-sm">
              <span className="font-medium">{d.name}</span>:{" "}
              {"urls" in d
                ? d.urls.map((link, i) => (
                    <span key={link.url}>
                      {i > 0 && ", "}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.host}
                      </a>
                    </span>
                  ))
                : (
                    <a href={d.url} target="_blank" rel="noopener noreferrer">
                      {d.host}
                    </a>
                  )}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
