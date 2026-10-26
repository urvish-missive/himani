import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { parseFaqsFromMarkdown } from '../../lib/faqAccordion';
import FaqAccordion from './FaqAccordion';

const components: Components = {
  a({ href = '', children, node: _node, ...rest }) {
    // Internal links stay in the app; external ones open in a new tab.
    if (href.startsWith('/') && !href.startsWith('//')) {
      return (
        <Link to={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  },
  img({ node: _node, alt = '', ...rest }) {
    return <img alt={alt} loading="lazy" decoding="async" {...rest} />;
  },
  table({ node: _node, ...rest }) {
    return (
      <div className="prose-table-wrap">
        <table {...rest} />
      </div>
    );
  },
  p({ node: _node, children, ...rest }) {
    // Check if the paragraph is a visual placeholder like [VISUAL 9: Mock-up of...]
    const str = Array.isArray(children)
      ? children.map((c) => (typeof c === 'string' ? c : '')).join('')
      : typeof children === 'string'
      ? children
      : '';
    const match = str.trim().match(/^(?:\\?\[)\s*((?:VISUAL|IMAGE|GRAPHIC|PHOTO|FIGURE|DIAGRAM|CHART|INFOGRAPHIC|MOCKUP|BANNER)\b(?:\s*\d+)?)\s*[:–-]\s*([\s\S]*?)(?:\\?\])$/i);
    if (match) {
      const label = match[1].toUpperCase();
      const desc = match[2].replace(/\\([\\`*_[\]<>~"'])/g, '$1').trim();
      return (
        <div className="my-8 rounded-2xl border-2 border-dashed border-accent/40 bg-card p-5 sm:p-6 text-left shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-extrabold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30">
              🎨 {label}
            </span>
            <span className="font-display font-bold text-ink text-sm sm:text-base">
              Visual Graphic Placement
            </span>
          </div>
          <p className="text-sm text-muted italic leading-relaxed">
            "{desc}"
          </p>
        </div>
      );
    }
    return <p {...rest}>{children}</p>;
  },
};

/**
 * Renders post Markdown with tables, task lists, strikethrough,
 * interactive expandable FAQ accordions, and styled visual placeholders.
 */
export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  const { beforeFaq, faqs, faqHeading, afterFaq, hasFaqs } = parseFaqsFromMarkdown(children);

  if (hasFaqs) {
    return (
      <div className={`prose-blog ${className}`}>
        {beforeFaq && (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {beforeFaq}
          </ReactMarkdown>
        )}

        <FaqAccordion heading={faqHeading} faqs={faqs} />

        {afterFaq && (
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {afterFaq}
          </ReactMarkdown>
        )}
      </div>
    );
  }

  return (
    <div className={`prose-blog ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
