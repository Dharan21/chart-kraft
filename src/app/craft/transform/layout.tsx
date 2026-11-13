import type { Metadata } from "next";

// App screens need an in-memory dataset, so keep them out of search indexes.
export const metadata: Metadata = {
  title: "Transform data",
  robots: { index: false, follow: false },
};

export default function TransformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
