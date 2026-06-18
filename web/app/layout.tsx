import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "FinGuru — Technical Analysis, Beginner to Pro",
  description:
    "A thorough, beginner-friendly study guide to technical analysis: the masters who built it and the tools they left behind.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-white/10">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <Link href="/" className="font-bold text-teal-300 no-underline">
              FinGuru
            </Link>
            <Link href="/path" className="text-sm text-gray-300 no-underline">
              Learning Path
            </Link>
            <Link href="/gurus" className="text-sm text-gray-300 no-underline">
              Gurus
            </Link>
            <Link
              href="/indicators"
              className="text-sm text-gray-300 no-underline"
            >
              Indicators
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        <ChatWidget />
      </body>
    </html>
  );
}
