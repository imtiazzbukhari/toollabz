import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import ToolWorkspaceShell from "@/components/ToolWorkspaceShell";
import { toolMap, tools } from "@/lib/tools/data";
import {
  breadcrumbSchema,
  faqSchema,
  relatedToolsItemListSchema,
  toolMetadata,
  toolSchema,
  webPageSchema,
} from "@/lib/seo";
import { getToolInsight } from "@/lib/tools/tool-insights";
import { getRelatedToolsForLayout } from "@/lib/tools/related";

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolMap.get(slug);
  if (!tool) return {};
  return toolMetadata(tool);
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolMap.get(slug);
  if (!tool) notFound();
  const path = `/tools/${tool.slug}`;
  const insight = getToolInsight(tool.slug);
  const relatedForSchema = getRelatedToolsForLayout(tool, tools);
  const relatedListJson = relatedToolsItemListSchema(tool, relatedForSchema);

  return (
    <>
      <ToolLayout tool={tool}>
        <ToolWorkspaceShell tool={tool} insight={insight} />
      </ToolLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema({ name: tool.name, description: tool.description, path })) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema(tool, path)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(tool)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(tool, path)) }} />
      {relatedListJson ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedListJson) }} />
      ) : null}
    </>
  );
}
