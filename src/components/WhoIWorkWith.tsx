import Container from './ui/Container';
import Reveal from './ui/Reveal';

const audiences = [
  {
    title: "CMOs & Marketing Leaders",
    description: "Build clearer priorities, stronger systems and more capable marketing teams."
  },
  {
    title: "Founders",
    description: "Turn marketing from scattered activities into a strategic growth function."
  },
  {
    title: "Marketing Teams",
    description: "Develop the frameworks, skills and operating systems needed for modern marketing."
  },
  {
    title: "Marketing Professionals",
    description: "Build stronger thinking, execution skills and career leverage."
  },
  {
    title: "Conference Organizers",
    description: "Bring practical, provocative and relevant marketing ideas to your audience."
  }
];

export default function WhoIWorkWith() {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-bg">
      <Container>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-primary mb-16">
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
