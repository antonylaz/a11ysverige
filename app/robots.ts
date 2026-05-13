import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://a11ysverige.se";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        // /api and /report (PDF source) stay disallowed.
        // /scan/* is now allowed so social crawlers (LinkedIn, Slack,
        // Twitter) can read the OG image when someone shares a scan URL.
        disallow: ["/api/", "/report/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
