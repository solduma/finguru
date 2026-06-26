import { notFound } from "next/navigation";
import StrategyQuiz, { type StrategyMeta } from "@/components/StrategyQuiz";
import { getStrings, isLocale } from "@/lib/i18n";
import { STRATEGIES } from "@/lib/strategies";

// The former flat learning path is now the "Find My Strategy" quiz, which
// routes the user to the per-strategy path under /strategies/[id].
export default async function PathPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getStrings(locale);

  const strategies = Object.fromEntries(
    STRATEGIES.map((s) => [
      s.id,
      { id: s.id, label: s.label[locale], blurb: s.blurb[locale] } as StrategyMeta,
    ]),
  );

  return <StrategyQuiz locale={locale} strategies={strategies} t={t.quiz} />;
}
