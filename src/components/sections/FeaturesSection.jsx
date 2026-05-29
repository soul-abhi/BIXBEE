import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, Flame, Lock } from 'lucide-react';

const CARDS = [
  { title: 'Zero Identity', c: '#ff5c58', icon: Lock, text: 'No name, no photo, no email. Just a brutal 6-character alphanumeric ID.' },
  { title: 'No Judgment', c: '#4ade80', icon: Flame, text: 'Likes only. No comments. No replies. No algorithms optimizing for rage.' },
  { title: 'Hashed Reality', c: '#fb923c', icon: Lock, text: "Your phone number is stored as an irreversible cryptographic hash. Even we can't see it." },
  { title: 'Raw Feed', c: '#f472b6', icon: ArrowDown, text: "Sorted by 'Fresh' (newest) or 'Resonating' (most liked in 24h). No personalized echo chambers." },
];

const FeaturesSection = () => {
  const containerRef = useRef(null);
  const scrollWrapRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      if (!containerRef.current || !scrollWrapRef.current) return;

      const getDistance = () => Math.max(0, scrollWrapRef.current.scrollWidth - window.innerWidth + 96);

      const trackTween = gsap.to(scrollWrapRef.current, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${Math.max(getDistance(), window.innerHeight * 1.1)}`,
          pin: true,
          scrub: 0.22,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { scale: 0.94, autoAlpha: 0.5, rotate: idx % 2 === 0 ? -1.6 : 1.6 },
          {
            scale: 1,
            autoAlpha: 1,
            rotate: 0,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: trackTween, start: 'left 78%', end: 'right 38%', scrub: 0.16, invalidateOnRefresh: true },
          },
        );
      });
    });

    mm.add('(max-width: 767px)', () => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 32, x: idx % 2 === 0 ? -20 : 20 },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top 92%', end: 'top 68%', scrub: 0.14, invalidateOnRefresh: true },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="features" ref={containerRef} className="h-screen w-full bg-[#121214] flex items-center overflow-hidden border-t border-[#2a2a2c] relative">
      <div className="absolute top-12 left-6 md:left-12 font-mono text-sm tracking-widest text-[#a1a1aa] uppercase z-10 flex items-center gap-4">
        <span className="w-12 h-[1px] bg-[#a1a1aa]"></span> Protocol
      </div>

      <div className="absolute top-1/2 left-[5vw] -translate-y-1/2 z-[4] mix-blend-difference hidden md:block pointer-events-none">
        <h2 className="font-display text-[15vw] leading-[0.8] text-[#f4f4f5] opacity-20 whitespace-nowrap">RULES OF<br />ENGAGEMENT</h2>
      </div>

      <div className="md:hidden px-6 pt-32 pb-12 w-full">
        <h2 className="font-display text-6xl leading-[0.8] text-[#f4f4f5] mb-8">RULES OF<br />ENGAGEMENT</h2>
      </div>

      <div ref={scrollWrapRef} className="flex flex-col md:flex-row gap-8 md:gap-16 px-6 md:px-[20vw] pb-24 md:pb-0 h-auto md:h-full items-center w-full md:w-max relative z-10">
        {CARDS.map((card, idx) => (
          <div
            key={idx}
            ref={(el) => (cardsRef.current[idx] = el)}
            className="w-full md:w-[450px] aspect-square md:aspect-[3/4] shrink-0 border border-[#2a2a2c] bg-[#0a0a0c] p-8 md:p-12 flex flex-col justify-between group hover:border-[#f4f4f5] transition-colors duration-500 relative overflow-hidden"
          >
            <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-50" style={{ backgroundColor: card.c }}></div>
            <div>
              <span className="font-mono text-4xl mb-6 block text-[#2a2a2c]">0{idx + 1}</span>
              <h3 className="font-sans font-medium text-3xl md:text-4xl uppercase tracking-tighter" style={{ color: card.c }}>{card.title}</h3>
            </div>
            <div className="space-y-6">
              <p className="font-sans text-lg text-[#a1a1aa] leading-relaxed group-hover:text-[#f4f4f5] transition-colors">{card.text}</p>
              <div className="w-full h-[1px] bg-[#2a2a2c] group-hover:bg-[#f4f4f5] transition-colors"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
