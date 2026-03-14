import { useEffect } from 'react';

interface MetaTagsConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
}

const DEFAULT_META = {
  title: 'Silhouette Diagnostics - Advanced DNA Testing & Health Solutions',
  description: 'Get comprehensive DNA testing, health assessments, and preventive care solutions from Silhouette Diagnostics.',
  keywords: 'DNA testing, health diagnostics, genetic testing, preventive medicine',
  ogType: 'website',
  twitterCard: 'summary_large_image',
};

export const useMetaTags = (config: MetaTagsConfig = {}) => {
  useEffect(() => {
    const meta = { ...DEFAULT_META, ...config };

    // Update title
    if (meta.title) {
      document.title = meta.title;
      updateOrCreateMetaTag('og:title', meta.ogTitle || meta.title);
      updateOrCreateMetaTag('twitter:title', meta.twitterTitle || meta.title);
    }

    // Update description
    if (meta.description) {
      updateOrCreateMetaTag('description', meta.description);
      updateOrCreateMetaTag('og:description', meta.ogDescription || meta.description);
      updateOrCreateMetaTag('twitter:description', meta.twitterDescription || meta.description);
    }

    // Update keywords
    if (meta.keywords) {
      updateOrCreateMetaTag('keywords', meta.keywords);
    }

    // Update Open Graph tags
    if (meta.ogImage) {
      updateOrCreateMetaTag('og:image', meta.ogImage);
      updateOrCreateMetaTag('twitter:image', meta.twitterImage || meta.ogImage);
    }

    if (meta.ogUrl) {
      updateOrCreateMetaTag('og:url', meta.ogUrl);
    }

    if (meta.ogType) {
      updateOrCreateMetaTag('og:type', meta.ogType);
    }

    // Update Twitter tags
    if (meta.twitterCard) {
      updateOrCreateMetaTag('twitter:card', meta.twitterCard);
    }

    // Update canonical URL
    if (meta.canonical) {
      updateOrCreateCanonical(meta.canonical);
    }
  }, [config]);
};

function updateOrCreateMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }
  
  tag.content = content;
}

function updateOrCreateCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  
  link.href = url;
}
