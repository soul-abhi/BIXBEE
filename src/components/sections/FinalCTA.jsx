import TextReveal from '../ui/TextReveal';
import MagneticButton from '../ui/MagneticButton';
import { useAuth } from '../../context/useAuth';

const FinalCTA = () => {
  const { setIntent } = useAuth();

  return (
    <section className="min-h-[80vh] md:min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center relative overflow-hidden border-t border-[#2a2a2c]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[#ff5c58] rounded-full blur-[150px] opacity-10 pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center text-balance flex flex-col items-center">
        <h2 className="font-display leading-[0.85] text-[12vw] md:text-[140px] uppercase mb-12 tracking-tighter">
          <TextReveal text="You have something to say." />
        </h2>

        <p className="font-mono text-lg md:text-2xl text-[#a1a1aa] mb-16 max-w-[30ch]">
          No one needs to know it&apos;s you.
        </p>

        <MagneticButton
          onClick={() => setIntent('signup')}
          className="bg-[#f4f4f5] text-[#0a0a0c] border-transparent font-bold hover:bg-[#ff5c58] text-lg px-12 py-6 rounded-none pointer-events-auto shadow-2xl z-10"
          style={{ pointerEvents: 'auto' }}
        >
          Create Your ID
        </MagneticButton>
      </div>
    </section>
  );
};

export default FinalCTA;
