import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.object({
        name: z.string(),
        avatar: z.string().optional(),
      }),
      category: z.string(),
      tags: z.array(z.string()).default([]),
      popular: z.boolean().default(false),
      /** Editorial curation flag — powers the homepage's "Popular Articles" picks. Not a metric. */
      featured: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      /**
       * Optional FAQ pairs. When present, ArticleLayout emits FAQPage JSON-LD
       * so eligible questions can show as expandable rich results in Google.
       * Keep answers plain-text and self-contained (no markdown links).
       */
      faq: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string(),
          }),
        )
        .optional(),
    }),
});

/**
 * "AI This Week" — a weekly roundup series, kept in its own collection so it
 * has its own archive, RSS surface, and URL space (/ai-this-week/...), separate
 * from evergreen blog guides. Each file is one issue.
 */
const roundup = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/roundup' }),
  schema: ({ image }) =>
    z.object({
      /** Full headline, e.g. "AI This Week: OpenAI ships X, Google answers with Y". */
      title: z.string(),
      description: z.string(),
      /** The issue's publish date — also drives ordering and the "week of" label. */
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Sequential issue number, shown as "Issue 01". */
      issue: z.number().int().positive(),
      author: z.object({
        name: z.string(),
        avatar: z.string().optional(),
      }),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

/**
 * Comparisons — head-to-head "X vs Y" articles (e.g. ChatGPT vs Claude).
 * Own collection + URL space (/compare/...) because these target high-intent
 * comparison keywords and share a distinct template with a verdict up top.
 */
const comparison = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/compare' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.object({
        name: z.string(),
        avatar: z.string().optional(),
      }),
      /** The two things being compared, for the hero and listing cards. */
      optionA: z.string(),
      optionB: z.string(),
      /** One-line bottom line shown on the listing card. */
      verdict: z.string().optional(),
      category: z.string().default('Comparisons'),
      tags: z.array(z.string()).default([]),
      popular: z.boolean().default(false),
      featured: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      draft: z.boolean().default(false),
      faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    }),
});

/**
 * Glossary — short, single-term definition pages (e.g. RAG, MCP). Each entry
 * is one term at /glossary/<slug>. Kept deliberately lightweight: a definition,
 * a longer explanation in the body, and optional related terms. Great for
 * capturing long-tail "what is X" searches.
 */
const glossary = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/glossary' }),
  schema: () =>
    z.object({
      /** The term itself, e.g. "RAG (Retrieval-Augmented Generation)". */
      term: z.string(),
      /** Short acronym or aliases people might search, for on-page context. */
      aliases: z.array(z.string()).default([]),
      /** One- or two-sentence plain definition — also used for meta description. */
      definition: z.string(),
      /** Optional grouping, e.g. "AI Concepts", "Automation". */
      category: z.string().default('AI Concepts'),
      updatedDate: z.coerce.date().optional(),
      /** Slugs of related glossary terms to cross-link. */
      related: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

/**
 * AI Directory — one entry per AI tool (ChatGPT, Claude, etc.). The traffic
 * engine: one tool = one SEO page. Own URL space (/directory/<slug>) and a
 * rich schema so each page can render Overview / Pricing / Features / Pros /
 * Cons / Use Cases / Alternatives / FAQ from a single template.
 */
const directory = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/directory' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      /** One-line "what it is", shown under the H1 and on listing cards. */
      tagline: z.string(),
      description: z.string(),
      logo: image().optional(),
      /** Grouping, e.g. "Chatbot", "Writing", "Coding", "Image", "Automation". */
      category: z.string(),
      /** Pricing tiers, rendered as a small table. */
      pricing: z
        .array(
          z.object({
            tier: z.string(),
            price: z.string(),
            notes: z.string().optional(),
          }),
        )
        .default([]),
      freeTier: z.boolean().default(false),
      /** Editorial score out of 5 (optional). */
      rating: z.number().min(0).max(5).optional(),
      /** Official site — swap for an affiliate URL once approved. */
      website: z.string().startsWith('http'),
      features: z.array(z.string()).default([]),
      pros: z.array(z.string()).default([]),
      cons: z.array(z.string()).default([]),
      useCases: z.array(z.string()).default([]),
      /** Slugs of other directory entries to cross-link as alternatives. */
      alternatives: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      popular: z.boolean().default(false),
      featured: z.boolean().default(false),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
      faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    }),
});

/**
 * Prompt Library — one entry per ready-to-use AI prompt. Grouped by category
 * (SEO, marketing, coding, email, ...) and surfaced at /prompts/<category>
 * and /prompts/<category>/<slug>. The star of each page is a big copy-button
 * prompt block. Great for high-volume, shareable long-tail traffic.
 */
const prompt = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/prompts' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      /** Category slug, e.g. "seo", "marketing", "coding", "email". */
      category: z.string(),
      /** Which model it's written for, or "Any". */
      model: z.string().default('Any'),
      /** The actual copy-paste prompt — the star of the page. */
      promptText: z.string(),
      /** Short guidance on using/customising it. */
      howToUse: z.string().optional(),
      /** Optional example of what the prompt produces. */
      exampleOutput: z.string().optional(),
      tags: z.array(z.string()).default([]),
      /** Slugs of related prompts to cross-link. */
      related: z.array(z.string()).default([]),
      updatedDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

/**
 * Workflow Recipes — step-by-step automation guides (e.g. "Automate Gmail to
 * Slack"). Own URL space (/workflows/<slug>) and a structured steps array so
 * each page can render a numbered how-to and emit HowTo schema for rich results.
 */
const workflow = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/workflows' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      /** What the automation achieves, in one line. */
      goal: z.string(),
      /** Apps/platforms involved, e.g. ["Gmail", "Slack", "Zapier"]. */
      tools: z.array(z.string()).default([]),
      difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']).default('Beginner'),
      /** Rough setup time, e.g. "15 min". */
      timeToSetup: z.string().optional(),
      /** The ordered steps — rendered as a numbered guide + HowTo schema. */
      steps: z
        .array(
          z.object({
            title: z.string(),
            description: z.string(),
          }),
        )
        .default([]),
      category: z.string().default('Automation'),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.object({ name: z.string(), avatar: z.string().optional() }),
      /** Slugs of related workflow recipes. */
      related: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    }),
});

/**
 * Templates — downloadable resources (Notion, Google Sheets, Airtable, etc.).
 * Own URL space (/templates/<slug>). Each entry describes what's inside and
 * links to a download (which can be gated behind email later). A natural
 * email-capture magnet and target for "<platform> template" searches.
 */
const template = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/templates' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      /** Platform the template is for, e.g. "Notion", "Google Sheets". */
      platform: z.string(),
      category: z.string().default('Productivity'),
      /** What's included, as a bullet list. */
      whatsInside: z.array(z.string()).default([]),
      /** Where the template can be copied/downloaded. Gate behind email later. */
      downloadUrl: z.string().startsWith('http').optional(),
      previewImage: image().optional(),
      previewAlt: z.string().optional(),
      tags: z.array(z.string()).default([]),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Slugs of related templates. */
      related: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      faq: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
    }),
});

export const collections = {
  blog,
  roundup,
  comparison,
  glossary,
  directory,
  prompt,
  workflow,
  template,
};
