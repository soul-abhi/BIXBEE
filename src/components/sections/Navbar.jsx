import { useEffect, useState } from 'react';
import MagneticButton from '../ui/MagneticButton';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { setIntent } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 px-6 py-6 flex justify-between items-center ${scrolled ? 'bg-[#0a0a0c]/80 backdrop-blur-md border-b border-[#2a2a2c]' : 'bg-transparent border-transparent'}`}>
      <div className="text-xl font-display uppercase tracking-widest leading-none">Bixbee<span className="text-[#ff5c58]">.</span></div>

      <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest space-x-8">
        <a href="#manifesto" className="hover:text-[#ff5c58] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#ff5c58] hover:after:w-full after:transition-all after:duration-300">Ether</a>
        <a href="#features" className="hover:text-[#4ade80] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#4ade80] hover:after:w-full after:transition-all after:duration-300">Rules</a>
        <a href="#explore" className="hover:text-[#fb923c] transition-colors relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-0 after:h-[1px] after:bg-[#fb923c] hover:after:w-full after:transition-all after:duration-300">Glimpse</a>
      </div>

      <MagneticButton
        onClick={() => setIntent('login')}
        className="px-4 py-2 border border-[#2a2a2c] hover:bg-[#ff5c58] hover:text-[#0a0a0c] hover:border-[#ff5c58] text-xs z-[100]"
        style={{ pointerEvents: 'auto' }}
      >
        Enter Platform
      </MagneticButton>
    </nav>
  );
};

export default Navbar;
