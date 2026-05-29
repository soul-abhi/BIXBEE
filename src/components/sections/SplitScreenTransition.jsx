import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const SplitScreenTransition = () => {
  const containerRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 0.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    tl.to(topRef.current, { yPercent: -100, ease: 'none' }, 0)
      .to(bottomRef.current, { yPercent: 100, ease: 'none' }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="h-screen w-full bg-[#121214] relative overflow-hidden flex items-center justify-center pointer-events-none z-[5]">
      <div ref={topRef} className="absolute top-0 left-0 w-full h-[50.5%] bg-[#0a0a0c] flex items-end justify-center border-b border-[#2a2a2c]">
        <div className="font-display text-8xl md:text-[8rem] text-transparent leading-none translate-y-1/2" style={{ WebkitTextStroke: '1px #2a2a2c' }}>BIXBEE</div>
      </div>
      <div ref={bottomRef} className="absolute bottom-0 left-0 w-full h-[50.5%] bg-[#0a0a0c] flex items-start justify-center border-t border-[#2a2a2c]">
        <div className="font-display text-8xl md:text-[8rem] text-transparent leading-none -translate-y-1/2" style={{ WebkitTextStroke: '1px #2a2a2c' }}>BIXBEE</div>
      </div>
      <div className="font-mono text-sm tracking-widest text-[#4ade80] opacity-50 uppercase z-0">
        Entering the raw feed
      </div>
    </div>
  );
};

export default SplitScreenTransition;
