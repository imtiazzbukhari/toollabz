import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ToolWorkspaceShell from "@/components/ToolWorkspaceShell";
import { toolMap, tools } from "@/lib/tools/data";
import { getToolInsight } from "@/lib/tools/tool-insights";
import { capStaticParams } from "@/lib/build/static-generation";

export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  const sorted = [...tools].sort((a, b) => a.slug.localeCompare(b.slug));
  return capStaticParams(sorted.map((tool) => ({ slug: tool.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolMap.get(slug);
  return {
    title: tool ? `${tool.name} Embed` : "Tool Embed",
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolMap.get(slug);
  if (!tool) notFound();
  const insight = getToolInsight(tool.slug);

  return (
    <div className="bg-white">
      <style>{`
        body > header,
        body > footer {
          display: none !important;
        }
        main#main-content {
          min-height: auto !important;
        }
      `}</style>
      <div className="mx-auto max-w-[640px] p-4 font-sans">
        <h1 className="mb-4 text-lg font-bold text-slate-900">{tool.name}</h1>
        <ToolWorkspaceShell tool={tool} insight={insight} />
        <div className="mt-4 border-t border-slate-200 pt-3 text-center text-xs text-slate-500">
          Powered by{" "}
          <Link
            href={`/tools/${tool.slug}`}
            target="_blank"
            rel="noopener"
            className="font-medium text-blue-600 underline-offset-2 hover:underline"
          >
            Toollabz.com
          </Link>{" "}
          - Free Online Tools
        </div>
      </div>
    </div>
  );
}
