"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const socialLinks = [
  {
    name: "Google Scholar",
    url: "https://scholar.google.com/citations?user=A5OcLdAAAAAJ",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="iico">
        <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/Jungjee",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="iico">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jee-weon-jung-6b125bba/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="iico">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "ResearchGate",
    url: "https://www.researchgate.net/profile/Jee-Weon-Jung-2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="iico">
        <path d="M19.586 0c-1.326 0-2.652.488-3.66 1.464-1.008.976-1.513 2.252-1.513 3.528v2.336H5.41c-2.98 0-5.41 2.43-5.41 5.41v5.852C0 21.57 2.43 24 5.41 24h5.852c2.98 0 5.41-2.43 5.41-5.41V9.328h2.336c1.276 0 2.552-.504 3.528-1.513C23.512 6.807 24 5.481 24 4.155V4.1c0-1.326-.488-2.652-1.464-3.66C21.56.434 20.573 0 19.586 0zM15.166 18.59c0 2.164-1.74 3.904-3.904 3.904H5.41c-2.164 0-3.904-1.74-3.904-3.904V12.738c0-2.164 1.74-3.904 3.904-3.904h5.852c2.164 0 3.904 1.74 3.904 3.904v5.852zm7.328-14.434c0 1.05-.41 2.097-1.233 2.92-.823.823-1.87 1.233-2.92 1.233h-2.336V5.992c0-1.05.41-2.097 1.233-2.92.823-.823 1.87-1.233 2.92-1.233h.055c1.05 0 2.042.41 2.864 1.233.41.41.823.976 1.068 1.595.245.619.349 1.233.349 1.49z" />
      </svg>
    ),
  },
  {
    name: "Email",
    url: "mailto:jeeweonj@ieee.org",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="iico">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header>
      {/* Top nav bar */}
      <div className="band-inner">
        <nav className="flex items-center gap-4 text-[15px] justify-end py-4">
          {[
            { name: "Home", href: "/" },
            { name: "Academic", href: "/academic" },
          ].map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              {i > 0 && <span className="text-muted">/</span>}
              <Link
                href={link.href}
                className={`no-underline hover:underline ${
                  pathname === link.href ? "text-primary font-medium" : "text-secondary"
                }`}
              >
                {link.name}
              </Link>
            </span>
          ))}
        </nav>
      </div>
      {/* Hero block */}
      <div className="band-inner">
        <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-6 items-start pb-6">
          {/* Photo — square with smooth corners */}
          <div className="text-center sm:text-right">
            <img
              src="/jeeweon.png"
              alt="Jee-weon Jung"
              className="w-[200px] h-[200px] rounded-2xl object-cover inline-block"
            />
          </div>
          {/* Info */}
          <div className="text-center sm:text-left sm:pt-4">
            <h1 className="text-[34px] font-normal m-0 p-0 text-primary">
              Jee-weon Jung
            </h1>
            <h2 className="text-lg font-normal italic text-secondary m-0 mt-1 sm:max-w-[350px]">
              Senior Research Scientist at Apple
            </h2>
            <div className="flex items-center gap-1 mt-3 justify-center sm:justify-start">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="no-underline"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
