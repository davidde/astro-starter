import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';


const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory, ignoring files prefixed with `_`:
  loader: glob({ base: './src/content/blog', pattern: '**/[^_]*.{md,mdx}' }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date().optional(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      author: z.string().default('David Deprost'),
    }),
});

export const collections = { blog };
