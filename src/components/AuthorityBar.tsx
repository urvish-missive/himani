import Container from './ui/Container';
import Stat from './ui/Stat';
import Reveal from './ui/Reveal';
import { stats, trustedLogos } from '../data/stats';
import alyendaLogo from '../images/alyenda.png';
import andyLogo from '../images/Andy.png';

export default function AuthorityBar() {
  return (
    <section className="py-16 md:py-20 border-y border-purple/10 bg-gradient-to-r from-purple/5 via-bg to-orange/5">
      <Container>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          {stats.map((stat) => (
            <Reveal key={stat.label} delay={stats.indexOf(stat) * 0.1}>
              <Stat
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                description={stat.description}
              />
            </Reveal>
          ))}
        </div>

        {/* Trusted by */}
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-purple/50 mb-8">
              Trusted by teams from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {/* Real logos with grayscale to color on hover */}
              <div className="h-10 opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0">
                <img src={alyendaLogo} alt="Alyenda" className="h-full object-contain" loading="lazy" />
              </div>
              <div className="h-10 opacity-40 hover:opacity-80 transition-opacity duration-300 grayscale hover:grayscale-0">
                <img src={andyLogo} alt="Andy" className="h-full object-contain" loading="lazy" />
              </div>
              {/* Placeholder text logos for remaining slots */}
              {trustedLogos.slice(2).map((logo) => (
                <div
                  key={logo}
                  className="text-lg md:text-xl font-semibold text-secondary/30 hover:text-purple transition-colors duration-300 cursor-default"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
