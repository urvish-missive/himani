import { useEffect } from 'react';

interface Meta {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string;
  /** Full URL search engines should treat as the page's address. */
  canonical?: string;
  /** ISO date, for articles. */
  publishedTime?: string;
}

function setMeta(attr: 'name' | 'property', key: string, value: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!value) return () => {};
  const created = !el;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const prev = el.content;
  el.content = value;
  return () => {
    if (created) el!.remove();
    else el!.content = prev;
  };
}

function setCanonical(href: string | undefined) {
  if (!href) return () => {};
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const created = !el;
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  const prev = el.getAttribute('href') ?? '';
  el.setAttribute('href', href);
  return () => {
    if (created) el!.remove();
    else el!.setAttribute('href', prev);
  };
}

/**
 * Sets the tab title, description and social preview tags for a page,
 * restoring the site defaults when the page unmounts.
 */
export function usePageMeta({ title, description, image, type = 'website', keywords, canonical, publishedTime }: Meta) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const undo = [
      setMeta('name', 'description', description),
      setMeta('property', 'og:title', title),
      setMeta('property', 'og:description', description),
      setMeta('property', 'og:type', type),
      setMeta('property', 'og:url', window.location.href),
      setMeta('property', 'og:image', image),
      setMeta('name', 'twitter:title', title),
      setMeta('name', 'twitter:description', description),
      setMeta('name', 'twitter:image', image),
      setMeta('name', 'keywords', keywords),
      setMeta('property', 'article:published_time', publishedTime),
      setCanonical(canonical),
    ];
    return () => {
      document.title = prevTitle;
      undo.forEach((fn) => fn());
    };
  }, [title, description, image, type, keywords, canonical, publishedTime]);
}
