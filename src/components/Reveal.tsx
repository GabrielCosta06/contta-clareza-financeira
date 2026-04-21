import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "up" | "fade" | "scale" | "left" | "right";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the reveal animation starts. */
  delay?: number;
  /** Animation variant. */
  variant?: Variant;
  /** Render as a different element. Defaults to div. */
  as?: keyof JSX.IntrinsicElements;
  /** IntersectionObserver rootMargin. */
  rootMargin?: string;
  /** Reveal only once (default true). */
  once?: boolean;
}

/**
 * Scroll-triggered reveal. Smooth, premium, respects prefers-reduced-motion.
 */
export const Reveal = ({
  children,
  className,
  delay = 0,
  variant = "up",
  as: Tag = "div",
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            setShown(false);
          }
        }
      },
      { rootMargin, threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin]);

  const initial: Record<Variant, string> = {
    up: "opacity-0 translate-y-5",
    fade: "opacity-0",
    scale: "opacity-0 scale-[0.97]",
    left: "opacity-0 -translate-x-5",
    right: "opacity-0 translate-x-5",
  };
  const final = "opacity-100 translate-y-0 translate-x-0 scale-100";

  const style: CSSProperties = {
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDuration: "700ms",
    transitionProperty: "opacity, transform",
    willChange: "opacity, transform",
  };

  // @ts-expect-error – dynamic tag
  return (
    // @ts-expect-error – dynamic tag
    <Tag
      ref={ref as never}
      style={style}
      className={cn(shown ? final : initial[variant], className)}
    >
      {children}
    </Tag>
  );
};
