import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './ui/Container';
import Reveal from './ui/Reveal';
import SectionHeader from './ui/SectionHeader';
import { expertiseNodes } from '../data/expertise';
import {
  Search, FileText, Brain, Video, Globe, BarChart3,
  Megaphone, Mail, Palette, Cpu, Target, User
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  seo: <Search className="w-5 h-5" />,
  content: <FileText className="w-5 h-5" />,
  ai: <Brain className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  websites: <Globe className="w-5 h-5" />,
  analytics: <BarChart3 className="w-5 h-5" />,
  social: <Megaphone className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
  brand: <Palette className="w-5 h-5" />,
  automation: <Cpu className="w-5 h-5" />,
  strategy: <Target className="w-5 h-5" />,
  personal: <User className="w-5 h-5" />,
};

export default function Expertise() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <section id="expertise" className="py-24 md:py-32 lg:py-40 bg-gradient-to-br from-bg-alt/30 to-orange/5 overflow-hidden">
      <Container>
        <SectionHeader
          eyebrow="My Marketing Playground"
          heading="Expertise Ecosystem"
          centered
        />

        {/* Interactive grid */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {expertiseNodes.map((node, i) => (
              <Reveal key={node.id} delay={i * 0.04}>
                <motion.div
                  onMouseEnter={() => setActiveNode(node.id)}
                  onMouseLeave={() => setActiveNode(null)}
                  onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={`relative p-5 md:p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    activeNode === node.id
                      ? 'bg-gradient-to-br from-purple to-orange border-transparent text-white shadow-xl shadow-purple/20'
                      : 'bg-white/70 border-purple/10 text-primary hover:border-purple/30 hover:shadow-lg hover:shadow-purple/10'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors duration-300 ${
                    activeNode === node.id
                      ? 'bg-white/20 text-white'
                      : 'bg-purple/10 text-purple'
                  }`}>
                    {iconMap[node.id] || <Target className="w-5 h-5" />}
                  </div>

                  {/* Label */}
                  <h3 className="text-sm font-semibold tracking-wide mb-1">
                    {node.label}
                  </h3>

                  {/* Description - shows on active */}
                  <AnimatePresence>
                    {activeNode === node.id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs text-white/80 leading-relaxed mt-2 overflow-hidden"
                      >
                        {node.description}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Hover indicator dot */}
                  <div className={`absolute top-3 right-3 w-2 h-2 rounded-full transition-all duration-300 ${
                    activeNode === node.id
                      ? 'bg-white scale-100'
                      : 'bg-purple/30 scale-0'
                  }`} />
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <Reveal delay={0.3}>
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '12+', label: 'Core Disciplines' },
              { value: '50+', label: 'Frameworks Applied' },
              { value: '200+', label: 'Topics Covered' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-secondary/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
