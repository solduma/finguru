import { notFound } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";
import SiteHeader from "@/components/SiteHeader";
import ServiceWorker from "@/components/ServiceWorker";
import { LOCALES, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      {/* Browser extensions (e.g. Grammarly) inject data-* attributes onto
          <body> before hydration, which React flags as a mismatch.
          suppressHydrationWarning tolerates those shallow attribute diffs on
          this element only — it does not mask real hydration bugs elsewhere. */}
      <body suppressHydrationWarning>
        <ServiceWorker />
        <SiteHeader locale={locale} showLogout={Boolean(process.env.AUTH_SECRET)} />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>
        {/* The chat tutor shows by default. On a frontend-only deploy (no Python
            RAG backend reachable), set NEXT_PUBLIC_CHAT_ENABLED=0 to hide it. */}
        {process.env.NEXT_PUBLIC_CHAT_ENABLED !== "0" && (
          <ChatWidget locale={locale} />
        )}
      </body>
    </html>
  );
}
