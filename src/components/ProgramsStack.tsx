import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import { services } from '../data/services';

const anchors: Record<string, string> = {
  consulting: '#consulting',
  coaching: '#coaching-overview',
  training: '#training',
  speaking: '#speaking-overview',
};

const glowColors = ['#7C3AED', '#F97316', '#7C3AED', '#F97316'];

export default function ProgramsStack() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-bg to-bg-alt/40">
      <Container>
        <div className="mb-14 md:mb-20 text-center">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple mb-4">
              Engagement Models
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-5">
              Four ways to work together.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-base text-secondary max-w-xl mx-auto">
              Scroll to see how each one stacks up—then jump to the full breakdown further down the page.
            </p>
          </Reveal>
        </div>

        <ol className="mx-auto flex max-w-5xl flex-col gap-5 md:gap-6">
          {services.map((service, i) => (
            <li
              key={service.id}
              className="sticky"
              style={{ top: `calc(5.5rem + ${i} * 0.5rem)` }}
            >
              <article className="group relative overflow-hidden rounded-3xl border border-purple/10 bg-white shadow-[0_18px_42px_-22px_rgba(26,16,40,0.18)] transition-shadow duration-500 hover:shadow-[0_24px_56px_-22px_rgba(26,16,40,0.28)]">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-[60px]"
                  style={{ background: `radial-gradient(closest-side, ${glowColors[i % glowColors.length]}22, transparent 70%)` }}
                />

                <div className="relative grid grid-cols-1 items-center gap-6 p-6 sm:gap-8 sm:p-8 lg:grid-cols-[140px_1fr_auto] lg:gap-10 lg:p-10">
                  {/* Number */}
                  <div>
                    <span className="block font-serif gradient-text leading-none text-[clamp(3rem,7vw,4.5rem)]">
                      {service.number}
                    </span>
                    <span className="mt-3 block h-[3px] w-12 bg-gradient-to-r from-purple to-orange transition-all duration-500 group-hover:w-20" />
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-col gap-3">
                    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-purple/60">
                      {service.label}
                    </p>
                    <h3 className="font-serif text-xl sm:text-2xl leading-[1.2] text-primary">
                      {service.headline}
                    </h3>
                    <p className="text-sm text-secondary leading-relaxed line-clamp-2 max-w-2xl">
                      {service.description}
                    </p>
                    <dl className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary/60">
                      {service.metrics.slice(0, 3).map((metric, mi) => (
                        <div key={metric.label} className="inline-flex items-baseline gap-1.5">
                          {mi > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-purple/40 mr-2.5" />}
                          <dt className="uppercase tracking-[0.14em]">{metric.label}</dt>
                          <dd className="font-semibold text-primary">{metric.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* CTA */}
                  <div className="lg:self-center">
                    <CTAButton href={anchors[service.id]}>{service.cta}</CTAButton>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
