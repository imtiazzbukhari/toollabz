import { buildSitemapEntries, renderSitemapXml } from "../lib/content-engine/sitemap-data";

process.stdout.write(renderSitemapXml(buildSitemapEntries(new Date())));
