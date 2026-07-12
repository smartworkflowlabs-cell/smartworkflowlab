import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/config/site';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  const issues = await getCollection('roundup', ({ data }) => !data.draft);

  // Merge blog posts and weekly roundup issues into one reverse-chronological feed.
  const items = [
    ...posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
      author: post.data.author.name,
    })),
    ...issues.map((issue) => ({
      title: issue.data.title,
      description: issue.data.description,
      pubDate: issue.data.pubDate,
      link: `/ai-this-week/${issue.id}/`,
      categories: ['AI This Week'],
      author: issue.data.author.name,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items,
    customData: `<language>en-us</language>`,
  });
}
