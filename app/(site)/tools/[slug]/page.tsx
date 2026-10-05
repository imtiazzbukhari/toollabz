import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import ToolWorkspaceShell from "@/components/ToolWorkspaceShell";
import { capStaticParams } from "@/lib/build/static-generation";
import { toolMap, tools } from "@/lib/tools/data";
import { breadcrumbSchema, generateFAQSchema, toolMetadata, toolSchema } from "@/lib/seo";
import { getToolInsight } from "@/lib/tools/tool-insights";
import { getToolFaqs } from "@/lib/tools/content";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const sorted = [...tools].sort((a, b) => a.slug.localeCompare(b.slug));
  return capStaticParams(sorted.map((tool) => ({ slug: tool.slug })));
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
  const insight = getToolInsight(tool.slug);
  const path = `/tools/${tool.slug}`;
  const faqs = getToolFaqs(tool);
  const breadcrumbLd = breadcrumbSchema(tool, path);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema(tool, path)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(faqs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ToolLayout tool={tool}>
        <ToolWorkspaceShell tool={tool} insight={insight} />
      </ToolLayout>
    </>
  );
}
