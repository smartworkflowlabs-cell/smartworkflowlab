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
  {
    label: 'Home',
    href: '/',
  },

  {
    label: 'Blog',
    href: '/blog',
    megaMenu: [
      {
        heading: 'Categories',
        links: [
          {
            label: 'Business Automation',
            href: '/blog/category/business-automation',
            description: 'Business process automation guides',
          },
          {
            label: 'Workflow Automation',
            href: '/blog/category/workflow-automation',
            description: 'Workflow optimization & automation',
          },
          {
            label: 'Document Automation',
            href: '/blog/category/document-automation',
            description: 'Document processing & OCR automation',
          },
        ],
      },
      {
        heading: 'Explore',
        links: [
          {
            label: 'All Articles',
            href: '/blog',
            description: 'Browse all published articles',
          },
          {
            label: 'Tags',
            href: '/blog/tags',
            description: 'Browse articles by topic',
          },
          {
            label: 'Archive',
            href: '/blog/archive',
            description: 'Browse articles by date',
          },
          {
            label: 'RSS Feed',
            href: '/rss.xml',
            description: 'Subscribe to our latest content',
          },
        ],
      },
    ],
  },

  {
    label: 'About',
    href: '/about',
  },

  {
    label: 'Contact',
    href: '/contact',
  },
];

export const footerLinkGroups = [
  {
    heading: 'Content',
    links: [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Blog',
        href: '/blog',
      },
      {
        label: 'About',
        href: '/about',
      },
      {
        label: 'Contact',
        href: '/contact',
      },
      {
        label: 'RSS Feed',
        href: '/rss.xml',
      },
    ],
  },

  {
    heading: 'Categories',
    links: [
      {
        label: 'Business Automation',
        href: '/blog/category/business-automation',
      },
      {
        label: 'Workflow Automation',
        href: '/blog/category/workflow-automation',
      },
      {
        label: 'Document Automation',
        href: '/blog/category/document-automation',
      },
    ],
  },
];