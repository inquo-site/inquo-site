import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, Crown, Infinity, LogOut, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again."
      });
    } else {
      navigate('/auth');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    }
  };

  const getPlanBadge = () => {
    if (!profile) return null;
    
    switch (profile.plan) {
      case 'lifetime':
        return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600"><Infinity className="w-3 h-3 mr-1" /> Lifetime Elite</Badge>;
      case 'yearly':
        return <Badge className="bg-gradient-to-r from-purple-500 to-purple-700"><Crown className="w-3 h-3 mr-1" /> Yearly Pro</Badge>;
      case 'pro':
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-700"><Crown className="w-3 h-3 mr-1" /> Pro User</Badge>;
      default:
        return <Badge variant="outline">Free Plan</Badge>;
    }
  };

  const getCreditsDisplay = () => {
    if (!profile) return null;
    
    if (profile.plan === 'lifetime') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
          <Infinity className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Unlimited</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
        <Coins className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">
          Credits: {profile.daily_credits}/{profile.max_daily_credits}
        </span>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">InQuo.site</h1>
          <Button onClick={() => navigate('/auth')} variant="default">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate('/dashboard')}>
            InQuo.site
          </h1>
          {getPlanBadge()}
        </div>

        <div className="flex items-center gap-4">
          {getCreditsDisplay()}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/pricing')}>
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
