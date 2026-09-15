import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { articles, contentCategories } from '../data/articles';
import { ArrowRight } from 'lucide-react';

export default function Insights() {
  return (
    <section id="insights" className="py-24 md:py-32 lg:py-40 bg-bg">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-orange mb-4">
                Insights
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary">
                <span className="gradient-text">Thinking in public.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-base text-secondary mt-4 max-w-lg">
                Notes, frameworks and perspectives on marketing, AI and organic growth.
              </p>
            </Reveal>
          </div>

          {/* Categories */}
          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {contentCategories.map((cat) => (
                <span
                  key={cat}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-purple/20 text-purple/60 hover:border-purple/40 hover:text-purple hover:bg-purple/5 transition-all duration-200 cursor-pointer"
                >
                  {cat}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Reveal key={article.id} delay={i * 0.1}>
              <article className="group p-6 md:p-8 rounded-2xl border border-purple/20 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-purple/30 hover:shadow-lg hover:shadow-purple/10 transition-all duration-500 cursor-pointer">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-orange">
                  {article.category}
                </span>
                <h3 className="text-lg font-semibold text-primary mt-3 mb-3 group-hover:text-purple transition-colors duration-300 leading-snug">
                  {article.title}
                </h3>
                <p className="text-sm text-secondary leading-relaxed mb-6">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary/50">{article.readTime}</span>
                  <ArrowRight className="w-4 h-4 text-secondary/30 group-hover:text-orange group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-purple transition-colors duration-200">
              View All Insights
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
