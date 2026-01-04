import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Clock, DollarSign, Zap, TrendingUp, 
  Shield, Users, CheckCircle, ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const valueProps = [
  {
    icon: Clock,
    title: "Save 20+ Hours Weekly",
    description: "Automate repetitive content, code, and design tasks. Focus on what matters most.",
    stat: "20+ hrs",
    statLabel: "saved per week"
  },
  {
    icon: DollarSign,
    title: "Cut Costs by 60%",
    description: "Replace expensive tools and services with one affordable AI platform.",
    stat: "60%",
    statLabel: "cost reduction"
  },
  {
    icon: Zap,
    title: "10x Faster Output",
    description: "Generate content in seconds that would take hours manually.",
    stat: "10x",
    statLabel: "faster results"
  },
  {
    icon: TrendingUp,
    title: "Scale Without Limits",
    description: "Handle 5x more work without hiring additional team members.",
    stat: "5x",
    statLabel: "productivity boost"
  }
];

const comparisonData = [
  { feature: "AI Content Generation", inquo: true, others: "Limited" },
  { feature: "Image Creation & Editing", inquo: true, others: "Extra cost" },
  { feature: "Code Generation", inquo: true, others: "Not included" },
  { feature: "160+ Tools in One Platform", inquo: true, others: "Separate subscriptions" },
  { feature: "No Hidden Charges", inquo: true, others: "Variable pricing" },
  { feature: "Indian Payment Methods", inquo: true, others: "Limited" },
];

export function ValueProposition() {
  return (
    <section className="py-24 px-4" aria-labelledby="value-prop-heading">
      <div className="max-w-7xl mx-auto">
        {/* Main Value Props */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1">Why InQuo.site</Badge>
          <h2 id="value-prop-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            The <span className="text-gradient">Visible Value</span> You Get
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real, measurable results that impact your bottom line from day one
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {valueProps.map((prop, index) => (
            <Card 
              key={index}
              className="p-6 text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/30 group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <prop.icon className="w-8 h-8 text-accent" />
              </div>
              <div className="text-4xl font-bold text-accent mb-1">{prop.stat}</div>
              <div className="text-sm text-muted-foreground mb-4">{prop.statLabel}</div>
              <h3 className="text-lg font-bold mb-2">{prop.title}</h3>
              <p className="text-sm text-muted-foreground">{prop.description}</p>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              InQuo.site vs Other Tools
            </h3>
            <p className="text-muted-foreground">
              See why businesses choose us over fragmented solutions
            </p>
          </div>

          <Card className="overflow-hidden border-2">
            <div className="grid grid-cols-3 bg-muted/50 p-4 font-bold text-sm">
              <div>Feature</div>
              <div className="text-center text-accent">InQuo.site</div>
              <div className="text-center text-muted-foreground">Others</div>
            </div>
            {comparisonData.map((row, index) => (
              <div 
                key={index}
                className={`grid grid-cols-3 p-4 text-sm ${
                  index % 2 === 0 ? "bg-background" : "bg-muted/20"
                }`}
              >
                <div className="font-medium">{row.feature}</div>
                <div className="text-center">
                  {row.inquo === true ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                  ) : (
                    row.inquo
                  )}
                </div>
                <div className="text-center text-muted-foreground text-xs">
                  {row.others}
                </div>
              </div>
            ))}
          </Card>

          <div className="text-center mt-10">
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link to="/pricing">
                See All Features & Pricing
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
