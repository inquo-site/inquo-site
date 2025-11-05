import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "12 Free AI Tools Access",
        "10 AI credits daily",
        "Basic AI models",
        "Community support",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$15",
      period: "/month",
      yearlyPrice: "$150",
      features: [
        "All 160 AI Tools (12 Free + 148 Premium)",
        "Unlimited AI credits",
        "GPT-4 & premium models",
        "Premium templates",
        "Priority support",
        "Export & download",
      ],
      cta: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Team",
      price: "$49",
      period: "/month",
      yearlyPrice: "$499",
      features: [
        "Everything in Pro",
        "Multi-user access",
        "Shared workspace",
        "Team collaboration",
        "Admin dashboard",
        "API access",
        "Custom integrations",
      ],
      cta: "Start Team Plan",
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you need more power
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`glass-card p-8 relative ${
                plan.popular ? "ring-2 ring-accent scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                {plan.yearlyPrice && (
                  <p className="text-sm text-muted-foreground mt-1">
                    or {plan.yearlyPrice}/year (save 17%)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to="/auth" className="block">
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                      : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Credit System</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Need more credits? Top up anytime: <strong>$5 = 500 tokens</strong>
          </p>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Affiliate Program</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Earn <strong>20% commission</strong> on every referral. Withdraw to your bank account or UPI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
