import Container from './ui/Container';
import Reveal from './ui/Reveal';
import { homeStats, trustedLogos } from '../data/stats';
import alyendaLogo from '../images/alyenda.png';
import andyLogo from '../images/Andy.png';

export default function AuthorityBar() {
  return (
    <section className="py-8 md:py-10 border-y border-purple/10 bg-transparent">
      <Container>
        {/* Stats Strip - Slim, refined & minimal without background */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 items-center mb-8">
          {homeStats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3 text-center sm:text-left ${
                i > 0 ? 'sm:border-l sm:border-purple/15 sm:pl-6' : ''
              }`}
            >
              <span className="font-serif text-2xl md:text-3xl font-bold gradient-text leading-none shrink-0">
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-secondary/75 leading-tight max-w-[120px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Trusted by */}
        <Reveal>
          <div className="pt-6 border-t border-purple/10 text-center">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-secondary/50 mb-5">
              Trusted by teams from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {/* Real logos with grayscale to color on hover */}
              <div className="h-7 opacity-45 hover:opacity-85 transition-opacity duration-300 grayscale hover:grayscale-0">
                <img src={alyendaLogo} alt="Alyenda" className="h-full object-contain" loading="lazy" />
              </div>
              <div className="h-7 opacity-45 hover:opacity-85 transition-opacity duration-300 grayscale hover:grayscale-0">
                <img src={andyLogo} alt="Andy" className="h-full object-contain" loading="lazy" />
              </div>
              {/* Brand text logos */}
              {trustedLogos.map((logo) => (
                <span
                  key={logo}
                  className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-secondary/40 hover:text-purple transition-colors duration-300 cursor-default"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
