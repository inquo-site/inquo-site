import { useEffect, useRef, useState, ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number; // ms
  className?: string;
  as?: ElementType;
  once?: boolean;
  /** when true, animate immediately on mount (no IntersectionObserver) */
  immediate?: boolean;
}

/** Reveal-on-scroll: fades + rises + un-blurs when entering the viewport. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  once = true,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once, immediate]);

  return (
    <Tag
      ref={ref as never}
      className={cn(
        "transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible
          ? "opacity-100 translate-y-0 blur-0"
          : "opacity-0 translate-y-6 [filter:blur(6px)]",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
