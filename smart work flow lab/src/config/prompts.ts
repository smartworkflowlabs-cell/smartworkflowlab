/**
 * Prompt Library categories.
 * The `slug` must match the `category` field used in prompt content files.
 * Add a new category here and it appears on the /prompts hub automatically.
 */
export interface PromptCategory {
  slug: string;
  name: string;
  description: string;
  /** Short icon path (SVG `d`) for the hub cards. */
  icon: string;
}

export const promptCategories: PromptCategory[] = [
  {
    slug: 'seo',
    name: 'SEO',
    description:
      'Prompts for keyword research, content briefs, meta tags, and on-page optimisation.',
    icon: 'M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z',
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    description: 'Prompts for ad copy, social posts, campaigns, and brand messaging.',
    icon: 'M3 11l18-5v12L3 14v-3zM11.6 16.8a3 3 0 11-5.8-1.6',
  },
  {
    slug: 'email',
    name: 'Email',
    description: 'Prompts for outreach, follow-ups, newsletters, and replies that get responses.',
    icon: 'M4 4h16v16H4zM4 7l8 6 8-6',
  },
  {
    slug: 'coding',
    name: 'Coding',
    description: 'Prompts for writing, debugging, reviewing, and explaining code.',
    icon: 'M8 9l-3 3 3 3m8-6l3 3-3 3M14 5l-4 14',
  },
];

export function getPromptCategory(slug: string): PromptCategory | undefined {
  return promptCategories.find((c) => c.slug === slug);
}
