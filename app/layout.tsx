import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { InlineScript } from "../components/inline-script";
import { education, personalInfo, siteLinks } from "../data/site";
import { revealBodyScript, revealHeadScript } from "../lib/reveal";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://paswanraju.com";
const title = "Raju Kumar Paswan | Software Developer";
const description = "Computer Science student at UT Arlington building software across systems, AI, and the web.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  // The preview image comes from app/opengraph-image.tsx and the tab icon from app/icon.tsx.
  openGraph: { title, description, url: siteUrl, siteName: personalInfo.name, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script adds data-js-reveal to <html> before React hydrates.
    <html
      lang="en"
      className={`${inter.variable} ${inter.className} h-full antialiased`}
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
