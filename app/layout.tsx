import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "../components/inline-script";
import { education, personalInfo, siteLinks } from "../data/site";
import { revealBodyScript, revealHeadScript } from "../lib/reveal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://paswanraju.com";
const title = "Raju Kumar Paswan | Computer Science Student & Software Developer";
const description = "Computer Science student at UTA building projects across systems, AI, and the web.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: siteUrl, siteName: personalInfo.name, type: "website" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script adds data-js-reveal to <html> before React hydrates.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={revealHeadScript} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <InlineScript html={revealBodyScript} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: personalInfo.name,
            jobTitle: "Computer Science Student",
            affiliation: { "@type": "CollegeOrUniversity", name: education.school },
            url: siteUrl,
            email: personalInfo.email,
            sameAs: [siteLinks.github, siteLinks.linkedin],
          }) }}
        />
      </body>
    </html>
  );
}
