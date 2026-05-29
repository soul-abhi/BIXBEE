import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let frameId = 0;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isHovering = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    };

    const handleHoverStart = () => {
      isHovering = true;
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = '0';
        ringRef.current.style.width = '48px';
        ringRef.current.style.height = '48px';
        ringRef.current.style.backgroundColor = 'rgba(255, 92, 88, 0.2)';
        ringRef.current.style.borderColor = 'transparent';
      }
    };

    const handleHoverEnd = () => {
      isHovering = false;
      if (dotRef.current && ringRef.current) {
        dotRef.current.style.opacity = '1';
        ringRef.current.style.width = '32px';
        ringRef.current.style.height = '32px';
        ringRef.current.style.backgroundColor = 'transparent';
        ringRef.current.style.borderColor = '#f4f4f5';
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const selector = 'a, button, [role="button"], input, textarea, select';
    document.querySelectorAll(selector).forEach((el) => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (!isHovering && ringRef.current) {
        const velX = mouseX - ringX;
        const velY = mouseY - ringY;
        const velocity = Math.sqrt(velX * velX + velY * velY);
        let angle = 0;
        let stretchX = 1;
        let stretchY = 1;

        if (velocity > 1) {
          angle = Math.atan2(velY, velX);
          const normalizedVel = Math.min(velocity / 40, 1);
          stretchX = 1 + normalizedVel * 0.5;
          stretchY = 1 - normalizedVel * 0.2;
        }

        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%) rotate(${angle}rad) scale(${stretchX}, ${stretchY})`;
      } else if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (frameId) cancelAnimationFrame(frameId);
      document.querySelectorAll(selector).forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#f4f4f5] pointer-events-none z-[9999] transition-opacity duration-200"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#f4f4f5] pointer-events-none z-[9998] transition-colors duration-200"
        style={{ transformOrigin: 'center center' }}
      />
    </>
  );
};

export default CustomCursor;
