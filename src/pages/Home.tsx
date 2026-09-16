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
import CaseStudies from '../components/CaseStudies';
import CoachingTransformation from '../components/CoachingTransformation';
import OneOnOneCoaching from '../components/OneOnOneCoaching';
import Testimonials from '../components/Testimonials';
import TrainingShowcase from '../components/TrainingShowcase';
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
      <CaseStudies />
      <TrainingShowcase />
      <OneOnOneCoaching />
      <CoachingTransformation />
      <Testimonials />
      <Insights />
      <WhoIWorkWith />
      <FinalCTA />
    </main>
  );
}
