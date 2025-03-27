
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.3 }
};

export const staggerChildren = (delay = 0.05) => ({
  animate: {
    transition: {
      staggerChildren: delay
    }
  }
});

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 300, damping: 30 }
};

export const countAnimation = (start: number, end: number, duration = 1000) => {
  const frames = 60;
  const increment = (end - start) / frames;
  const frameTime = duration / frames;
  let current = start;
  const values: number[] = [];
  
  for (let i = 0; i < frames; i++) {
    current += increment;
    values.push(Math.round(current * 100) / 100);
  }
  
  return { values, frameTime };
};
