import { cn } from "../../lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: React.ReactNode;
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}: ButtonColorfulProps) {
    return (
        <button
            className={cn(
                "relative h-10 px-4 rounded-lg overflow-hidden",
                "bg-black/40 backdrop-blur-sm",
                "border border-white/10",
                "transition-all duration-200",
                "hover:bg-black/60 hover:border-white/20",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-primary-500/20 via-primary-400/20 to-primary-600/20",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                {typeof label === 'string' ? (
                    <>
                        <span className="text-white/90 group-hover:text-white transition-colors">{label}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white/90" />
                    </>
                ) : (
                    label
                )}
            </div>
        </button>
    );
}