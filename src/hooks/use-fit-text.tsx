import { useState, useEffect, useRef } from "react";

interface UseFitTextReturn {
  ref: React.RefObject<HTMLHeadingElement | any>;
  fontSize: number;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
}

export const useFitText = (): UseFitTextReturn => {
  const ref = useRef<HTMLHeadingElement>(null);
  // const [fontSize, setFontSize] = useState(27);
  // Start with a font size based on screen size
  const [fontSize, setFontSize] = useState(() =>
    window.innerWidth >= 1600 ? 36 : 28
  );

  useEffect(() => {
    const adjustFontSize = (): void => {
      if (ref.current) {
        let currentFontSize = fontSize;

        // Reset to starting font size to re-measure properly
        ref.current.style.fontSize = `${currentFontSize}px`;

        // First, try increasing the font size if there's extra space
        while (
          ref.current.scrollHeight <= ref.current.offsetHeight &&
          currentFontSize < 24
        ) {
          currentFontSize++;
          ref.current.style.fontSize = `${currentFontSize}px`;
        }

        // If the font size is too large and causes overflow, reduce it until it fits
        while (
          ref.current.scrollHeight > ref.current.offsetHeight &&
          currentFontSize > 10
        ) {
          currentFontSize--;
          ref.current.style.fontSize = `${currentFontSize}px`;
          ref.current.style.lineHeight = `${1.6}`; // Dynamically adjust line height
        }

        setFontSize(currentFontSize); // Update state with the new font size
      }
    };

    const resizeObserver = new ResizeObserver(adjustFontSize);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [fontSize]);

  return { ref, fontSize, setFontSize };
};
