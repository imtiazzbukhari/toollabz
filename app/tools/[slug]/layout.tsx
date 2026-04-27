import { toolMap, tools } from "@/lib/tools/data";
import {
  breadcrumbSchema,
  faqSchema,
  howToSchema,
  relatedToolsItemListSchema,
  toolSchema,
  webPageSchema,
} from "@/lib/seo";
import { getRelatedToolsForLayout } from "@/lib/tools/related";

export default async function ToolSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = toolMap.get(slug);
  if (!tool) {
    return <>{children}</>;
  }
  const path = `/tools/${tool.slug}`;
  const relatedForSchema = getRelatedToolsForLayout(tool, tools);
  const relatedListJson = relatedToolsItemListSchema(tool, relatedForSchema);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema({ name: tool.name, description: tool.description, path })),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema(tool, path)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(tool)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema(tool, path)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(tool, path)) }}
      />
      {relatedListJson ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(relatedListJson) }} />
      ) : null}
      {children}
    </>
  );
}
