import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://a11ysverige.se";
const SITE_NAME = "A11ySverige";
const TITLE = "A11ySverige — Gratis tillgänglighetsskanner för svenska webbplatser";
const DESCRIPTION =
  "Skanna din webbplats mot WCAG 2.1 AA och EU:s tillgänglighetsdirektiv (EAA). Gratis, på sekunder, på svenska.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · A11ySverige",
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "WCAG 2.1",
    "tillgänglighet",
    "EAA",
    "European Accessibility Act",
    "skanner",
    "Sverige",
    "axe-core",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sv"
      className={`${fraunces.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <body>
        {children}
        {PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
