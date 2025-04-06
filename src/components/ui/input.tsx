
import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    // Create a wrapper ref for the input container
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    
    // Handle the ripple effect when input is clicked
    const handleInputClick = (e: React.MouseEvent) => {
      if (!wrapperRef.current) return;
      
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = wrapperRef.current.getBoundingClientRect();
      
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.className = 'absolute rounded-full bg-white/10 pointer-events-none';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 600ms ease-out forwards';
      
      wrapperRef.current.appendChild(ripple);
      
      // Clean up ripple after animation
      setTimeout(() => {
        if (ripple && ripple.parentNode === wrapperRef.current) {
          wrapperRef.current?.removeChild(ripple);
        }
      }, 700);
    };

    return (
      <div 
        ref={wrapperRef} 
        className={cn(
          "relative overflow-hidden",
          icon && "flex items-center"
        )}
        onClick={handleInputClick}
      >
        {icon && (
          <div className="absolute left-3 z-10 text-muted-foreground group-hover:text-primary transition-colors icon-bounce">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 md:text-sm",
            icon && "pl-10",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {/* Removed the inline style jsx element and relying on App.css for the animation */}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
