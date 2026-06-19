"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LOCALES, LOCALE_LABEL, isLocale, type Locale } from "@/lib/i18n";

/** Swaps the leading /<locale> segment of the current path, preserving the rest. */
function swapLocale(pathname: string, target: Locale): string {
  const parts = pathname.split("/");
  // parts[0] === "" (leading slash); parts[1] is the current locale segment.
  if (parts.length > 1 && isLocale(parts[1])) {
    parts[1] = target;
    return parts.join("/") || `/${target}`;
  }
  return `/${target}`;
}

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname() || `/${current}`;
  return (
    <div className="flex items-center gap-2 text-sm">
      {LOCALES.map((loc) => (
        <Link
          key={loc}
          href={swapLocale(pathname, loc)}
          className={
            "no-underline " +
            (loc === current
              ? "font-semibold text-teal-300"
              : "text-gray-400 hover:text-gray-200")
          }
        >
          {LOCALE_LABEL[loc]}
        </Link>
      ))}
    </div>
  );
}
