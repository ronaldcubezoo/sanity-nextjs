import type { Metadata, Viewport } from "next";

/** Do not re-export from `next-sanity/studio` here — it can pull client code into the RSC graph. */
export const metadata: Metadata = {
  title: "Content editor — Sanity",
  referrer: "same-origin",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] min-h-0 bg-[#101112]">{children}</div>
  );
}
