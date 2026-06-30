import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Callout from "./Callout";
import LineChart from "./charts/LineChart";
import CandleChart from "./charts/CandleChart";
import BarChart from "./charts/BarChart";
import ScatterChart from "./charts/ScatterChart";
import ConceptDiagram from "./charts/ConceptDiagram";
import GlossaryTerm from "./GlossaryTerm";
import { remarkGlossary } from "@/lib/glossary/remarkGlossary";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n";

const components = {
  Callout,
  LineChart,
  CandleChart,
  BarChart,
  ScatterChart,
  ConceptDiagram,
  GlossaryTerm,
};

export default function Mdx({
  source,
  locale = DEFAULT_LOCALE,
}: {
  source: string;
  locale?: Locale;
}) {
  return (
    <article className="prose prose-invert prose-teal max-w-none prose-headings:scroll-mt-24 prose-reveal">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, [remarkGlossary, { locale }]],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </article>
  );
}
