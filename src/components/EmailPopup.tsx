import { useState } from "react";
import { X, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface EmailPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailPopup = ({ isOpen, onClose }: EmailPopupProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate subscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Welcome! 🎉",
      description: "You've been subscribed. Check your email for exclusive offers!",
    });
    
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-card border-2 border-border rounded-2xl shadow-2xl p-8 animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <Gift className="w-8 h-8 text-accent" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Get 20% Off Your First Month!</h3>
          <p className="text-muted-foreground">
            Subscribe to our newsletter and unlock exclusive discounts + AI tips
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12"
            required
          />
          <Button 
            type="submit" 
            className="w-full h-12 bg-accent hover:bg-accent/90"
            disabled={loading}
          >
            {loading ? "Subscribing..." : (
              <>
                Claim My Discount
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};