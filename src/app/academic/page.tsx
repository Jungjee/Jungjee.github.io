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
  { name: "VoxSRC 2022 Challenge", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2022.html" },
  { name: "VoxSRC 2022 Workshop", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2022.html" },
  { name: "VoxSRC 2023 Challenge", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2023.html" },
  { name: "VoxSRC 2023 Workshop", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2023.html" },
  { name: "ASVspoof 5 Workshop", url: "https://www.asvspoof.org/workshop2024" },
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
    <>
      <hr />

      {/* Publications — white */}
      <div className="band">
        <div className="band-inner">
          <PublicationList />
        </div>
      </div>

      {/* Mentoring — blue band */}
      <div className="band-alt">
        <div className="band-inner">
          <MentoringSection />
        </div>
      </div>

      {/* Resources — white */}
      <div className="band">
        <div className="band-inner">
          <div className="section-title">resources</div>

          <h3 className="text-[15px] font-semibold text-secondary uppercase tracking-wide mb-3">
            Challenge &amp; Workshop Organizations
          </h3>
          <ul className="list-none p-0 m-0 mb-8">
            {challenges.map((c) => (
              <li key={c.url} className="text-[15px] py-1">
                <a href={c.url} target="_blank" rel="noopener noreferrer">{c.name}</a>
              </li>
            ))}
          </ul>

          <h3 className="text-[15px] font-semibold text-secondary uppercase tracking-wide mb-3">
            Datasets
          </h3>
          <ul className="list-none p-0 m-0">
            {datasets.map((d) => (
              <li key={d.name} className="text-[15px] py-1">
                <span className="font-medium">{d.name}</span>:{" "}
                {"urls" in d
                  ? d.urls.map((link, i) => (
                      <span key={link.url}>
                        {i > 0 && " · "}
                        <a href={link.url} target="_blank" rel="noopener noreferrer">{link.host}</a>
                      </span>
                    ))
                  : <a href={d.url} target="_blank" rel="noopener noreferrer">{d.host}</a>
                }
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
