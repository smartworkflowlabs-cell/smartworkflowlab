const WORDS_PER_MINUTE = 200;

/** Estimate reading time from raw Markdown body text. */
export function estimateReadingTime(body: string): string {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

/** Consistent, locale-aware date formatting used across all blog layouts. */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/** Turn a category name into a URL-safe slug, e.g. "Web Design" -> "web-design". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface PostLike {
  data: {
    tags: string[];
    author: { name: string; avatar?: string };
  };
}

/** Every unique tag across the given posts, sorted alphabetically. */
export function getAllTags(posts: PostLike[]): string[] {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) => a.localeCompare(b));
}

/** Every unique author across the given posts (by name), sorted alphabetically. */
export function getAllAuthors(posts: PostLike[]): { name: string; avatar?: string }[] {
  const byName = new Map<string, { name: string; avatar?: string }>();
  for (const post of posts) {
    const { author } = post.data;
    if (!byName.has(author.name)) byName.set(author.name, author);
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

interface DatedPostLike {
  data: { pubDate: Date };
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** Human-readable month name from a 1-12 month number, e.g. monthName(6) -> "June". */
export function monthName(month: number): string {
  return MONTH_NAMES[month - 1] ?? '';
}

/** Every year that has at least one post, newest first, with a post count. */
export function getArchiveYears<T extends DatedPostLike>(
  posts: T[],
): { year: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear();
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, count]) => ({ year, count }));
}

/** Every year+month that has at least one post within a given year, newest first, with a post count. */
export function getArchiveMonths<T extends DatedPostLike>(
  posts: T[],
  year: number,
): { month: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const post of posts) {
    if (post.data.pubDate.getUTCFullYear() !== year) continue;
    const month = post.data.pubDate.getUTCMonth() + 1;
    counts.set(month, (counts.get(month) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([month, count]) => ({ month, count }));
}
