import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Star, ThumbsUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Review {
  platform: string;
  rating: number;
  totalReviews: string;
  highlights: string[];
  link: string;
}

const platformReviews: Review[] = [
  {
    platform: "Google Reviews",
    rating: 4.8,
    totalReviews: "2,500+",
    highlights: ["Easy to use", "Great value for money", "Excellent support"],
    link: "#"
  },
  {
    platform: "Trustpilot",
    rating: 4.7,
    totalReviews: "1,200+",
    highlights: ["Reliable platform", "Fast results", "Comprehensive tools"],
    link: "#"
  },
  {
    platform: "G2 Crowd",
    rating: 4.6,
    totalReviews: "800+",
    highlights: ["Best for teams", "ROI positive", "Feature-rich"],
    link: "#"
  }
];

const recentReviews = [
  {
    author: "Marketing Manager",
    company: "Tech Startup",
    date: "2 days ago",
    rating: 5,
    content: "Finally found an all-in-one AI solution that actually delivers. The content quality is impressive!"
  },
  {
    author: "Freelance Writer",
    company: "Self-employed",
    date: "1 week ago",
    rating: 5,
    content: "Increased my output by 4x. My clients are happier and I'm earning more. Highly recommend!"
  },
  {
    author: "Agency Owner",
    company: "Digital Agency",
    date: "2 weeks ago",
    rating: 5,
    content: "We replaced 4 different tools with InQuo. The cost savings alone paid for the subscription."
  }
];

export function ReviewsSection() {
  return (
    <section className="py-24 px-4 bg-muted/30" aria-labelledby="reviews-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1">Trusted & Verified</Badge>
          <h2 id="reviews-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-gradient">5,000+</span> Happy Customers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it — see what our customers say across platforms
          </p>
        </div>

        {/* Platform Ratings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {platformReviews.map((platform, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-xl transition-all border-2 hover:border-accent/30">
              <h3 className="text-xl font-bold mb-3">{platform.platform}</h3>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < Math.floor(platform.rating) 
                        ? "fill-yellow-500 text-yellow-500" 
                        : "text-muted-foreground/30"
                    }`} 
                  />
                ))}
              </div>
              <div className="text-3xl font-bold text-accent mb-1">{platform.rating}</div>
              <div className="text-sm text-muted-foreground mb-4">
                Based on {platform.totalReviews} reviews
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {platform.highlights.map((highlight, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Reviews */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Recent Reviews</h3>
          <div className="space-y-4">
            {recentReviews.map((review, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-foreground mb-4">"{review.content}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{review.author}</span>
                    <span className="text-muted-foreground text-sm"> • {review.company}</span>
                  </div>
                  <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <a href="https://www.instagram.com/inquo.site_ai" target="_blank" rel="noopener noreferrer">
                See All Reviews
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
