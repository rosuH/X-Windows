"use client";

import { useEffect, useState, useRef } from "react";

export function useAutoHideOnScroll(threshold = 10) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY.current;

          // Hide when scrolling down past threshold, show when scrolling up
          if (Math.abs(delta) > threshold) {
            if (delta > 0 && currentScrollY > 50) {
              setHidden(true);
            } else if (delta < 0) {
              setHidden(false);
            }
            lastScrollY.current = currentScrollY;
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return { hidden };
}

