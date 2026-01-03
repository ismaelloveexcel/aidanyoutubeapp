import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "font-display font-bold rounded-xl border-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    const variantStyles = {
      primary: "bg-gradient-to-r from-[hsl(320,100%,50%)] to-[hsl(340,100%,45%)] hover:from-[hsl(320,100%,55%)] hover:to-[hsl(340,100%,50%)] text-white shadow-[0_4px_20px_rgba(255,0,128,0.35)] hover:shadow-[0_8px_30px_rgba(255,0,128,0.5)] hover:scale-105 active:scale-95 active:shadow-[0_2px_10px_rgba(255,0,128,0.25)]",
      secondary: "bg-gradient-to-r from-[hsl(180,100%,45%)] to-[hsl(200,100%,45%)] hover:from-[hsl(180,100%,50%)] hover:to-[hsl(200,100%,50%)] text-white shadow-[0_4px_20px_rgba(0,255,255,0.3)] hover:shadow-[0_8px_30px_rgba(0,255,255,0.4)] hover:scale-105 active:scale-95",
      accent: "bg-gradient-to-r from-[hsl(50,100%,50%)] to-[hsl(40,100%,50%)] hover:from-[hsl(50,100%,55%)] hover:to-[hsl(40,100%,55%)] text-gray-900 shadow-[0_4px_20px_rgba(255,200,0,0.35)] hover:shadow-[0_8px_30px_rgba(255,200,0,0.5)] hover:scale-105 active:scale-95",
      ghost: "bg-transparent border-2 border-[hsl(320,60%,40%)] hover:bg-[hsl(320,50%,20%)] hover:border-[hsl(320,100%,50%)] text-gray-300 hover:text-white shadow-none hover:shadow-[0_0_20px_rgba(255,0,128,0.2)]",
    };
    const sizeStyles = {
      sm: "px-4 py-2 text-sm",
      md: "px-7 py-3.5 text-base",
      lg: "px-10 py-5 text-lg",
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
