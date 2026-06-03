export interface Resource {
  slug: string;
  title: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Guide' | 'Prompt Pack' | 'Video' | 'Toolkit' | 'Template';
  isFree: boolean;
  price?: number;
  thumbnail: string;
  duration?: string;
  downloadCount?: number;
  tags: string[];
  featured?: boolean;
  publishedAt: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  thumbnail: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
  notionId?: string;
  author: {
    name: string;
    avatar: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  handle?: string;
  platform: 'Twitter' | 'Instagram' | 'LinkedIn' | 'Google';
  avatar: string;
  quote: string;
  role?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
  badge?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articleDate?: string;
  noIndex?: boolean;
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  interest: string;
  message: string;
  consent: boolean;
  // UTM fields (hidden)
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
}

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}
