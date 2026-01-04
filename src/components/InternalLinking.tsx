import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileText, Image, Code, TrendingUp, BookOpen, HelpCircle } from "lucide-react";

interface QuickLink {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const quickLinks: QuickLink[] = [
  {
    title: "AI Writing Tools",
    description: "Blog posts, emails, social media content",
    href: "/dashboard?category=writing",
    icon: FileText,
    badge: "50+ tools"
  },
  {
    title: "AI Image Tools",
    description: "Create and edit images with AI",
    href: "/dashboard?category=design",
    icon: Image,
    badge: "35+ tools"
  },
  {
    title: "AI Coding Tools",
    description: "Generate code, fix bugs, optimize",
    href: "/dashboard?category=coding",
    icon: Code,
    badge: "40+ tools"
  },
  {
    title: "Marketing AI",
    description: "Ads, SEO, social media automation",
    href: "/dashboard?category=marketing",
    icon: TrendingUp,
    badge: "35+ tools"
  },
  {
    title: "Blog & Resources",
    description: "Tips, tutorials, and AI insights",
    href: "/blog",
    icon: BookOpen
  },
  {
    title: "Pricing Plans",
    description: "Find the right plan for your needs",
    href: "/pricing",
    icon: HelpCircle
  }
];

export function InternalLinking() {
  return (
    <section className="py-16 px-4 border-t border-border" aria-labelledby="explore-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 id="explore-heading" className="text-2xl sm:text-3xl font-bold mb-2">
            Explore InQuo.site
          </h2>
          <p className="text-muted-foreground">
            Quick access to all our AI tools and resources
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <Link key={index} to={link.href} className="group">
              <Card className="p-5 h-full hover:shadow-lg hover:border-accent/30 transition-all border-2 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <link.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold group-hover:text-accent transition-colors">
                      {link.title}
                    </h3>
                    {link.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {link.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Card>
            </Link>
          ))}
        </div>

        {/* Breadcrumb-style navigation */}
        <nav className="mt-10 pt-6 border-t border-border" aria-label="Site navigation">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-accent transition-colors">Home</Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/dashboard" className="text-muted-foreground hover:text-accent transition-colors">All Tools</Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/pricing" className="text-muted-foreground hover:text-accent transition-colors">Pricing</Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/blog" className="text-muted-foreground hover:text-accent transition-colors">Blog</Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/about" className="text-muted-foreground hover:text-accent transition-colors">About</Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/contact" className="text-muted-foreground hover:text-accent transition-colors">Contact</Link>
            <span className="text-muted-foreground/50">•</span>
            <Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors">Privacy</Link>
          </div>
        </nav>
      </div>
    </section>
  );
}
