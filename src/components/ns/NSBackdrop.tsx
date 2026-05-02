import { cn } from "@/lib/utils";

/** Cinematic backdrop: pure black + warm gold radial glows + grain + faint grid. */
export function NSBackdrop({ className, intensity = "default" }: { className?: string; intensity?: "subtle" | "default" | "hero" }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {/* Base radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(36_45%_70%/0.12),transparent_60%),radial-gradient(ellipse_60%_50%_at_50%_110%,hsl(36_45%_70%/0.08),transparent_60%)]" />

      {/* Floating gold orbs */}
      <div className="absolute top-1/4 -left-24 w-[28rem] h-[28rem] rounded-full bg-[hsl(36_60%_70%/0.10)] blur-[120px] ns-glow-pulse" />
      <div className="absolute bottom-0 -right-24 w-[24rem] h-[24rem] rounded-full bg-[hsl(36_50%_60%/0.08)] blur-[120px] ns-glow-pulse" style={{ animationDelay: "2.5s" }} />

      {/* Faint grid */}
      {intensity !== "subtle" && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(36 30% 70% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(36 30% 70% / 0.5) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, #000 40%, transparent 80%)",
          }}
        />
      )}

      {/* Grain — using inline SVG */}
      <div
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Top + bottom fade to black */}
      {intensity === "hero" && (
        <>
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </>
      )}
    </div>
  );
}
