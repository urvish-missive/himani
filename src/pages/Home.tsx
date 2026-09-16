import Hero from '../components/Hero';
import AuthorityBar from '../components/AuthorityBar';
import AnimatedQuote from '../components/AnimatedQuote';
import Positioning from '../components/Positioning';
import ProgramsStack from '../components/ProgramsStack';
import ServicesSplit from '../components/ServicesSplit';
import AnimatedStats from '../components/AnimatedStats';
import Expertise from '../components/Expertise';
import Framework from '../components/Framework';
import ConferenceShowcase from '../components/ConferenceShowcase';
import TrainingShowcase from '../components/TrainingShowcase';
import OneOnOneCoaching from '../components/OneOnOneCoaching';
import CoachingTransformation from '../components/CoachingTransformation';
import Testimonials from '../components/Testimonials';
import Insights from '../components/Insights';
import WhoIWorkWith from '../components/WhoIWorkWith';
import FinalCTA from '../components/FinalCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <AuthorityBar />
      <AnimatedQuote />
      <Positioning />
      <ProgramsStack />
      <ServicesSplit />
      <AnimatedStats />
      <Expertise />
      <Framework />
      <ConferenceShowcase />
      <OneOnOneCoaching />
      <TrainingShowcase />
      <CoachingTransformation />
      <Testimonials />
      <Insights />
      <WhoIWorkWith />
      <FinalCTA />
    </main>
  );
}
