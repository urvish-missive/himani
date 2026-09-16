import Container from './ui/Container';
import Reveal from './ui/Reveal';

const audiences = [
  {
    title: "B2B SaaS & Tech Founders",
    description: "Turn organic search into a predictable, inbound customer acquisition engine without endless ad spend."
  },
  {
    title: "CMOs & Marketing VPs",
    description: "Re-architect channel silos, safeguard against AI search disruption, and scale compounding pipeline."
  },
  {
    title: "Growth & Inbound Teams",
    description: "Upskill internal marketers with modern Citation Architecture, intent mapping, and execution playbooks."
  },
  {
    title: "E-Commerce & Enterprise Brands",
    description: "Recover traffic penalties, eliminate keyword cannibalization, and architect high-converting commercial hubs."
  },
  {
    title: "Conference & Event Organizers",
    description: "Bring high-energy, actionable, stage-tested keynotes on SEO, AI search, and modern organic growth."
  }
];

export default function WhoIWorkWith() {
  return (
    <section className="pt-6 md:pt-10 lg:pt-12 pb-20 md:pb-28 lg:pb-36 bg-bg">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-10 md:mb-12">
              I work best with…
            </h2>
          </Reveal>

          <div className="space-y-8">
            {audiences.map((audience, i) => (
              <Reveal key={audience.title} delay={i * 0.08}>
                <div className="group flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 py-6 border-b border-purple/10 hover:border-purple/30 transition-colors duration-300">
                  <h3 className="text-lg md:text-xl font-semibold text-primary min-w-[280px] group-hover:text-purple transition-colors duration-300">
                    {audience.title}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    {audience.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
