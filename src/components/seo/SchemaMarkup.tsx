import { siteConfig } from '@/lib/data';

interface PersonSchemaProps {
  type: 'person';
}
interface WebsiteSchemaProps {
  type: 'website';
}
interface ArticleSchemaProps {
  type: 'article';
  title: string;
  description: string;
  publishedAt: string;
  url: string;
  image?: string;
}
interface FAQSchemaProps {
  type: 'faq';
  items: { question: string; answer: string }[];
}
interface BreadcrumbSchemaProps {
  type: 'breadcrumb';
  items: { name: string; url: string }[];
}

type SchemaProps =
  | PersonSchemaProps
  | WebsiteSchemaProps
  | ArticleSchemaProps
  | FAQSchemaProps
  | BreadcrumbSchemaProps;

export default function SchemaMarkup(props: SchemaProps) {
  let schema: Record<string, unknown> = {};

  if (props.type === 'website') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DavideGPT',
      url: siteConfig.url,
      description: siteConfig.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.url}/resources?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  if (props.type === 'person') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Davide',
      url: siteConfig.url,
      sameAs: Object.values(siteConfig.social),
      jobTitle: 'AI Educator & Content Creator',
      description:
        'AI educator and content creator helping 500K+ people master AI tools including ChatGPT, Claude, and Gemini.',
      knowsAbout: ['Artificial Intelligence', 'ChatGPT', 'Claude AI', 'Prompt Engineering', 'AI Tools'],
    };
  }

  if (props.type === 'article') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: props.title,
      description: props.description,
      datePublished: props.publishedAt,
      author: {
        '@type': 'Person',
        name: 'Davide',
        url: siteConfig.url,
      },
      publisher: {
        '@type': 'Organization',
        name: 'DavideGPT',
        url: siteConfig.url,
      },
      url: props.url,
      ...(props.image && { image: props.image }),
    };
  }

  if (props.type === 'faq') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: props.items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    };
  }

  if (props.type === 'breadcrumb') {
    schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: props.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
