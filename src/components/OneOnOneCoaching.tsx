import { useState } from 'react';
import { motion } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import CTAButton from './ui/CTAButton';
import coachImg from '../images/himanimarketing.jpg';
import { 
  Check, 
  Sparkles, 
  Calendar, 
  MessageSquare, 
  Compass, 
  Cpu, 
  ShieldCheck, 
  ArrowRight,
  UserCheck
} from 'lucide-react';

const coachingPrograms = [
  {
    id: 'sprint',
    tag: 'Focused Intervention',
    name: 'Strategic Growth Sprint',
    duration: '4 Weeks',
    commitment: 'Intensive 1:1',
    description: 'A laser-focused strategy sprint designed to solve an immediate organic growth, AI adoption, or positioning bottleneck.',
    highlights: [
      'Comprehensive Growth & Channel Audit',
      '4 × 60-min Deep-Dive Strategy Sessions',
      'Customized 90-Day Execution Roadmap',
      'AI Workflow & Tool Stack Architecture',
      'Direct WhatsApp / Email async access'
    ],
    idealFor: 'Leaders facing a pivotal launch, strategy pivot, or growth plateau.'
  },
  {
    id: 'mentorship',
    tag: 'Most Popular',
    name: 'Executive Mentorship',
    duration: '3 Months',
    commitment: 'Bi-Weekly Advisory',
    description: 'Transformative one-on-one coaching to help you build resilient marketing operating models, sharpen strategic judgment, and lead with authority.',
    highlights: [
      'Everything in the Growth Sprint',
      '6 × 75-min Bi-Weekly Executive Coaching Calls',
      'Asynchronous Slack / Voice note feedback',
      'Review of campaigns, slide decks, and hiring',
      'Proprietary AI Prompts & Workflow Playbooks',
      'Personal Brand & Thought Leadership Strategy'
    ],
    idealFor: 'CMOs, Heads of Marketing, and Founders scaling organic growth.'
  },
  {
    id: 'ongoing',
    tag: 'Long-Term Partnership',
    name: 'Founder & CMO Strategic Advisory',
    duration: '6 Months',
    commitment: 'High-Touch Advisory',
    description: 'A trusted strategic soundboard and thinking partner for sustained category leadership, executive presence, and continuous compounding.',
    highlights: [
      'Continuous Bi-Weekly Strategy & Decision Calls',
      'Unlimited Priority Async Access via Slack',
      'Quarterly OKR & Marketing Operating Reviews',
      'Team Capability Audits & Upskilling Blueprints',
      'Executive Sparring on Board & GTM strategy',
      'VIP Access to all Training Workshops'
    ],
    idealFor: 'Growth-stage Founders and enterprise Marketing Leaders.'
  }
];

const pillars = [
  {
    icon: Compass,
    title: 'Strategic Prioritization',
    desc: 'Stop drowning in random channel tactics. Clarify what actually moves the needle and build systems that compound.'
  },
  {
    icon: Cpu,
    title: 'AI Workflow Integration',
    desc: 'Move beyond generic ChatGPT prompts. Embed custom AI workflows for research, SEO, content, and team productivity.'
  },
  {
    icon: MessageSquare,
    title: 'Async Soundboard',
    desc: 'Never get stuck. Get real-time feedback on decks, positioning, messaging, and decisions via private voice and chat.'
  },
  {
    icon: UserCheck,
    title: 'Executive Presence',
    desc: 'Become the authoritative marketer in the boardroom. Articulate marketing ROI and strategy with clarity and conviction.'
  }
];

export default function OneOnOneCoaching() {
  const [selectedTrack, setSelectedTrack] = useState('mentorship');

  return (
    <section id="coaching" className="relative py-20 md:py-28 lg:py-36 bg-gradient-to-b from-bg via-purple/5 to-bg overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-orange/10 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple/10 border border-purple/20 backdrop-blur-sm mb-4">
              <Sparkles className="w-3.5 h-3.5 text-purple" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-purple">
                Private Advisory & Mentorship
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl leading-[1.15] text-primary mb-6">
              1-on-1 Coaching for <span className="gradient-text">Modern Marketing Leaders</span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
              Direct, confidential advisory designed for ambitious marketing leaders, founders, and strategists. 
              Elevate your strategic thinking, master AI operating models, and build compounding growth systems.
            </p>
          </Reveal>
        </div>

        {/* Feature Row: Profile & Value Props */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 lg:gap-14 items-center mb-20">
          {/* Coach Portrait Card */}
          <Reveal delay={0.2}>
            <div className="relative mx-auto lg:mx-0 max-w-[340px] lg:max-w-none">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-purple via-orange-light to-orange rounded-3xl opacity-40 blur-sm" />
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-2xl border border-purple/20">
                <div className="aspect-[4/5] overflow-hidden relative">
                  <img
                    src={coachImg}
                    alt="Himani Kankaria - Founder of Missive Digital & Executive Organic Growth Coach"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="font-serif text-xl font-bold">Himani Kankaria</p>
                    <p className="text-xs text-white/80 tracking-wide">Founder, Missive Digital & Growth Strategist</p>
                  </div>
                </div>

                {/* Quick Trust Badges */}
                <div className="p-5 grid grid-cols-3 gap-2 bg-white/90 backdrop-blur-md text-center border-t border-purple/10">
                  <div>
                    <div className="text-lg font-bold gradient-text">500+</div>
                    <div className="text-[10px] text-secondary/70">Coached Hours</div>
                  </div>
                  <div className="border-x border-purple/10">
                    <div className="text-lg font-bold gradient-text">80+</div>
                    <div className="text-[10px] text-secondary/70">Leaders Guided</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold gradient-text">95%</div>
                    <div className="text-[10px] text-secondary/70">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Pillars of 1-on-1 Advisory */}
          <div>
            <Reveal delay={0.1}>
              <h3 className="font-serif text-2xl md:text-3xl text-primary mb-6">
                What makes this 1-on-1 coaching different?
              </h3>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {pillars.map((pillar, i) => (
                <Reveal key={pillar.title} delay={0.15 + i * 0.08}>
                  <div className="p-5 rounded-xl border border-purple/15 bg-white/60 backdrop-blur-xs hover:bg-white hover:border-purple/35 hover:shadow-md transition-all duration-300">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple/10 to-orange/10 flex items-center justify-center text-purple mb-3">
                      <pillar.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-semibold text-primary mb-1.5">
                      {pillar.title}
                    </h4>
                    <p className="text-xs md:text-sm text-secondary leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 h-12 px-7 text-sm font-semibold bg-gradient-to-r from-purple to-orange text-white rounded-full hover:shadow-lg hover:shadow-purple/25 transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Apply for 1-on-1 Coaching</span>
                </a>
                <span className="text-xs text-secondary/70">
                  <ShieldCheck className="w-4 h-4 inline text-emerald-500 mr-1" />
                  Limited to 4 active leaders per quarter
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* 3 Structured Coaching Programs */}
        <div className="mt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Reveal>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary mb-3">
                Select Your Coaching Engagement
              </h3>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm sm:text-base text-secondary">
                Tailored structures depending on whether you need a high-impact sprint or sustained executive advisory.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {coachingPrograms.map((prog, i) => {
              const isSelected = selectedTrack === prog.id;
              const isPopular = prog.id === 'mentorship';

              return (
                <Reveal key={prog.id} delay={0.1 + i * 0.1}>
                  <div
                    onClick={() => setSelectedTrack(prog.id)}
                    className={`relative h-full flex flex-col justify-between p-7 sm:p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isPopular
                        ? 'border-purple shadow-xl shadow-purple/10 bg-white ring-2 ring-purple/20'
                        : isSelected
                        ? 'border-purple/60 bg-white shadow-lg shadow-purple/5'
                        : 'border-purple/20 bg-white/70 hover:bg-white hover:border-purple/40 hover:shadow-md'
                    }`}
                  >
                    {/* Top Tag */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className={`text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full ${
                          isPopular
                            ? 'bg-gradient-to-r from-purple to-orange text-white'
                            : 'bg-purple/10 text-purple border border-purple/20'
                        }`}>
                          {prog.tag}
                        </span>
                        <span className="text-xs font-semibold text-secondary/70">
                          {prog.duration}
                        </span>
                      </div>

                      <h4 className="font-serif text-xl sm:text-2xl text-primary mb-2">
                        {prog.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-secondary leading-relaxed mb-6">
                        {prog.description}
                      </p>

                      <div className="h-px bg-purple/10 my-6" />

                      {/* Deliverables Checklist */}
                      <p className="text-xs font-semibold uppercase tracking-wider text-purple mb-4">
                        What's Included:
                      </p>
                      <ul className="space-y-3 mb-8">
                        {prog.highlights.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-primary">
                            <span className="w-4 h-4 rounded-full bg-purple/10 text-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Info & Action */}
                    <div className="pt-4 border-t border-purple/10 mt-auto">
                      <p className="text-[11px] text-secondary/60 italic mb-5">
                        <strong className="text-secondary/80 not-italic">Best for:</strong> {prog.idealFor}
                      </p>

                      <a
                        href="#contact"
                        className={`w-full py-3 px-5 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                          isPopular
                            ? 'bg-gradient-to-r from-purple to-orange text-white shadow-md hover:shadow-purple/30'
                            : 'bg-purple/5 text-purple hover:bg-purple hover:text-white border border-purple/20'
                        }`}
                      >
                        <span>Apply For {prog.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
