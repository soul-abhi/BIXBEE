import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const NumberCounter = ({ end, suffix = '', duration = 1.5 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let tween = null;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        tween = gsap.to({ val: 0 }, {
          val: end,
          duration,
          ease: 'power2.out',
          onUpdate() {
            setCount(Math.floor(this.targets()[0].val));
          },
        });
      },
    });

    return () => {
      trigger.kill();
      tween?.kill();
    };
  }, [end, duration]);

  const displayVal = useMemo(() => {
    if (end >= 1000000 && count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    return count.toLocaleString();
  }, [count, end]);

  return <span ref={ref}>{displayVal}{suffix}</span>;
};

export default NumberCounter;
