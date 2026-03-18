import type { Metadata } from "next";
import "./globals.css";
import { SEO_DATA } from "@/lib/data";

export const metadata: Metadata = {
  title: SEO_DATA.title,
  description: SEO_DATA.description,
  keywords: SEO_DATA.keywords,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
