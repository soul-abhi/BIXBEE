const Footer = () => (
  <footer className="bg-[#0a0a0c] px-6 py-12 border-t border-[#121214] font-mono text-xs uppercase tracking-widest text-[#a1a1aa] flex flex-col md:flex-row justify-between items-center gap-8 z-20 relative">
    <div className="font-display text-2xl text-[#f4f4f5] tracking-tight border border-[#2a2a2c] p-2 mix-blend-difference">BIXBEE</div>

    <div className="text-center bg-[#121214] px-6 py-2 rounded-full border border-[#2a2a2c]">
      No data. No trace. No judgment.
    </div>

    <div className="flex gap-6 pointer-events-auto">
      <a href="#" className="hover:text-[#f4f4f5] transition-colors p-2 z-[100]" style={{ pointerEvents: 'auto' }}>Terms</a>
      <a href="#" className="hover:text-[#f4f4f5] transition-colors p-2 z-[100]" style={{ pointerEvents: 'auto' }}>Privacy</a>
    </div>
  </footer>
);

export default Footer;
