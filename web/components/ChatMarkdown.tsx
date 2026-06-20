"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders an assistant chat message as markdown.
 *
 * The tutor is prompted for plain text, but LLMs routinely leak markdown
 * (**bold**, `-` lists, `#` headings, backtick code). Rendering through
 * react-markdown means those degrade to real formatting instead of showing
 * literal asterisks/hashes in the bubble. react-markdown does not use
 * dangerouslySetInnerHTML and ignores raw HTML by default, so this is safe for
 * model-generated text.
 *
 * Styling is tuned for a small dark chat bubble: tight spacing, inline-ish
 * blocks, links open in a new tab.
 */
export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 [&_:first-child]:mt-0 [&_:last-child]:mb-0 [&_p]:my-0 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-base [&_h2]:font-semibold [&_h3]:text-sm [&_h3]:font-semibold [&_code]:rounded [&_code]:bg-black/30 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-black/30 [&_pre]:p-2 [&_pre]:text-[0.85em] [&_a]:text-teal-300 [&_a]:underline [&_strong]:font-semibold [&_table]:block [&_table]:overflow-x-auto [&_th]:border [&_th]:border-white/15 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-white/15 [&_td]:px-2 [&_td]:py-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
