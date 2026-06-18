"use client";

import type { ReactNode } from "react";

/** A consistent figure wrapper: bordered panel, fixed aspect, caption. */
export default function ChartFrame({
  caption,
  height = 300,
  children,
}: {
  caption?: string;
  height?: number;
  children: ReactNode;
}) {
  return (
    <figure className="my-6 not-prose">
      <div
        className="rounded-lg border border-white/10 bg-[#0f131c] p-3"
        style={{ height }}
      >
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-500">
          {caption} <span className="opacity-70">· illustrative</span>
        </figcaption>
      )}
    </figure>
  );
}
