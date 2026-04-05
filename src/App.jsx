import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import {
  AdditiveBlending,
  Clock,
  Color,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  TetrahedronGeometry,
  WebGLRenderer,
} from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Flame, Lock } from 'lucide-react';
import './index.css';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
ScrollTrigger.defaults({ fastScrollEnd: true });

// ==========================================
// 1. COMPONENTS
// ==========================================

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
    
    const attachHoverEvents = () => {
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
        interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', handleHoverStart);
        el.addEventListener('mouseleave', handleHoverEnd);
        });
    }
    
    attachHoverEvents();

    const render = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      const maxVelocity = 40;
      let angle = 0;
      let stretchX = 1;
      let stretchY = 1;

      if (!isHovering && ringRef.current) {
        const velX = mouseX - ringX;
        const velY = mouseY - ringY;
        const velocity = Math.sqrt(velX * velX + velY * velY);
        
        if (velocity > 1) {
          angle = Math.atan2(velY, velX);
          const normalizedVel = Math.min(velocity / maxVelocity, 1);
          stretchX = 1 + normalizedVel * 0.5;
          stretchY = 1 - normalizedVel * 0.2;
        }

        ringRef.current.style.transform = `
          translate(${ringX}px, ${ringY}px) 
          translate(-50%, -50%) 
          rotate(${angle}rad) 
          scale(${stretchX}, ${stretchY})
        `;
      } else if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      frameId = requestAnimationFrame(render);
    };
    
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      interactiveElements.forEach(el => {
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

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollY / docHeight;
      setProgress(scrollPercent * 100);
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

const TextReveal = ({ text, className, delay = 0, once = false }) => {
  const containerRef = useRef(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const masks = el.querySelectorAll('.word-mask');
    
    const tween = gsap.fromTo(masks, 
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 0.55,
        ease: "none",
        stagger: 0.065,
        delay: delay,
        scrollTrigger: {
          trigger: el,
          start: "top 92%",
          end: "top 62%",
          scrub: once ? false : 0.16,
          invalidateOnRefresh: true,
          once: once,
        }
      }
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
          <span className="word-mask inline-block translate-y-[120%] tracking-tight">
            {word}
          </span>
        </span>
      ))}
    </div>
  );
};

const MagneticButton = ({ children, className = '', ...props }) => {
  const btnRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const text = textRef.current;
    if (!btn || !text) return;

    const move = (e) => {
      const rect = btn.getBoundingClientRect();
      const h = rect.width / 2;
      const w = rect.height / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - w;

      gsap.to(btn, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.6,
        ease: "power3.out",
      });

      gsap.to(text, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const leave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
      gsap.to(text, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
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

const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const isHovered = useRef(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const scramble = useCallback(() => {
    let iterations = 0;
    const maxIterations = 15;
    
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if(char === ' ') return ' ';
        if(iterations > text.length || iterations > maxIterations - 2) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      iterations++;

      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 40);
    
    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    return scramble();
  }, [scramble]);

  const handleMouseEnter = () => {
    if (!isHovered.current) {
      isHovered.current = true;
      scramble();
    }
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
  };

  return (
    <span 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block relative z-10"
      style={{ minWidth: `${text.length}ch` }}
    >
      {displayText}
    </span>
  );
};

const NumberCounter = ({ end, suffix = '', duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let tween = null;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        tween = gsap.to({ val: 0 }, {
          val: end,
          duration: duration,
          ease: "power2.out",
          onUpdate: function() {
            setCount(Math.floor(this.targets()[0].val));
          }
        });
      }
    });

    return () => {
      trigger.kill();
      tween?.kill();
    };
  }, [end, duration]);

  const displayVal = useMemo(() => {
    if (end >= 1000000 && count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    return count.toLocaleString();
  }, [count, end]);

  return <span ref={ref}>{displayVal}{suffix}</span>;
};

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const container = canvasRef.current;
    const scene = new Scene();
    
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    while(container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 4000 : 12000;
    
    const geometry = new TetrahedronGeometry(0.22);
    const material = new MeshBasicMaterial({ 
      color: 0xffffff,
      transparent: true,
      opacity: 0.42,
      blending: AdditiveBlending
    });

    const instancedMesh = new InstancedMesh(geometry, material, count);
    
    const dummy = new Object3D();
    const color = new Color();
    
    scene.add(instancedMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    let globalShatter = 15;
    let targetShatter = 15;
    let shatterTimeout = null;
    let frameId = 0;
    
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      targetRotationY = mouseX * 0.26;
      targetRotationX = -mouseY * 0.26;
    };
    
    const onClick = () => {
      targetShatter = 40;
      if (shatterTimeout) {
        clearTimeout(shatterTimeout);
      }
      shatterTimeout = setTimeout(() => {
        targetShatter = 15;
      }, 1500);
    };

    window.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);

    const baseData = new Float32Array(count * 8);
    const positions = new Float32Array(count * 3);
    const targets = new Float32Array(count * 3);
    const cbrt = Math.floor(Math.pow(count, 0.333333));
    const resolution = 40;
    const step = 2 / resolution;
    
    for (let i = 0; i < count; i++) {
        const ix = i % cbrt;
        const iy = Math.floor(i / cbrt) % cbrt;
        const iz = Math.floor(i / (cbrt * cbrt));
        
        const nx = (ix / cbrt) * 2 - 1;
        const ny = (iy / cbrt) * 2 - 1;
        const nz = (iz / cbrt) * 2 - 1;
        
        const mx = Math.floor(nx / step) * step;
        const my = Math.floor(ny / step) * step;
        const mz = Math.floor(nz / step) * step;
        
        const lx = (nx - mx) / step;
        const ly = (ny - my) / step;
        const lz = (nz - mz) / step;
        
        const b = i * 8;
        baseData[b] = mx;
        baseData[b+1] = my;
        baseData[b+2] = mz;
        baseData[b+3] = lx;
        baseData[b+4] = ly;
        baseData[b+5] = lz;
        baseData[b+6] = ix;
        baseData[b+7] = iy;

        const p = i * 3;
        positions[p] = mx * 50;
        positions[p+1] = my * 50;
        positions[p+2] = mz * 50;
        targets[p] = positions[p];
        targets[p+1] = positions[p+1];
        targets[p+2] = positions[p+2];
    }

    const clock = new Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      const t = clock.getElapsedTime();
      
      globalShatter += (targetShatter - globalShatter) * 0.05;

      const scale = 50;
      
      for (let i = 0; i < count; i++) {
        const b = i * 8;
        const mx = baseData[b];
        const my = baseData[b+1];
        const mz = baseData[b+2];
        const lx = baseData[b+3];
        const ly = baseData[b+4];
        const lz = baseData[b+5];
        const ix = baseData[b+6];
        const iy = baseData[b+7];
        
        const phase = Math.sin(mx * 3 + my * 4 + mz * 5 - t * 2);
        const evolve = Math.max(0, phase);
        
        const mLen = Math.sqrt(mx * mx + my * my + mz * mz);
        const sx = mLen === 0 ? 0 : (mx / mLen) * scale;
        const sy = mLen === 0 ? 0 : (my / mLen) * scale;
        const sz = mLen === 0 ? 0 : (mz / mLen) * scale;
        
        const formMorph = (Math.sin(t * 0.5) + 1) * 0.5;
        
        let px = mx * scale * (1 - formMorph) + sx * formMorph;
        let py = my * scale * (1 - formMorph) + sy * formMorph;
        let pz = mz * scale * (1 - formMorph) + sz * formMorph;
        
        px += lx * evolve * globalShatter;
        py += ly * evolve * globalShatter;
        pz += lz * evolve * globalShatter;
        
        const angle = pz * 0.05 * Math.sin(t * 0.3);
        const finalX = px * Math.cos(angle) - py * Math.sin(angle);
        const finalY = px * Math.sin(angle) + py * Math.cos(angle);
        
        const edgeDist = Math.min(1, Math.max(0, (mLen - 0.5) * 2));
        
        const hue = Math.abs((mx * 0.5 + my * 0.3 + mz * 0.2 + t * 0.1) % 1);
        const lightness = 0.5 + 0.5 * evolve - edgeDist * 0.3;
        
        color.setHSL(hue, 0.9, lightness);
        
        const p = i * 3;
        targets[p] = finalX;
        targets[p+1] = finalY;
        targets[p+2] = pz;

        positions[p] += (targets[p] - positions[p]) * 0.08;
        positions[p+1] += (targets[p+1] - positions[p+1]) * 0.08;
        positions[p+2] += (targets[p+2] - positions[p+2]) * 0.08;

        dummy.position.set(positions[p], positions[p+1], positions[p+2]);
        dummy.rotation.x = t + ix;
        dummy.rotation.y = t + iy;
        dummy.updateMatrix();
        
        instancedMesh.setMatrixAt(i, dummy.matrix);
        instancedMesh.setColorAt(i, color);
      }
      
      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;

      instancedMesh.rotation.x += (targetRotationX - instancedMesh.rotation.x) * 0.1;
      instancedMesh.rotation.y += (targetRotationY - instancedMesh.rotation.y) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
      if (shatterTimeout) {
        clearTimeout(shatterTimeout);
      }
      
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      
      if (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <div 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none opacity-25 z-0 bg-transparent mix-blend-normal"
    />
  );
};

// ==========================================
// 2. SECTIONS
// ==========================================

const HeroSection = () => {
  const textRef = useRef(null);
  
  useEffect(() => {
    const tween = gsap.to(textRef.current, {
        yPercent: 40,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.18,
            invalidateOnRefresh: true
        }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex flex-col justify-center items-center overflow-hidden z-10 bg-[#0a0a0c]/80 backdrop-blur-sm px-4">
      <ParticleCanvas />
      
      <div 
        ref={textRef}
        className="relative z-[2] flex flex-col items-center max-w-5xl mx-auto w-full text-center"
      >
        <h1 className="font-display leading-none text-[#f4f4f5] text-[15vw] md:text-[min(18vw,280px)] uppercase mb-2 tracking-tighter" style={{ WebkitTextStroke: '1px rgba(244,244,245,0.6)' }}>
          <ScrambleText text="BIXBEE" />
        </h1>
        
        <p className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] mb-12 text-[#a1a1aa] bg-[#0a0a0c] p-2 inline-block">
          Your voice. No trace. No judgment.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mt-8">
          <MagneticButton className="bg-[#ff5c58] text-[#0a0a0c] border-[#ff5c58] font-bold z-[100] cursor-pointer pointer-events-auto" style={{pointerEvents: 'auto'}}>
            Create Your ID
          </MagneticButton>
          <MagneticButton className="z-[100] cursor-pointer pointer-events-auto" style={{pointerEvents: 'auto'}}>
            Explore Posts
          </MagneticButton>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce z-[2] opacity-50 pointer-events-none">
        <span className="font-mono text-[10px] mb-2 uppercase tracking-widest">Scroll</span>
        <ArrowDown size={16} />
      </div>
    </section>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
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

      <MagneticButton className="px-4 py-2 border border-[#2a2a2c] hover:bg-[#ff5c58] hover:text-[#0a0a0c] hover:border-[#ff5c58] text-xs z-[100]" style={{pointerEvents: 'auto'}}>
        Enter Platform
      </MagneticButton>
    </nav>
  );
};

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

const ManifestoSection = () => {
  const containerRef = useRef(null);
  const pinnedTextRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.set(linesRef.current, { autoAlpha: 0, y: 48, x: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=260%',
          pin: true,
          scrub: 0.24,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      linesRef.current.forEach((line, index) => {
        const colors = ['#f4f4f5', '#fb923c', '#4ade80', '#ff5c58'];

        tl.to(
          line,
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 0.8,
            ease: 'none',
          },
          index * 0.95,
        ).to(
          pinnedTextRef.current,
          {
            color: colors[index],
            duration: 0.4,
            ease: 'none',
          },
          index * 0.95,
        );
      });
    });

    mm.add('(max-width: 767px)', () => {
      linesRef.current.forEach((line) => {
        gsap.fromTo(
          line,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: line,
              start: 'top 92%',
              end: 'top 72%',
              scrub: 0.14,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      id="manifesto"
      ref={containerRef} 
      className="bg-[#0a0a0c] py-24 md:py-0 min-h-screen flex items-center relative border-t border-[#2a2a2c]"
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 flex flex-col md:flex-row gap-16 md:gap-8 items-center h-full">
        <div className="w-full md:w-1/2 md:h-screen flex items-center">
          <h2 
            ref={pinnedTextRef}
            className="font-display text-5xl sm:text-6xl md:text-[5rem] lg:text-[6rem] leading-[0.9] text-[#f4f4f5] transition-colors duration-500 max-w-[15ch] lowercase"
          >
            Everyone carries something they can't say out loud.
          </h2>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-8 md:gap-16 pt-6 md:pt-24 pb-8 md:pb-6">
          {[
            { word: "Not", rest: "because it's wrong." },
            { word: "Not", rest: "because it's dangerous." },
            { word: "Because", rest: "there is no one safe enough." },
            { word: "BIXBEE", rest: "is that place.", highlight: true }
          ].map((item, i) => (
            <div 
              key={i}
              ref={el => linesRef.current[i] = el}
              className="md:opacity-0 md:translate-y-12 md:translate-x-8 font-mono text-xl sm:text-2xl lg:text-3xl max-w-[20ch] border-l-2 border-[#2a2a2c] pl-6 md:pl-8 py-2"
            >
              <span className={item.highlight ? "text-[#ff5c58] font-bold" : "text-[#a1a1aa]"}>{item.word}</span> <br/>
              <span className="text-[#f4f4f5]">{item.rest}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
    const containerRef = useRef(null);
    const scrollWrapRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      if (!containerRef.current || !scrollWrapRef.current) return;

      const getDistance = () => Math.max(0, scrollWrapRef.current.scrollWidth - window.innerWidth + 96);

      const trackTween = gsap.to(scrollWrapRef.current, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${Math.max(getDistance(), window.innerHeight * 1.1)}`,
          pin: true,
          scrub: 0.22,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { scale: 0.94, autoAlpha: 0.5, rotate: idx % 2 === 0 ? -1.6 : 1.6 },
          {
            scale: 1,
            autoAlpha: 1,
            rotate: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: trackTween,
              start: 'left 78%',
              end: 'right 38%',
              scrub: 0.16,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    mm.add('(max-width: 767px)', () => {
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 32, x: idx % 2 === 0 ? -20 : 20 },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'top 68%',
              scrub: 0.14,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    return () => mm.revert();
    }, []);

    const cards = [
        { title: "Zero Identity", c: "#ff5c58", icon: Lock, text: "No name, no photo, no email. Just a brutal 6-character alphanumeric ID." },
        { title: "No Judgment", c: "#4ade80", icon: Flame, text: "Likes only. No comments. No replies. No algorithms optimizing for rage." },
        { title: "Hashed Reality", c: "#fb923c", icon: Lock, text: "Your phone number is stored as an irreversible cryptographic hash. Even we can't see it." },
        { title: "Raw Feed", c: "#f472b6", icon: ArrowDown, text: "Sorted by 'Fresh' (newest) or 'Resonating' (most liked in 24h). No personalized echo chambers." },
    ];

    return (
        <section id="features" ref={containerRef} className="h-screen w-full bg-[#121214] flex items-center overflow-hidden border-t border-[#2a2a2c] relative">
            <div className="absolute top-12 left-6 md:left-12 font-mono text-sm tracking-widest text-[#a1a1aa] uppercase z-10 flex items-center gap-4">
                <span className="w-12 h-[1px] bg-[#a1a1aa]"></span> Protocol
            </div>

            <div className="absolute top-1/2 left-[5vw] -translate-y-1/2 z-[4] mix-blend-difference hidden md:block pointer-events-none">
                <h2 className="font-display text-[15vw] leading-[0.8] text-[#f4f4f5] opacity-20 whitespace-nowrap">
                    RULES OF<br/>ENGAGEMENT
                </h2>
            </div>
            
            <div className="md:hidden px-6 pt-32 pb-12 w-full">
                <h2 className="font-display text-6xl leading-[0.8] text-[#f4f4f5] mb-8">RULES OF<br/>ENGAGEMENT</h2>
            </div>

            <div 
                ref={scrollWrapRef} 
                className="flex flex-col md:flex-row gap-8 md:gap-16 px-6 md:px-[20vw] pb-24 md:pb-0 h-auto md:h-full items-center w-full md:w-max relative z-10"
            >
                {cards.map((card, idx) => (
                    <div 
                        key={idx} 
                        ref={el => cardsRef.current[idx] = el}
                        className="w-full md:w-[450px] aspect-square md:aspect-[3/4] shrink-0 border border-[#2a2a2c] bg-[#0a0a0c] p-8 md:p-12 flex flex-col justify-between group hover:border-[#f4f4f5] transition-colors duration-500 relative overflow-hidden"
                    >
                        <div className="absolute -right-8 -top-8 w-48 h-48 rounded-full blur-[100px] opacity-20 pointer-events-none transition-opacity duration-1000 group-hover:opacity-50" style={{ backgroundColor: card.c }}></div>
                        
                        <div>
                            <span className="font-mono text-4xl mb-6 block text-[#2a2a2c]">0{idx+1}</span>
                            <h3 className="font-sans font-medium text-3xl md:text-4xl uppercase tracking-tighter" style={{ color: card.c }}>{card.title}</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <p className="font-sans text-lg text-[#a1a1aa] leading-relaxed group-hover:text-[#f4f4f5] transition-colors">{card.text}</p>
                            <div className="w-full h-[1px] bg-[#2a2a2c] group-hover:bg-[#f4f4f5] transition-colors"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const IdentitySection = () => {
    const ids = ['47MK82', '09CX14', '61WR37', '88NX31', 'XX99ZZ'];
  const idCount = ids.length;
    const [currentId, setCurrentId] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
      setCurrentId(prev => (prev + 1) % idCount);
        }, 1500);
        return () => clearInterval(interval);
  }, [idCount]);

    return (
        <section className="min-h-[80vh] bg-[#ff5c58] text-[#0a0a0c] flex flex-col justify-center items-center py-32 px-6 relative border-t border-[#0a0a0c]">
            <div className="absolute inset-0 noise z-0" style={{opacity: 0.15}}></div>
            
            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center text-center">
                <p className="font-mono text-sm uppercase tracking-[0.2em] mb-12 border border-[#0a0a0c] px-4 py-2 rounded-full inline-block">
                    Your True Face
                </p>

                <div className="h-[20vw] md:h-[220px] flex items-center mb-8 relative w-full overflow-hidden justify-center mix-blend-multiply">
                    <h2 className="font-mono text-[16vw] md:text-[200px] font-black leading-none tracking-tight">
                        {ids.map((id, idx) => (
                            <span 
                                key={id} 
                                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${idx === currentId ? 'opacity-100 scale-100 blur-none' : 'opacity-0 scale-110 blur-sm pointer-events-none'}`}
                            >
                                {id}
                            </span>
                        ))}
                    </h2>
                </div>

                <TextReveal 
                    text="This is you on BIXBEE. Nothing more." 
                    className="font-display text-4xl sm:text-5xl md:text-6xl lowercase mt-8 md:mt-16"
                />

                <div className="w-full h-[1px] bg-[#0a0a0c]/20 my-16 md:my-24"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-left">
                    <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#0a0a0c]/20 pt-8 md:pt-0 md:pl-8">
                        <span className="font-mono text-4xl md:text-6xl font-bold mb-4 tracking-tighter block">
                            <NumberCounter end={1700000} suffix="+" duration={2} />
                        </span>
                        <span className="font-mono text-xs uppercase tracking-widest block font-medium opacity-70">Possible Identities</span>
                    </div>
                    <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#0a0a0c]/20 pt-8 md:pt-0 md:pl-8">
                        <span className="font-mono text-4xl md:text-6xl font-bold mb-4 tracking-tighter block">
                            <NumberCounter end={0} duration={1} />
                        </span>
                        <span className="font-mono text-xs uppercase tracking-widest block font-medium opacity-70">Data Points Stored</span>
                    </div>
                    <div className="flex flex-col border-t md:border-t-0 md:border-l border-[#0a0a0c]/20 pt-8 md:pt-0 md:pl-8">
                        <span className="font-mono text-4xl md:text-6xl font-bold mb-4 tracking-tighter block">
                          &infin;
                        </span>
                        <span className="font-mono text-xs uppercase tracking-widest block font-medium opacity-70">Things You Can Say</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

const ExploreSection = () => {
    const sectionRef = useRef(null);
    const postRefs = useRef([]);

    const posts = [
        { id: "28MN41", text: "I threw away the note you gave me seven years ago. finally. it took me seven years.", likes: "4.2k", time: "Fresh" },
        { id: "X99LQQ", text: "i'm fundamentally exhausted and everyone thinks i'm just focused.", likes: "12k", time: "Resonating" },
        { id: "10AB0C", text: "Got the promotion. Didn't tell my parents because they wouldn't understand the title anyway. Celebrating alone with a mediocre pizza.", likes: "891", time: "Fresh" },
        { id: "77JZX2", text: "I don't think I know how to love people correctly. it always feels like i'm performing.", likes: "28k", time: "Resonating" },
        { id: "M4KXX9", text: "We sat in silence for twenty minutes in the car today. it wasn't awkward. i think that means it's real.", likes: "1.1k", time: "Fresh" }
    ];

    useEffect(() => {
      const animations = [];
        postRefs.current.forEach((post, i) => {
            if(!post) return;
            
            const xDir = i % 2 === 0 ? -50 : 50;
            const rtDir = i % 2 === 0 ? -2 : 2;

            const tween = gsap.fromTo(post, 
                { x: xDir, y: 50, opacity: 0, rotation: rtDir },
                {
                    x: 0, y: 0, opacity: 1, rotation: 0,
                ease: "none",
                    scrollTrigger: {
                        trigger: post,
                  start: "top 92%",
                  end: "top 70%",
                  scrub: 0.14,
                  invalidateOnRefresh: true,
                    }
                }
            );

            animations.push(tween);
        });

          return () => {
            animations.forEach((anim) => {
              anim.scrollTrigger?.kill();
              anim.kill();
            });
          };
    }, []);

    return (
        <section id="explore" ref={sectionRef} className="py-32 md:py-48 px-6 bg-[#0a0a0c] border-t border-[#2a2a2c] relative">
            <div className="max-w-3xl mx-auto w-full pointer-events-none mb-24 md:mb-32 text-center md:text-left text-balance">
                <TextReveal text="Raw Transmissions." className="font-display text-5xl md:text-7xl uppercase inline-block" />
                <p className="font-mono text-[#a1a1aa] mt-6 text-sm uppercase tracking-widest max-w-[40ch] leading-relaxed">Signals cast into the void, caught by those passing through.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-8 md:space-y-12">
                {posts.map((post, i) => (
                    <div 
                        key={i}
                        ref={el => postRefs.current[i] = el}
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
                <MagneticButton className="border-[#2a2a2c] opacity-50 hover:opacity-100 italic pointer-events-auto z-10" style={{pointerEvents: 'auto'}}>
                    Load More Signals
                </MagneticButton>
            </div>
        </section>
    );
};

const FinalCTA = () => {
    return (
        <section className="min-h-[80vh] md:min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center relative overflow-hidden border-t border-[#2a2a2c]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-[#ff5c58] rounded-full blur-[150px] opacity-10 pointer-events-none mix-blend-screen"></div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center text-balance flex flex-col items-center">
                <h2 className="font-display leading-[0.85] text-[12vw] md:text-[140px] uppercase mb-12 tracking-tighter">
                    <TextReveal text="You have something to say." />
                </h2>
                
                <p className="font-mono text-lg md:text-2xl text-[#a1a1aa] mb-16 max-w-[30ch]">
                    No one needs to know it's you.
                </p>

                <MagneticButton className="bg-[#f4f4f5] text-[#0a0a0c] border-transparent font-bold hover:bg-[#ff5c58] text-lg px-12 py-6 rounded-none pointer-events-auto shadow-2xl z-10" style={{pointerEvents: 'auto'}}>
                    Create Your ID
                </MagneticButton>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0c] px-6 py-12 border-t border-[#121214] font-mono text-xs uppercase tracking-widest text-[#a1a1aa] flex flex-col md:flex-row justify-between items-center gap-8 z-20 relative">
            <div className="font-display text-2xl text-[#f4f4f5] tracking-tight border border-[#2a2a2c] p-2 mix-blend-difference">BIXBEE</div>
            
            <div className="text-center bg-[#121214] px-6 py-2 rounded-full border border-[#2a2a2c]">
                No data. No trace. No judgment.
            </div>

            <div className="flex gap-6 pointer-events-auto">
                <a href="#" className="hover:text-[#f4f4f5] transition-colors p-2 z-[100]" style={{pointerEvents: 'auto'}}>Terms</a>
                <a href="#" className="hover:text-[#f4f4f5] transition-colors p-2 z-[100]" style={{pointerEvents: 'auto'}}>Privacy</a>
            </div>
        </footer>
    );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================

export default function App() {
  useEffect(() => {
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, []);

  return (
    <>
      <div className="noise" />
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      
      <main className="bg-[#0a0a0c]">
        <HeroSection />
        <SplitScreenTransition />
        <ManifestoSection />
        <FeaturesSection />
        <IdentitySection />
        <ExploreSection />
        <FinalCTA />
        <Footer />
      </main>
    </>
  );
}
