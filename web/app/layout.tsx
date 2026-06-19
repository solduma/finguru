import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinGuru — Technical Analysis, Beginner to Pro",
  description:
    "A thorough, beginner-friendly study guide to technical analysis: the masters who built it and the tools they left behind.",
};

// The visible <html>/<body> chrome (with the right lang) is rendered by the
// per-locale layout. This root only carries global metadata and styles.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
