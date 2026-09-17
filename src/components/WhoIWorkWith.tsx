import Container from './ui/Container';
import Reveal from './ui/Reveal';

const audiences = [
  {
    title: "Fintech SaaS & Unicorn Tech",
    description: "Build data-driven integrated marketing strategies to scale beyond 800% traffic growth and capture high-intent organic market share."
  },
  {
    title: "B2B, IT, Telecom & Manufacturing",
    description: "Transform complex solutions into research-oriented, search-intent-based, and value-driven content that achieves over 200% lead growth YoY."
  },
  {
    title: "eCommerce & D2C Brands",
    description: "Tap all relevant marketing and branding channels, scale organic reach, and engineer high-converting digital storefronts."
  },
  {
    title: "In-House Teams & Growth Leaders",
    description: "Build, guide, and train internal marketing teams to operate autonomously with proven playbooks across SEO, social media, and content."
  },
  {
    title: "Global Conferences & Flagship Summits",
    description: "Deliver high-impact keynotes, emcee flagship summits, and lead masterclasses on organic visibility and content strategy."
  }
];

export default function WhoIWorkWith() {
  return (
    <section className="pt-8 md:pt-12 pb-12 md:pb-16 bg-bg">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-6 md:mb-8">
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
