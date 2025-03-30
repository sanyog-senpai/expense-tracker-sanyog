
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
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
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

export const listItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3 }
};

export const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)" }
};

export const pulse = {
  initial: { opacity: 0.7 },
  animate: { 
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1.5
    }
  }
};

export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
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

// Advanced staggered animations
export const staggeredContainer = (delayChildren = 0.1, staggerTime = 0.1) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren: staggerTime
    }
  }
});

export const fadeInItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    }
  }
};

// Special effect for hero elements
export const heroAnimation = {
  initial: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Subtle floating animation
export const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
