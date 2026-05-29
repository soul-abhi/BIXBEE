import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const MagneticButton = ({ children, className = '', ...props }) => {
  const btnRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    const move = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.1, y: y * 0.1, duration: 0.6, ease: 'power3.out' });
      gsap.to(text, { x: x * 0.15, y: y * 0.15, duration: 0.5, ease: 'power3.out' });
    };

    const leave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      gsap.to(text, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    };

    btn.addEventListener('mousemove', move);
    btn.addEventListener('mouseleave', leave);

    return () => {
      btn.removeEventListener('mousemove', move);
      btn.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      className={`relative inline-flex items-center justify-center border border-[#f4f4f5] px-8 py-4 bg-transparent text-sm uppercase tracking-widest font-mono hover:text-[#0a0a0c] transition-colors duration-300 overflow-hidden group ${className}`}
      {...props}
    >
      <div className="absolute inset-0 bg-[#f4f4f5] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0" />
      <span ref={textRef} className="relative z-10 pointer-events-none block">{children}</span>
    </button>
  );
};

export default MagneticButton;
