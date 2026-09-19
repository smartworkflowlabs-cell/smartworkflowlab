/**
 * JSON-LD schema builders
 * ------------------------
 * Pure functions that return schema.org objects. Nothing here touches the
 * DOM or Astro props directly — layouts/components call these and drop the
 * result into a <script type="application/ld+json"> themselves (BaseLayout
 * already does this for whatever it's handed via `structuredData`).
 */

import { SITE_NAME, SITE_URL, SITE_LOGO_PATH, CONTACT_EMAIL } from '@/config/site';

type JsonLd = Record<string, unknown>;

/** Sitewide Organization schema — who's actually publishing this content. */
export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: new URL(SITE_LOGO_PATH, SITE_URL).toString(),
    email: CONTACT_EMAIL,
    contactPoint: {
      '@type': 'ContactPoint',
      email: CONTACT_EMAIL,
      contactType: 'customer support',
      url: new URL('/contact', SITE_URL).toString(),
    },
  };
}

/**
 * WebSite schema with a SearchAction, which is what lets Google show a
 * sitelinks search box directly in results. `target` must be a real route
 * that reads the query string and renders results — see src/pages/search.astro.
 */
export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface ArticleSchemaInput {
  title: string;
  description: string;
  url: string;
  pubDate: Date;
  updatedDate?: Date;
  authorName: string;
  image?: string;
  tags?: string[];
}

/** Article/BlogPosting schema for a single post. */
export function articleSchema(input: ArticleSchemaInput): JsonLd {
  const { title, description, url, pubDate, updatedDate, authorName, image, tags } = input;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url,
    datePublished: pubDate.toISOString(),
    dateModified: (updatedDate ?? pubDate).toISOString(),
    author: { '@type': 'Person', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: new URL(SITE_LOGO_PATH, SITE_URL).toString() },
    },
    ...(image ? { image } : {}),
    ...(tags && tags.length > 0 ? { keywords: tags.join(', ') } : {}),
  };
}

export interface BreadcrumbSchemaItem {
  label: string;
  href?: string;
}

/** BreadcrumbList schema from the same items a Breadcrumb component renders. */
export function breadcrumbSchema(items: BreadcrumbSchemaItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, SITE_URL).toString() } : {}),
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** FAQPage schema — one entity per question, answer as plain text. */
export function faqSchema(items: FaqItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

interface HowToStep {
  title: string;
  description: string;
}

/**
 * HowTo schema — lets step-by-step guides appear as rich results in Google.
 * Used by workflow recipe pages. `name` is the task, `steps` are the ordered steps.
 */
export function howToSchema(input: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
}): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    step: input.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.title,
      text: step.description,
    })),
  };
}
