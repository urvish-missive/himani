import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AuthorityBar from '../components/AuthorityBar';
import AnimatedQuote from '../components/AnimatedQuote';
import Positioning from '../components/Positioning';
import ServicesSplit from '../components/ServicesSplit';
import AnimatedStats from '../components/AnimatedStats';
import Expertise from '../components/Expertise';
import Framework from '../components/Framework';
import ConferenceShowcase from '../components/ConferenceShowcase';
import CaseStudies from '../components/CaseStudies';
import CoachingTransformation from '../components/CoachingTransformation';
import Testimonials from '../components/Testimonials';
import Insights from '../components/Insights';
import About from '../components/About';
import WhoIWorkWith from '../components/WhoIWorkWith';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AuthorityBar />
        <AnimatedQuote />
        <Positioning />
        <ServicesSplit />
        <AnimatedStats />
        <Expertise />
        <Framework />
        <ConferenceShowcase />
        <CaseStudies />
        <CoachingTransformation />
        <Testimonials />
        <Insights />
        <About />
        <WhoIWorkWith />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
