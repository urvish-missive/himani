import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

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
};

/**
 * Renders post Markdown (with tables, task lists and strikethrough).
 * Raw HTML in the source is ignored, so a post can't inject scripts.
 */
export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={`prose-blog ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
