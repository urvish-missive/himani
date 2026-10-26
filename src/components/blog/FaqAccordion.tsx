import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FaqItem } from '../../lib/faqAccordion';

interface Props {
  heading: string;
  faqs: FaqItem[];
  className?: string;
}

export default function FaqAccordion({ heading, faqs, className = '' }: Props) {
  // Store open state for each FAQ id
  const [openIds, setOpenIds] = useState<Record<string, boolean>>(() => {
    // Default open the first FAQ
    if (faqs[0]) return { [faqs[0].id]: true };
    return {};
  });

  if (!faqs.length) return null;

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allOpen = faqs.every((f) => !!openIds[f.id]);
  const toggleAll = () => {
    if (allOpen) {
      setOpenIds({});
    } else {
      const all: Record<string, boolean> = {};
      faqs.forEach((f) => {
        all[f.id] = true;
      });
      setOpenIds(all);
    }
  };

  return (
    <section className={`my-12 pt-8 border-t border-rule not-prose ${className}`} id="faqs" aria-label={heading}>
      {/* Header with Heading & Expand/Collapse All toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-lav text-accent flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight !mt-0 !mb-0">
            {heading || 'Frequently Asked Questions'}
          </h2>
        </div>

        {faqs.length > 1 && (
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs font-display font-semibold text-accent hover:underline px-2.5 py-1 rounded-md hover:bg-lav/60 transition-colors"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        )}
      </div>

      {/* Accordion List */}
      <div className="divide-y divide-rule border-y border-rule">
        {faqs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div key={faq.id} className="py-4 sm:py-5 group">
              <button
                type="button"
                onClick={() => toggle(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full font-display font-semibold text-[1.05rem] sm:text-[1.12rem] text-ink flex justify-between items-start gap-4 select-none hover:text-accent transition-colors text-left"
              >
                <span className="leading-snug pt-0.5">{faq.question}</span>
                <span
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-lg leading-none shrink-0 transition-all duration-300 ${
                    isOpen
                      ? 'bg-accent text-paper border-accent rotate-45'
                      : 'bg-paper-2 text-accent border-rule group-hover:border-accent'
                  }`}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="mt-3.5 pr-2 sm:pr-4 text-muted font-body leading-relaxed text-[0.96rem] sm:text-[1rem] prose-blog animate-in fade-in-50 duration-200"
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{faq.answer}</ReactMarkdown>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
