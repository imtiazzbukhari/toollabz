import { notFound } from "next/navigation";
import ToolLayout from "@/components/ToolLayout";
import ToolWorkspaceShell from "@/components/ToolWorkspaceShell";
import { toolMap, tools } from "@/lib/tools/data";
import { toolMetadata } from "@/lib/seo";
import { getToolInsight } from "@/lib/tools/tool-insights";

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
  const insight = getToolInsight(tool.slug);

  return (
    <ToolLayout tool={tool}>
      <ToolWorkspaceShell tool={tool} insight={insight} />
    </ToolLayout>
  );
}
