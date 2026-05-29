import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LINES = [
  { word: 'Not', rest: "because it's wrong." },
  { word: 'Not', rest: "because it's dangerous." },
  { word: 'Because', rest: 'there is no one safe enough.' },
  { word: 'BIXBEE', rest: 'is that place.', highlight: true },
];

const ManifestoSection = () => {
  const containerRef = useRef(null);
  const pinnedTextRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.set(linesRef.current, { autoAlpha: 0, y: 48, x: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 0.24,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const colors = ['#f4f4f5', '#fb923c', '#4ade80', '#ff5c58'];
      linesRef.current.forEach((line, index) => {
        tl.to(line, { autoAlpha: 1, y: 0, x: 0, duration: 0.8, ease: 'none' }, index * 0.95)
          .to(pinnedTextRef.current, { color: colors[index], duration: 0.4, ease: 'none' }, index * 0.95);
      });
    });

    mm.add('(max-width: 767px)', () => {
      linesRef.current.forEach((line) => {
        gsap.fromTo(
          line,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: line, start: 'top 92%', end: 'top 72%', scrub: 0.14, invalidateOnRefresh: true },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="manifesto" ref={containerRef} className="bg-[#0a0a0c] py-24 md:py-0 min-h-screen flex items-center relative border-t border-[#2a2a2c]">
      <div className="max-w-[1400px] mx-auto w-full px-6 flex flex-col md:flex-row gap-16 md:gap-8 items-center h-full">
        <div className="w-full md:w-1/2 md:h-screen flex items-center">
          <h2 ref={pinnedTextRef} className="font-display text-5xl sm:text-6xl md:text-[5rem] lg:text-[6rem] leading-[0.9] text-[#f4f4f5] transition-colors duration-500 max-w-[15ch] lowercase">
            Everyone carries something they can&apos;t say out loud.
          </h2>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-8 md:gap-16 pt-6 md:pt-24 pb-8 md:pb-6">
          {LINES.map((item, i) => (
            <div
              key={i}
              ref={(el) => (linesRef.current[i] = el)}
              className="md:opacity-0 md:translate-y-12 md:translate-x-8 font-mono text-xl sm:text-2xl lg:text-3xl max-w-[20ch] border-l-2 border-[#2a2a2c] pl-6 md:pl-8 py-2"
            >
              <span className={item.highlight ? 'text-[#ff5c58] font-bold' : 'text-[#a1a1aa]'}>{item.word}</span> <br />
              <span className="text-[#f4f4f5]">{item.rest}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManifestoSection;
