import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TextReveal = ({ text, className, delay = 0, once = false }) => {
  const containerRef = useRef(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const masks = el.querySelectorAll('.word-mask');
    const tween = gsap.fromTo(
      masks,
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 0.55,
        ease: 'none',
        stagger: 0.065,
        delay,
        scrollTrigger: {
          trigger: el,
          start: 'top 92%',
          end: 'top 62%',
          scrub: once ? false : 0.16,
          invalidateOnRefresh: true,
          once,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text, delay, once]);

  return (
    <div ref={containerRef} className={`${className} flex flex-wrap gap-[0.25em]`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block pb-[0.1em] -mb-[0.1em]">
          <span className="word-mask inline-block translate-y-[120%] tracking-tight">{word}</span>
        </span>
      ))}
    </div>
  );
};

export default TextReveal;
