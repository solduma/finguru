import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinGuru — Technical Analysis, Beginner to Pro",
  description:
    "A thorough, beginner-friendly study guide to technical analysis: the masters who built it and the tools they left behind.",
  applicationName: "FinGuru",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "FinGuru",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0e14",
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
