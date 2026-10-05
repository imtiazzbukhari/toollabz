import type { BlogAuthor } from "./types";

/**
 * Default byline for guides without a named author. Toollabz is credited as the publisher
 * (an Organization in JSON-LD), not as a fictitious person or review board.
 */
export const DEFAULT_BLOG_AUTHOR: BlogAuthor = {
  name: "Toollabz",
  jobTitle: "Publisher",
  bio: "Guides on Toollabz are written and maintained by the Toollabz site team, led by founder Imtiaz Ahmad. Where a guide relies on tax rates or official rules it links to the primary source, and every calculator page documents its formula. Guides are general information, not professional advice.",
  profilePath: "/about",
};
