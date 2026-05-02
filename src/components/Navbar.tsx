import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Hexagon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { NSCta } from "@/components/ns/NSCta";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Tools", path: "/dashboard" },
    { name: "Agents", path: "/agents" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "py-3" : "py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex items-center justify-between transition-all duration-500 px-4 sm:px-5 h-14",
          isScrolled ? "ns-pill" : ""
        )}>
          {/* Logo — hexagon mark */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-md border border-primary/40 group-hover:border-primary transition-colors">
              <Hexagon className="w-5 h-5 text-primary" strokeWidth={1.5} />
            </span>
            <span className="font-display text-lg tracking-tight text-foreground">InQuo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, idx) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "relative px-3 py-2 text-sm tracking-tight transition-colors flex items-center gap-3",
                  isActive(link.path) ? "text-primary" : "text-foreground/80 hover:text-foreground"
                )}
              >
                <span className="ns-link">{link.name}</span>
                {idx < navLinks.length - 1 && (
                  <span className="text-primary/50 select-none -mr-2 inline-block transform -skew-x-12">/</span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center">
            {user ? (
              <NSCta to="/dashboard" size="sm">Dashboard</NSCta>
            ) : (
              <NSCta to="/auth" size="sm">Start Free</NSCta>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mx-4 mt-3 rounded-2xl border border-border bg-card/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-base transition-colors",
                  isActive(link.path) ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              {user ? (
                <NSCta to="/dashboard" size="sm" className="w-full justify-center">Dashboard</NSCta>
              ) : (
                <NSCta to="/auth" size="sm" className="w-full justify-center">Start Free</NSCta>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
