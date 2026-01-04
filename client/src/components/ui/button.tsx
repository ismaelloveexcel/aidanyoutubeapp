import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "font-display font-bold rounded-xl border-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles = {
      primary: "bg-gradient-to-r from-[hsl(210,100%,50%)] to-[hsl(200,100%,45%)] hover:from-[hsl(210,100%,55%)] hover:to-[hsl(200,100%,50%)] text-white shadow-[0_4px_20px_rgba(0,120,255,0.35)] hover:shadow-[0_8px_30px_rgba(0,150,255,0.5)] active:shadow-[0_2px_10px_rgba(0,120,255,0.25)]",
      secondary: "bg-gradient-to-r from-[hsl(180,100%,45%)] to-[hsl(170,100%,40%)] hover:from-[hsl(180,100%,50%)] hover:to-[hsl(170,100%,45%)] text-white shadow-[0_4px_20px_rgba(0,200,200,0.3)] hover:shadow-[0_8px_30px_rgba(0,200,200,0.4)]",
      accent: "bg-gradient-to-r from-[hsl(45,100%,50%)] to-[hsl(35,100%,50%)] hover:from-[hsl(45,100%,55%)] hover:to-[hsl(35,100%,55%)] text-gray-900 shadow-[0_4px_20px_rgba(255,180,0,0.35)] hover:shadow-[0_8px_30px_rgba(255,180,0,0.5)]",
      ghost: "bg-transparent border-2 border-[hsl(210,60%,40%)] hover:bg-[hsl(210,50%,18%)] hover:border-[hsl(210,100%,50%)] text-gray-300 hover:text-white shadow-none hover:shadow-[0_0_20px_rgba(0,150,255,0.2)]",
      outline: "bg-transparent border-2 border-[#2BD4FF]/40 hover:bg-[#2BD4FF]/10 hover:border-[#2BD4FF] text-[#2BD4FF] shadow-none hover:shadow-[0_0_15px_rgba(43,212,255,0.2)]",
    };
    const sizeStyles = {
      sm: "px-4 py-2 text-sm min-h-8",
      md: "px-7 py-3.5 text-base min-h-9",
      lg: "px-10 py-5 text-lg min-h-10",
      icon: "p-2.5 min-h-9 min-w-9 flex items-center justify-center",
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
