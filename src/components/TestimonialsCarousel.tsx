import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  industry: string;
  result: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rahul Sharma",
    role: "CEO",
    company: "TechStartup India",
    avatar: "RS",
    content: "InQuo.site transformed our content workflow completely. We now produce 5x more content with half the team. The ROI has been incredible - we saved over ₹2,00,000 in the first quarter alone.",
    rating: 5,
    industry: "Technology",
    result: "5x content output"
  },
  {
    id: "2",
    name: "Priya Patel",
    role: "Marketing Head",
    company: "E-commerce Co.",
    avatar: "PP",
    content: "The AI tools for ad copy and social media posts have cut our campaign creation time from days to just hours. Our conversion rates improved by 40% with AI-optimized content.",
    rating: 5,
    industry: "E-commerce",
    result: "40% higher conversions"
  },
  {
    id: "3",
    name: "Amit Verma",
    role: "Freelance Developer",
    company: "Self-employed",
    avatar: "AV",
    content: "Code Generator and Bug Fixer are absolute game changers. I complete projects 3x faster now and my clients are amazed at the turnaround time. Worth every rupee!",
    rating: 5,
    industry: "Freelancing",
    result: "3x faster delivery"
  },
  {
    id: "4",
    name: "Sneha Gupta",
    role: "Content Manager",
    company: "Digital Agency",
    avatar: "SG",
    content: "Managing content for 20+ clients was overwhelming until we discovered InQuo. Now our small team handles everything effortlessly. The blog generator alone saves us 15 hours weekly.",
    rating: 5,
    industry: "Digital Marketing",
    result: "15 hrs/week saved"
  },
  {
    id: "5",
    name: "Vikram Singh",
    role: "Founder",
    company: "SaaS Startup",
    avatar: "VS",
    content: "From product descriptions to technical documentation, InQuo handles it all. We've reduced our content costs by 60% while maintaining excellent quality. Highly recommended!",
    rating: 5,
    industry: "SaaS",
    result: "60% cost reduction"
  },
  {
    id: "6",
    name: "Ananya Reddy",
    role: "Creative Director",
    company: "Design Studio",
    avatar: "AR",
    content: "The Image AI tools are phenomenal. We create stunning visuals in minutes that would take hours in Photoshop. Our clients can't believe the speed and quality.",
    rating: 5,
    industry: "Design",
    result: "10x faster designs"
  },
  {
    id: "7",
    name: "Karan Mehta",
    role: "SEO Specialist",
    company: "Growth Agency",
    avatar: "KM",
    content: "InQuo's SEO content tools helped us rank 50+ keywords on page 1 for our clients. The meta description and blog optimization features are incredibly powerful.",
    rating: 5,
    industry: "SEO",
    result: "50+ #1 rankings"
  },
  {
    id: "8",
    name: "Neha Kapoor",
    role: "Operations Lead",
    company: "Retail Chain",
    avatar: "NK",
    content: "We use InQuo for everything from customer emails to training materials. It's become indispensable for our team of 50+. The consistency in our communications improved dramatically.",
    rating: 5,
    industry: "Retail",
    result: "Team of 50+ users"
  }
];

export function TestimonialsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: "start",
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-scroll
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-24 px-4 bg-muted/30" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1">Customer Stories</Badge>
          <h2 id="testimonials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Real Results from <span className="text-gradient">Real Businesses</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join 10,000+ businesses across India already transforming their workflow with InQuo.site
          </p>
        </div>

        <div className="relative">
          {/* Carousel Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex rounded-full shadow-lg bg-background"
            onClick={scrollPrev}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex rounded-full shadow-lg bg-background"
            onClick={scrollNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="flex-none w-full md:w-1/2 lg:w-1/3"
                >
                  <Card className="p-6 h-full border-2 hover:border-accent/30 hover:shadow-xl transition-all duration-300 flex flex-col">
                    {/* Quote Icon */}
                    <Quote className="w-8 h-8 text-accent/30 mb-4" />
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-foreground mb-4 flex-grow text-sm leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Result Badge */}
                    <Badge variant="secondary" className="w-fit mb-4 text-xs">
                      📈 {testimonial.result}
                    </Badge>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{testimonial.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex 
                    ? "bg-accent w-6" 
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
