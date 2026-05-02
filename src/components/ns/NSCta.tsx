import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
}

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-[15px]",
  lg: "px-7 py-4 text-base",
};

const arrowSize: Record<Size, string> = {
  sm: "w-6 h-6",
  md: "w-7 h-7",
  lg: "w-9 h-9",
};

const variantClasses = (variant: Variant) => {
  switch (variant) {
    case "ghost":
      return "bg-transparent text-foreground hover:bg-foreground/5 border border-transparent";
    case "outline":
      return "bg-transparent text-foreground border border-border hover:border-primary/60 hover:bg-foreground/5";
    case "solid":
    default:
      return "bg-foreground text-background hover:bg-primary";
  }
};

const baseClasses =
  "group relative inline-flex items-center gap-3 rounded-full font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_hsl(36_45%_70%_/_0.45)]";

interface LinkProps extends BaseProps {
  to: string;
  href?: never;
  onClick?: () => void;
}
interface AnchorProps extends BaseProps {
  href: string;
  to?: never;
  onClick?: () => void;
}
interface ButtonProps extends BaseProps {
  to?: never;
  href?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

type Props = LinkProps | AnchorProps | ButtonProps;

const Inner = ({ children, size = "md", icon }: { children: ReactNode; size?: Size; icon?: ReactNode }) => (
  <>
    <span className="pl-1">{children}</span>
    <span
      className={cn(
        "ns-arrow inline-flex items-center justify-center rounded-full bg-background/90 text-primary transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-0",
        arrowSize[size]
      )}
    >
      {icon ?? <ArrowUpRight className="w-4 h-4" strokeWidth={2} />}
    </span>
  </>
);

export const NSCta = forwardRef<HTMLElement, Props>((props, ref) => {
  const { children, variant = "solid", size = "md", className, icon, ...rest } = props as BaseProps & Record<string, unknown>;
  const cls = cn(baseClasses, sizeClasses[size], variantClasses(variant), className);

  if ("to" in props && props.to) {
    return (
      <Link ref={ref as never} to={props.to} onClick={props.onClick} className={cls}>
        <Inner size={size} icon={icon}>{children}</Inner>
      </Link>
    );
  }
  if ("href" in props && props.href) {
    return (
      <a ref={ref as never} href={props.href} onClick={props.onClick} className={cls}>
        <Inner size={size} icon={icon}>{children}</Inner>
      </a>
    );
  }
  const btn = props as ButtonProps;
  return (
    <button
      ref={ref as never}
      type={btn.type ?? "button"}
      onClick={btn.onClick}
      disabled={btn.disabled}
      className={cn(cls, btn.disabled && "opacity-50 cursor-not-allowed hover:translate-y-0")}
    >
      <Inner size={size} icon={icon}>{children}</Inner>
    </button>
  );
});
NSCta.displayName = "NSCta";
