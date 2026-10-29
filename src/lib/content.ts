import { getCollection } from 'astro:content';


// All entries of the blog collection: the posts (`2026/my-post`) as well as their
// subposts (`2026/my-post/docs`), which hold supporting material for a post.
// Drafts are only included in development.
export async function getBlogEntries() {
  return getCollection('blog', ({ data }) => !import.meta.env.PROD || !data.draft);
}

// Only the blog posts themselves, without their subposts, newest first.
// (Subposts are still built, but only discoverable via links in their post.)
export async function getBlogPosts() {
  const entries = await getBlogEntries();

  return entries
    // Filter out sub-pages like "2026/my-post/docs", and keep only
    // the bundle root index files like e.g. "2026/my-post/":
    .filter((entry) => entry.id.split('/').length <= 2)
    // Treat missing dates as Infinity, so undated posts stay pinned at the top:
    .sort((a, b) => (b.data.pubDate?.valueOf() ?? Infinity) - (a.data.pubDate?.valueOf() ?? Infinity));
}
