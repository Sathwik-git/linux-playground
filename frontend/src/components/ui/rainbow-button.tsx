import React from "react";
import { cn } from "../../lib/utils";

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <button
      className={cn(
        "group relative inline-flex h-10 animate-rainbow cursor-pointer items-center justify-center rounded-lg px-6 py-2",
        "bg-black/40 backdrop-blur-sm",
        "border border-white/10",
        "font-medium text-white/90 transition-colors",
        "hover:bg-black/60 hover:border-white/20 hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {/* Rainbow gradient border effect */}
      <div
        className="absolute inset-0 -z-10 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "linear-gradient(45deg, rgba(56, 189, 248, 0.2), rgba(236, 72, 153, 0.2))",
          filter: "blur(8px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center space-x-2">
        {children}
      </div>
    </button>
  );
}