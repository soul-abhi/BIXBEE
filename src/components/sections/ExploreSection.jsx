import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import TextReveal from '../ui/TextReveal';
import MagneticButton from '../ui/MagneticButton';

const POSTS = [
  { id: '28MN41', text: 'I threw away the note you gave me seven years ago. finally. it took me seven years.', likes: '4.2k', time: 'Fresh' },
  { id: 'X99LQQ', text: "i'm fundamentally exhausted and everyone thinks i'm just focused.", likes: '12k', time: 'Resonating' },
  { id: '10AB0C', text: "Got the promotion. Didn't tell my parents because they wouldn't understand the title anyway. Celebrating alone with a mediocre pizza.", likes: '891', time: 'Fresh' },
  { id: '77JZX2', text: "I don't think I know how to love people correctly. it always feels like i'm performing.", likes: '28k', time: 'Resonating' },
  { id: 'M4KXX9', text: "We sat in silence for twenty minutes in the car today. it wasn't awkward. i think that means it's real.", likes: '1.1k', time: 'Fresh' },
];

const ExploreSection = () => {
  const postRefs = useRef([]);

  useEffect(() => {
    const animations = [];
    postRefs.current.forEach((post, i) => {
      if (!post) return;
      const tween = gsap.fromTo(
        post,
        { x: i % 2 === 0 ? -50 : 50, y: 50, opacity: 0, rotation: i % 2 === 0 ? -2 : 2 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          rotation: 0,
          ease: 'none',
          scrollTrigger: { trigger: post, start: 'top 92%', end: 'top 70%', scrub: 0.14, invalidateOnRefresh: true },
        },
      );
      animations.push(tween);
    });

    return () => animations.forEach((anim) => {
      anim.scrollTrigger?.kill();
      anim.kill();
    });
  }, []);

  return (
    <section id="explore" className="py-32 md:py-48 px-6 bg-[#0a0a0c] border-t border-[#2a2a2c] relative">
      <div className="max-w-3xl mx-auto w-full pointer-events-none mb-24 md:mb-32 text-center md:text-left text-balance">
        <TextReveal text="Raw Transmissions." className="font-display text-5xl md:text-7xl uppercase inline-block" />
        <p className="font-mono text-[#a1a1aa] mt-6 text-sm uppercase tracking-widest max-w-[40ch] leading-relaxed">Signals cast into the void, caught by those passing through.</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
        {POSTS.map((post, i) => (
          <div
            key={i}
            ref={(el) => (postRefs.current[i] = el)}
            className={`bg-[#121214] border border-[#2a2a2c] p-6 md:p-8 flex flex-col transform hover:border-[#4ade80] transition-colors duration-500 will-change-transform ${i % 2 === 1 ? 'md:translate-x-12' : 'md:-translate-x-12'}`}
          >
            <div className="flex justify-between font-mono text-xs uppercase tracking-widest text-[#a1a1aa] mb-6">
              <span className="text-[#4ade80]">{post.id}</span>
              <span>{post.time}</span>
            </div>
            <p className="font-sans text-xl md:text-2xl leading-snug mb-8 text-[#f4f4f5] lowercase selection:bg-[#4ade80] selection:text-[#0a0a0c]">{post.text}</p>
            <div className="flex justify-between items-center border-t border-[#2a2a2c] pt-4 mt-auto">
              <span className="font-mono text-xs text-[#a1a1aa]">Void Echo</span>
              <span className="font-mono text-sm flex items-center gap-2 group cursor-none pointer-events-auto">
                <span className="inline-block w-2 h-2 bg-[#2a2a2c] rounded-full group-hover:bg-[#f472b6] transition-colors shadow-[0_0_10px_transparent] group-hover:shadow-[0_0_10px_#f472b6]"></span>
                {post.likes}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-24">
        <MagneticButton className="border-[#2a2a2c] opacity-50 hover:opacity-100 italic pointer-events-auto z-10" style={{ pointerEvents: 'auto' }}>
          Load More Signals
        </MagneticButton>
      </div>
    </section>
  );
};

export default ExploreSection;
