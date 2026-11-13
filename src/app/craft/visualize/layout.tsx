import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visualize data",
  robots: { index: false, follow: false },
};

export default function VisualizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
