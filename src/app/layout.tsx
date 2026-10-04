import type { Metadata } from "next";
import { Figtree } from "next/font/google";
// The stylesheet is provided by the app's runtime build configuration.
// @ts-expect-error TypeScript cannot resolve CSS side-effect imports here.
import "./globals.css";
import { cn } from "@/lib/utils";
import type { Viewport } from "next";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0f3d3a",
};

export const metadata: Metadata = {
  title: "Kipia — Business Metrics",
  description: "Revenue, customers, subscriptions and expenses in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", figtree.variable)}>
      <body className={cn("font-sans", figtree.variable)}>{children}</body>
    </html>
  );
}
