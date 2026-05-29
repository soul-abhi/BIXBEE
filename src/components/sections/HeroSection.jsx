import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown } from 'lucide-react';
import ParticleCanvas from '../webgl/ParticleCanvas';
import ScrambleText from '../ui/ScrambleText';
import MagneticButton from '../ui/MagneticButton';
import { useAuth } from '../../context/useAuth';

const HeroSection = () => {
  const textRef = useRef(null);
  const { setIntent } = useAuth();

  useEffect(() => {
    const tween = gsap.to(textRef.current, {
      yPercent: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.18,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex flex-col justify-center items-center overflow-hidden z-10 bg-[#0a0a0c]/80 backdrop-blur-sm px-4">
      <ParticleCanvas />

      <div ref={textRef} className="relative z-[2] flex flex-col items-center max-w-5xl mx-auto w-full text-center">
        <h1 className="font-display leading-none text-[#f4f4f5] text-[15vw] md:text-[min(18vw,280px)] uppercase mb-2 tracking-tighter" style={{ WebkitTextStroke: '1px rgba(244,244,245,0.6)' }}>
          <ScrambleText text="BIXBEE" />
        </h1>

        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] mb-12 text-[#a1a1aa] bg-[#0a0a0c] p-2 inline-block">
          Your voice. No trace. No judgment.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <MagneticButton onClick={() => setIntent('signup')} className="bg-[#ff5c58] text-[#0a0a0c] border-[#ff5c58] font-bold z-[100] cursor-pointer pointer-events-auto" style={{ pointerEvents: 'auto' }}>
            Create Your ID
          </MagneticButton>
          <MagneticButton onClick={() => setIntent('login')} className="z-[100] cursor-pointer pointer-events-auto" style={{ pointerEvents: 'auto' }}>
            Explore Posts
          </MagneticButton>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-[2] opacity-50 pointer-events-none">
        <span className="font-mono text-[10px] mb-2 uppercase tracking-widest">Scroll</span>
        <ArrowDown size={16} />
      </div>
    </section>
  );
};

export default HeroSection;
