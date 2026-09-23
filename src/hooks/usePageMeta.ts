import { useEffect } from 'react';

interface Meta {
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
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

/**
 * Sets the tab title, description and social preview tags for a page,
 * restoring the site defaults when the page unmounts.
 */
export function usePageMeta({ title, description, image, type = 'website' }: Meta) {
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
    ];
    return () => {
      document.title = prevTitle;
      undo.forEach((fn) => fn());
    };
  }, [title, description, image, type]);
}
