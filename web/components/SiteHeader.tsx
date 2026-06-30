"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LocaleSwitcher from "./LocaleSwitcher";
import Reveal from "@/components/Reveal";
import { getStrings, type Locale } from "@/lib/i18n";

/**
 * Site header. On wide screens the nav links sit inline; on narrow screens they
 * collapse behind a hamburger toggle so the row never overflows the viewport.
 */
export default function SiteHeader({
  locale,
  showLogout,
}: {
  locale: Locale;
  showLogout: boolean;
}) {
  const t = getStrings(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!closing) return;
    const id = setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 350);
    return () => clearTimeout(id);
  }, [closing]);

  const links = [
    { href: `/${locale}/strategies`, label: t.nav.strategies },
    { href: `/${locale}/schools`, label: t.nav.schools },
    { href: `/${locale}/gurus`, label: t.nav.gurus },
    { href: `/${locale}/indicators`, label: t.nav.indicators },
  ];

  const logoutLabel = locale === "ko" ? "로그아웃" : "Log out";

  return (
    <header className="border-b border-white/10">
      <nav className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:gap-6 sm:px-6">
        <Link
          href={`/${locale}`}
          className="font-bold text-teal-300 no-underline"
          onClick={() => setOpen(false)}
        >
          {t.brand}
        </Link>

        {/* Inline links — desktop only. */}
        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                data-active={active ? "true" : undefined}
                className="text-sm text-gray-300 no-underline hover:text-teal-300 underline-grow"
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-4">
          <LocaleSwitcher current={locale} />
          {showLogout && (
            <a
              href="/logout"
              className="hidden text-sm text-gray-400 no-underline hover:text-gray-200 md:inline"
            >
              {logoutLabel}
            </a>
          )}

          {/* Hamburger — mobile/tablet only. */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => {
              if (open) {
                setClosing(true);
              } else {
                setOpen(true);
              }
            }}
            className="-mr-1.5 inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-300 hover:text-teal-300 md:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="menu-icon"
              data-open={open && !closing ? "true" : "false"}
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Collapsible mobile menu. */}
      {(open || closing) && (
        <div
          className="border-t border-white/10 md:hidden mobile-menu-enter"
          style={closing ? { animationDirection: "reverse" } : undefined}
          onAnimationEnd={() => {
            if (closing) {
              setOpen(false);
              setClosing(false);
            }
          }}
        >
          <div className="mx-auto flex max-w-5xl flex-col px-4 py-2 sm:px-6">
            {links.map((l, i) => {
              const active = pathname === l.href || pathname.startsWith(l.href + "/");
              return (
                <Reveal key={l.href} index={i}>
                  <Link
                    href={l.href}
                    onClick={() => {
                      setOpen(false);
                      setClosing(false);
                    }}
                    data-active={active ? "true" : undefined}
                    className={
                      // No underline-grow here: that animated underline is a
                      // horizontal-nav affordance and in this vertical list it
                      // renders as a line crossing the row below it.
                      "rounded-md px-2 py-3 text-base no-underline " +
                      (active
                        ? "text-teal-300"
                        : "text-gray-300 hover:text-teal-300")
                    }
                  >
                    {l.label}
                  </Link>
                </Reveal>
              );
            })}
            {showLogout && (
              <a
                href="/logout"
                className="rounded-md px-2 py-3 text-sm text-gray-400 no-underline hover:text-gray-200"
              >
                {logoutLabel}
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
