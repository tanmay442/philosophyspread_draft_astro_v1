import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const essays = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/essays" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default("Anonymous"),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    imageSrc: z.string(),
    imageAlt: z.string(),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
  }),
});

const logicModules = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/logic-modules" }),
  schema: z.object({
    moduleNumber: z.string(),
    title: z.string(),
    description: z.string(),
    category: z.string(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
    prerequisites: z.array(z.string()).default([]),
  }),
});

const bits = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/bits" }),
  schema: z.object({
    bitNumber: z.string(),
    category: z.string(),
    content: z.string(),
    author: z.string(),
    timestamp: z.coerce.date(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
  }),
});

export const collections = { essays, logicModules, bits, pages };
