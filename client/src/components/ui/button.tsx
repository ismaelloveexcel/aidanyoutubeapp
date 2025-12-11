import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "font-display font-bold rounded-lg border-[3px] border-black/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles = {
      primary: "bg-[hsl(320,100%,50%)] hover:bg-[hsl(320,100%,60%)] text-white shadow-[4px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)] active:shadow-[2px_2px_0_rgba(0,0,0,0.2)]",
      secondary: "bg-[hsl(180,100%,50%)] hover:bg-[hsl(180,100%,60%)] text-white shadow-[4px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)] active:shadow-[2px_2px_0_rgba(0,0,0,0.2)]",
      accent: "bg-[hsl(50,100%,50%)] hover:bg-[hsl(50,100%,60%)] text-black shadow-[4px_4px_0_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0_rgba(0,0,0,0.2)] active:shadow-[2px_2px_0_rgba(0,0,0,0.2)]",
      ghost: "bg-transparent border-0 hover:bg-white/10 shadow-none",
    };
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };
    return (
      <button
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
