import Link from "next/link";
import { notFound } from "next/navigation";
import ChatWidget from "@/components/ChatWidget";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { LOCALES, getStrings, isLocale } from "@/lib/i18n";

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
  const t = getStrings(locale);

  return (
    <html lang={locale}>
      {/* Browser extensions (e.g. Grammarly) inject data-* attributes onto
          <body> before hydration, which React flags as a mismatch.
          suppressHydrationWarning tolerates those shallow attribute diffs on
          this element only — it does not mask real hydration bugs elsewhere. */}
      <body suppressHydrationWarning>
        <header className="border-b border-white/10">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
            <Link
              href={`/${locale}`}
              className="font-bold text-teal-300 no-underline"
            >
              {t.brand}
            </Link>
            <Link
              href={`/${locale}/path`}
              className="text-sm text-gray-300 no-underline"
            >
              {t.nav.path}
            </Link>
            <Link
              href={`/${locale}/schools`}
              className="text-sm text-gray-300 no-underline"
            >
              {t.nav.schools}
            </Link>
            <Link
              href={`/${locale}/gurus`}
              className="text-sm text-gray-300 no-underline"
            >
              {t.nav.gurus}
            </Link>
            <Link
              href={`/${locale}/indicators`}
              className="text-sm text-gray-300 no-underline"
            >
              {t.nav.indicators}
            </Link>
            <div className="ml-auto flex items-center gap-4">
              <LocaleSwitcher current={locale} />
              {process.env.AUTH_SECRET && (
                <a
                  href="/logout"
                  className="text-sm text-gray-400 no-underline hover:text-gray-200"
                >
                  {locale === "ko" ? "로그아웃" : "Log out"}
                </a>
              )}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        {/* The chat tutor shows by default. On a frontend-only deploy (no Python
            RAG backend reachable), set NEXT_PUBLIC_CHAT_ENABLED=0 to hide it. */}
        {process.env.NEXT_PUBLIC_CHAT_ENABLED !== "0" && (
          <ChatWidget locale={locale} />
        )}
      </body>
    </html>
  );
}
