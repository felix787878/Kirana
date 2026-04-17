"use client";

import { useEffect, useMemo, useRef } from "react";

type MorphingTextProps = {
  texts: string[];
  className?: string;
};

const MORPH_TIME = 1;
const COOLDOWN_TIME = 0.4;

export function MorphingText({ texts, className }: MorphingTextProps) {
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number>();

  const safeTexts = useMemo(
    () => (texts.length > 0 ? texts : [""]),
    [texts],
  );

  useEffect(() => {
    let textIndex = safeTexts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = COOLDOWN_TIME;

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / MORPH_TIME;
      if (fraction > 1) {
        cooldown = COOLDOWN_TIME;
        fraction = 1;
      }

      const text1 = text1Ref.current;
      const text2 = text2Ref.current;
      if (!text1 || !text2) return;

      text2.style.filter = "none";
      text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      const inverseFraction = 1 - fraction;
      text1.style.filter = "none";
      text1.style.opacity = `${Math.pow(inverseFraction, 0.4) * 100}%`;

      text1.textContent = safeTexts[textIndex % safeTexts.length];
      text2.textContent = safeTexts[(textIndex + 1) % safeTexts.length];
    };

    const doCooldown = () => {
      morph = 0;

      const text1 = text1Ref.current;
      const text2 = text2Ref.current;
      if (!text1 || !text2) return;

      text2.style.filter = "none";
      text2.style.opacity = "100%";

      text1.style.filter = "none";
      text1.style.opacity = "0%";
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex += 1;
        }
        doMorph();
      } else {
        doCooldown();
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [safeTexts]);

  return (
    <div className={`relative h-[1.2em] ${className ?? ""}`}>
      <span
        ref={text1Ref}
        className="absolute inset-x-0 top-0 w-full select-none text-center md:text-left"
      />
      <span
        ref={text2Ref}
        className="absolute inset-x-0 top-0 w-full select-none text-center md:text-left"
      />
    </div>
  );
}
