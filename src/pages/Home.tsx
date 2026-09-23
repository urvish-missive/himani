import HomeHero from '../components/home/HomeHero';
import HomeTrust from '../components/home/HomeTrust';
import HomeWhatILead from '../components/home/HomeWhatILead';
import HomeVirtualCMO from '../components/home/HomeVirtualCMO';
import HomeOffers from '../components/home/HomeOffers';
import HomeStage from '../components/home/HomeStage';
import HomeBeliefs from '../components/home/HomeBeliefs';
import HomeResults from '../components/home/HomeResults';
import HomeAbout from '../components/home/HomeAbout';
import HomeGallery from '../components/home/HomeGallery';
import HomeFAQ from '../components/home/HomeFAQ';
import HomeHire from '../components/home/HomeHire';

export default function Home() {
  return (
    <main id="top">
      <HomeHero />
      <HomeTrust />
      <HomeWhatILead />
      <HomeVirtualCMO />
      <HomeOffers />
      <HomeStage />
      <HomeBeliefs />
      <HomeResults />
      <HomeAbout />
      <HomeGallery />
      <HomeFAQ />
      <HomeHire />
    </main>
  );
}
