import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://paswanraju.com"),
  title: "Raju Kumar Paswan | Software Engineer",
  description:
    "Computer Science student and software engineer building systems, AI applications, cloud infrastructure, and interactive web experiences.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Raju Kumar Paswan | Software Engineer",
    description: "Computer Science student and software engineer building systems, AI applications, cloud infrastructure, and interactive web experiences.",
    url: "https://paswanraju.com",
    siteName: "Raju Kumar Paswan",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Raju Kumar Paswan | Software Engineer",
    description: "Computer Science student and software engineer building systems, AI applications, cloud infrastructure, and interactive web experiences.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Raju Kumar Paswan",
            jobTitle: "Software Engineer",
            url: "https://paswanraju.com",
            email: "paswanrajukumar890@gmail.com",
            sameAs: ["https://github.com/PaswanRaju", "https://linkedin.com/in/paswanrajukumar"],
          }) }}
        />
      </body>
    </html>
  );
}
