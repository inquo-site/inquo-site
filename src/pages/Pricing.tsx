import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, Zap, Building2, Star, ArrowRight, Users, Shield, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: "Free",
      subtitle: "Starter",
      description: "Best for: Students, beginners, personal users",
      price: "₹0",
      period: "forever",
      icon: Sparkles,
      features: [
        { text: "15 essential AI tools", included: true },
        { text: "5,000 AI words/month", included: true },
        { text: "10 image generations/month", included: true },
        { text: "Basic templates", included: true },
        { text: "Limited support", included: true },
        { text: "Commercial use", included: false },
        { text: "Watermark-free images", included: false },
        { text: "API access", included: false },
      ],
      limitations: ["No commercial use", "Watermarked images", "Slow processing during peak hours"],
      cta: "Start Free",
      popular: false,
      highlight: false,
    },
    {
      name: "Pro",
      subtitle: "Creator",
      description: "Best for: Freelancers, YouTubers, content creators",
      monthlyPrice: "₹499",
      yearlyPrice: "₹416",
      yearlyTotal: "₹4,999/year",
      savings: "Save ₹989/year",
      icon: Zap,
      features: [
        { text: "160+ AI tools unlocked", included: true },
        { text: "1,00,000 AI words/month", included: true },
        { text: "100 image generations/month", included: true },
        { text: "Blog generator, SEO tools", included: true },
        { text: "Fast processing", included: true },
        { text: "All templates access", included: true },
        { text: "Priority support", included: true },
        { text: "API access", included: false },
      ],
      cta: "Start Free Trial",
      popular: true,
      highlight: true,
    },
    {
      name: "Business",
      subtitle: "B2B",
      description: "Best for: Agencies, startups, small businesses",
      monthlyPrice: "₹1,999",
      yearlyPrice: "₹1,666",
      yearlyTotal: "₹19,999/year",
      savings: "Save ₹3,989/year",
      icon: Building2,
      features: [
        { text: "Unlimited AI tools (all 160+)", included: true },
        { text: "Unlimited AI words/month", included: true },
        { text: "Unlimited images/month", included: true },
        { text: "Multi-user/team access (5 members)", included: true },
        { text: "Custom templates", included: true },
        { text: "Dedicated dashboard", included: true },
        { text: "Advanced SEO toolkit", included: true },
        { text: "API access for automation", included: true },
        { text: "ChatGPT-like AI bot for website", included: true },
        { text: "Email + WhatsApp support", included: true },
      ],
      cta: "Start Free Trial",
      popular: false,
      highlight: false,
    },
  ];

  const comparisonFeatures = [
    { name: "AI Tools Available", free: "15", pro: "160+", business: "160+ (Unlimited)" },
    { name: "AI Words/Month", free: "5,000", pro: "1,00,000", business: "Unlimited" },
    { name: "Image Generations", free: "10/month", pro: "100/month", business: "Unlimited" },
    { name: "Team Members", free: "1", pro: "1", business: "5" },
    { name: "API Access", free: "—", pro: "—", business: "✓" },
    { name: "Custom Templates", free: "—", pro: "Basic", business: "Custom" },
    { name: "Support", free: "Limited", pro: "Priority Email", business: "Email + WhatsApp" },
    { name: "Commercial Use", free: "—", pro: "✓", business: "✓" },
  ];

  const faqs = [
    {
      q: "Is there really no hidden charges?",
      a: "Absolutely! What you see is what you pay. No surprise fees, no hidden costs. Cancel anytime."
    },
    {
      q: "Can I try before I buy?",
      a: "Yes! We offer a 7-day free trial for Pro & Business plans. No credit card required to start."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit/debit cards, UPI, Net Banking, and PayPal for international users."
    },
    {
      q: "Can I switch plans anytime?",
      a: "Yes! You can upgrade or downgrade at any time. Changes take effect immediately."
    },
    {
      q: "Do you offer refunds?",
      a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with our service."
    },
    {
      q: "What happens when I hit my usage limit?",
      a: "You'll receive a notification. You can either upgrade your plan or wait for the next billing cycle."
    },
  ];

  const highlights = [
    { icon: BadgeCheck, text: "No hidden charges" },
    { icon: Shield, text: "7-day free trial" },
    { icon: Star, text: "Cancel anytime" },
    { icon: Zap, text: "Fast global servers" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-1">Pricing</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              No hidden charges. Start free, upgrade when you need more power. Cancel anytime.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {highlights.map((item, index) => (
                <div key={index} className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                  <item.icon className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 glass-card rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  !isYearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  isYearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
                  Save 17%
                </Badge>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 relative transition-all duration-300 hover:shadow-xl ${
                  plan.highlight 
                    ? "border-2 border-accent scale-105 shadow-lg bg-gradient-to-b from-accent/5 to-transparent" 
                    : "border-2 hover:border-accent/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground px-4 py-1 font-semibold shadow-lg">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.highlight ? "bg-accent" : "bg-muted"
                  }`}>
                    <plan.icon className={`w-7 h-7 ${plan.highlight ? "text-accent-foreground" : "text-foreground"}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-accent font-medium mb-2">{plan.subtitle}</p>
                  <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                  
                  <div className="mb-2">
                    {plan.price ? (
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-5xl font-bold">
                            {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        {isYearly && plan.yearlyTotal && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Billed as {plan.yearlyTotal}
                          </p>
                        )}
                        {isYearly && plan.savings && (
                          <p className="text-sm text-accent font-medium mt-2">
                            {plan.savings}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={feature.included ? "text-foreground text-sm" : "text-muted-foreground/50 text-sm"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="mb-6 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Limitations:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {plan.limitations.map((limit, i) => (
                        <li key={i}>• {limit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link to="/dashboard" className="block">
                  <Button
                    className={`w-full h-12 text-lg font-semibold ${
                      plan.highlight
                        ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                        : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                
                {plan.highlight && (
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    7-day free trial included
                  </p>
                )}
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold">Free</th>
                      <th className="text-center p-4 font-semibold bg-accent/10">Pro</th>
                      <th className="text-center p-4 font-semibold">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <tr key={index} className="border-b last:border-0">
                        <td className="p-4 font-medium">{feature.name}</td>
                        <td className="p-4 text-center text-muted-foreground">{feature.free}</td>
                        <td className="p-4 text-center bg-accent/5 font-medium">{feature.pro}</td>
                        <td className="p-4 text-center text-muted-foreground">{feature.business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Referral Program */}
          <div className="mb-20">
            <Card className="p-8 text-center bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/20">
              <Users className="w-12 h-12 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold mb-4">Affiliate Program — Earn 20% Lifetime</h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Share InQuo.Site with your network and earn 20% lifetime commission on every referral. 
                No limits, no caps — passive income made easy!
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link to="/auth">
                  Join Affiliate Program
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </Card>
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6">
                  <h4 className="font-semibold text-lg mb-2">{faq.q}</h4>
                  <p className="text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Card className="p-12 bg-gradient-to-br from-primary to-accent text-primary-foreground inline-block max-w-2xl">
              <h3 className="text-3xl font-bold mb-4">Ready to Automate Your Business?</h3>
              <p className="text-lg mb-8 opacity-90">
                Join 10,000+ businesses already saving time with InQuo.Site
              </p>
              <Button asChild size="lg" variant="secondary" className="text-lg px-10 h-14">
                <Link to="/dashboard">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <p className="mt-4 text-sm opacity-75">
                ✓ 7-day free trial • ✓ No credit card required • ✓ Cancel anytime
              </p>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;