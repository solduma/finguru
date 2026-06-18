import type { ReactNode } from "react";

type CalloutType = "key" | "note" | "warning";

const STYLES: Record<CalloutType, { border: string; bg: string; label: string; icon: string }> = {
  key: {
    border: "border-teal-400/40",
    bg: "bg-teal-400/10",
    label: "Key idea",
    icon: "🔑",
  },
  note: {
    border: "border-sky-400/40",
    bg: "bg-sky-400/10",
    label: "Note",
    icon: "📝",
  },
  warning: {
    border: "border-amber-400/40",
    bg: "bg-amber-400/10",
    label: "Watch out",
    icon: "⚠️",
  },
};

export default function Callout({
  type = "note",
  children,
}: {
  type?: CalloutType;
  children: ReactNode;
}) {
  const s = STYLES[type] ?? STYLES.note;
  return (
    <div className={`my-5 rounded-lg border ${s.border} ${s.bg} px-4 py-3`}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-300">
        {s.icon} {s.label}
      </div>
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </div>
  );
}
