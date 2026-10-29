import { getCollection } from 'astro:content';


// `getBlogPosts()` only returns the index file of each blogpost folder in
// `content/blog/year/` as "BlogPost". Subposts of a Blogpost will still be built,
// e.g. `content/blog/2026/markdown-style-guide/docs`, but NOT be listed as BlogPost.
// These "subposts" are simply a convenience for adding supportive material.
export async function getBlogPosts() {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? !data.draft : true;
  });

  return posts
    // Filter out sub-pages like "2026/my-post/docs", and keep only
    // the bundle root index files like e.g. "2026/my-post/":
    // (Astro will still build the supporting sub-pages, but you'll
    // have to explicitly link them if you want users to discover them)
    .filter((post) => post.id.split('/').length <= 2)
    // Clean the ID for routing, "2026/my-post/index" -> "2026/my-post":
    .sort((a, b) => { // Treat missing dates as Infinity, so undated posts stay pinned at the top:
      const dateA = a.data.pubDate ? a.data.pubDate.valueOf() : Infinity;
      const dateB = b.data.pubDate ? b.data.pubDate.valueOf() : Infinity;
      return dateB - dateA;
    });
}
