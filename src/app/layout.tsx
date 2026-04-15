import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jee-weon Jung",
    template: "%s | Jee-weon Jung",
  },
  description:
    "Senior Research Scientist at Apple. Speech processing, audio anti-spoofing, and speaker recognition.",
  openGraph: {
    title: "Jee-weon Jung",
    description:
      "Senior Research Scientist at Apple. Speech processing, audio anti-spoofing, and speaker recognition.",
    url: "https://jungjee.com",
    siteName: "Jee-weon Jung",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Header />
        <div className="mx-auto max-w-[780px] px-6 pt-6 pb-12">
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
