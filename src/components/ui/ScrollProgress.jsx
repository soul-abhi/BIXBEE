import { useEffect, useState } from 'react';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress((scrollY / docHeight) * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-1 h-screen bg-transparent z-50 pointer-events-none hidden md:block">
      <div
        className="w-full bg-[#ff5c58] origin-top"
        style={{ height: `${progress}%`, transition: 'height 0.1s linear' }}
      />
    </div>
  );
};

export default ScrollProgress;
