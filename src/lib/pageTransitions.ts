
import { Variants } from "framer-motion";

// Page transition variants
export const pageVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

// Card transition variants
export const cardVariants: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  hover: {
    y: -5,
    scale: 1.02,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }
  },
  tap: { 
    scale: 0.98, 
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)" 
  }
};

// List item variants
export const itemVariants: Variants = {
  initial: { 
    opacity: 0, 
    y: 15,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { 
      duration: 0.2 
    } 
  }
};

// Fading animations
export const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4
    }
  }
};

// Pop-in animation
export const popIn = {
  initial: { 
    opacity: 0, 
    scale: 0.8 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260, 
      damping: 20
    }
  }
};

// Float animation for decorative elements
export const floatAnimation = {
  initial: { 
    y: 0 
  },
  animate: { 
    y: [-8, 8, -8],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Pulse animation
export const pulseAnimation = {
  initial: {
    opacity: 0.7,
    scale: 1
  },
  animate: {
    opacity: [0.7, 1, 0.7],
    scale: [1, 1.03, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Shimmer effect
export const shimmerAnimation = {
  initial: {
    backgroundPosition: "-200% 0"
  },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

// Button hover animation
export const buttonHover = {
  initial: {},
  hover: {
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95
  }
};

// Container variants with staggered children
export const containerVariants = {
  initial: {
    opacity: 0
  },
  animate: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      duration: 0.3
    }
  }
};
