import { useCallback, useEffect, useRef, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const isHovered = useRef(false);

  const scramble = useCallback(() => {
    let iterations = 0;
    const maxIterations = 15;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (iterations > text.length || iterations > maxIterations - 2) return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(''),
      );
      iterations++;
      if (iterations > maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => scramble(), [scramble]);

  const handleMouseEnter = () => {
    if (!isHovered.current) {
      isHovered.current = true;
      scramble();
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => { isHovered.current = false; }}
      className="inline-block relative z-10"
      style={{ minWidth: `${text.length}ch` }}
    >
      {displayText}
    </span>
  );
};

export default ScrambleText;
