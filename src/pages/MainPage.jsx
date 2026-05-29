import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/sections/Navbar';
import HeroSection from '../components/sections/HeroSection';
import SplitScreenTransition from '../components/sections/SplitScreenTransition';
import ManifestoSection from '../components/sections/ManifestoSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import IdentitySection from '../components/sections/IdentitySection';
import ExploreSection from '../components/sections/ExploreSection';
import FinalCTA from '../components/sections/FinalCTA';
import Footer from '../components/sections/Footer';

const MainPage = () => {
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#0a0a0c]">
        <HeroSection />
        <SplitScreenTransition />
        <ManifestoSection />
        <FeaturesSection />
        <IdentitySection />
        <ExploreSection />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
};

export default MainPage;
