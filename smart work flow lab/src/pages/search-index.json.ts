import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const index = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    category: post.data.category,
    url: `/blog/${post.id}`,
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
