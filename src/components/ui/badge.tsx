
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-md",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary/20 text-primary-foreground hover:bg-primary/30 border-primary/30",
        secondary:
          "border-transparent bg-secondary/20 text-secondary-foreground hover:bg-secondary/30 border-secondary/30",
        destructive:
          "border-transparent bg-destructive/20 text-destructive-foreground hover:bg-destructive/30 border-destructive/30",
        outline: "text-foreground border-white/20 bg-white/5",
        expense: "border-red-400/30 bg-red-500/20 text-red-300 hover:bg-red-500/30",
        income: "border-green-400/30 bg-green-500/20 text-green-300 hover:bg-green-500/30",
        savings: "border-blue-400/30 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30",
        neon: "border-neon-purple/30 bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
