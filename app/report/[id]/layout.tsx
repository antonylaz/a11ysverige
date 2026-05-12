import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tillgänglighetsrapport — A11ySverige",
  robots: { index: false, follow: false },
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="report-root">{children}</div>;
}
