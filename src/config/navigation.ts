export interface NavLink {
  label: string;
  href: string;
  description?: string;
}

export interface NavColumn {
  heading: string;
  links: NavLink[];
}

export interface NavItem {
  label: string;
  href: string;
  /** When set, this item triggers a mega menu instead of navigating directly on click (desktop only). */
  megaMenu?: NavColumn[];
}

export const primaryNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Directory', href: '/directory' },
  {
    label: 'Blog',
    href: '/blog',
    megaMenu: [
      {
        heading: 'Categories',
        links: [
          {
            label: 'AI Tools',
            href: '/blog/category/ai-tools',
            description: 'Reviews, comparisons, picks',
          },
          {
            label: 'Automation',
            href: '/blog/category/automation',
            description: 'Workflows, no-code, scripting',
          },
          {
            label: 'Business Automation',
            href: '/blog/category/business-automation',
            description: 'AI agents, BPA, document processing',
          },
        ],
      },
      {
        heading: 'More',
        links: [
          { label: 'All posts', href: '/blog', description: 'Browse the full archive' },
          { label: 'Tags', href: '/blog/tags', description: 'Browse posts by topic' },
          { label: 'Archive', href: '/blog/archive', description: 'Browse posts by date' },
          { label: 'RSS feed', href: '/rss.xml', description: 'Subscribe in your reader' },
        ],
      },
    ],
  },
  { label: 'AI This Week', href: '/ai-this-week' },
  { label: 'Compare', href: '/compare' },
  { label: 'Prompts', href: '/prompts' },
  { label: 'Tools', href: '/tools' },
];

export const footerLinkGroups = [
  {
    heading: 'Content',
    links: [
      { label: 'AI Directory', href: '/directory' },
      { label: 'Comparisons', href: '/compare' },
      { label: 'Prompt Library', href: '/prompts' },
      { label: 'Workflow Recipes', href: '/workflows' },
      { label: 'Templates', href: '/templates' },
      { label: 'Blog', href: '/blog' },
      { label: 'AI This Week', href: '/ai-this-week' },
      { label: 'Glossary', href: '/glossary' },
      { label: 'RSS', href: '/rss.xml' },
    ],
  },
  {
    heading: 'Tools',
    links: [
      { label: 'Automation ROI Calculator', href: '/tools/automation-roi-calculator' },
      { label: 'AI Cost Calculator', href: '/tools/ai-cost-calculator' },
      { label: 'AI Tool Finder', href: '/tools/ai-tool-finder' },
    ],
  },
  {
    heading: 'Categories',
    links: [
      { label: 'AI Tools', href: '/blog/category/ai-tools' },
      { label: 'Automation', href: '/blog/category/automation' },
      { label: 'Business Automation', href: '/blog/category/business-automation' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];
