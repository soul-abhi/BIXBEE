import { useEffect, useState } from 'react';
import TextReveal from '../ui/TextReveal';
import NumberCounter from '../ui/NumberCounter';

const IDS = ['47MK82', '09CX14', '61WR37', '88NX31', 'XX99ZZ'];

const IdentitySection = () => {
  const [currentId, setCurrentId] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentId((prev) => (prev + 1) % IDS.length), 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-[80vh] bg-[#ff5c58] text-[#0a0a0c] flex flex-col justify-center items-center py-32 px-6 relative border-t border-[#0a0a0c]">
      <div className="absolute inset-0 noise z-0" style={{ opacity: 0.15 }}></div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
        <p className="font-mono text-sm uppercase tracking-[0.2em] mb-12 border border-[#0a0a0c] px-4 py-2 rounded-full inline-block">
          Your True Face
        </p>

        <div className="h-[20vw] md:h-[220px] flex items-center mb-8 relative w-full overflow-hidden justify-center mix-blend-multiply">
          <h2 className="font-mono text-[16vw] md:text-[200px] font-black leading-none tracking-tight">
            {IDS.map((id, idx) => (
              <span
                key={id}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${idx === currentId ? 'opacity-100 scale-100 blur-none' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}
              >
                {id}
              </span>
            ))}
          </h2>
        </div>

        <TextReveal text="This is you on BIXBEE. Nothing more." className="font-display text-4xl sm:text-5xl md:text-6xl lowercase mt-8 md:mt-16" />

        <div className="w-full h-[1px] bg-[#0a0a0c]/20 my-16 md:my-24"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-left">
          <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#0a0a0c]/20 pt-8 md:pt-0 md:pl-8">
            <span className="font-mono text-4xl md:text-6xl font-bold mb-4 tracking-tighter block"><NumberCounter end={1700000} suffix="+" duration={2} /></span>
            <span className="font-mono text-xs uppercase tracking-widest block font-medium opacity-70">Possible Identities</span>
          </div>
          <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#0a0a0c]/20 pt-8 md:pt-0 md:pl-8">
            <span className="font-mono text-4xl md:text-6xl font-bold mb-4 tracking-tighter block"><NumberCounter end={0} duration={1} /></span>
            <span className="font-mono text-xs uppercase tracking-widest block font-medium opacity-70">Data Points Stored</span>
          </div>
          <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#0a0a0c]/20 pt-8 md:pt-0 md:pl-8">
            <span className="font-mono text-4xl md:text-6xl font-bold mb-4 tracking-tighter block">&infin;</span>
            <span className="font-mono text-xs uppercase tracking-widest block font-medium opacity-70">Things You Can Say</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdentitySection;
