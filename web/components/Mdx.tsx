import { MDXRemote } from "next-mdx-remote-client/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Callout from "./Callout";
import LineChart from "./charts/LineChart";
import CandleChart from "./charts/CandleChart";

const components = { Callout, LineChart, CandleChart };

export default function Mdx({ source }: { source: string }) {
  return (
    <article className="prose prose-invert prose-teal max-w-none prose-headings:scroll-mt-24">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </article>
  );
}
