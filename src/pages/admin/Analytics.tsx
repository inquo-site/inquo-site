import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Users, DollarSign, Zap, TrendingUp, Activity } from "lucide-react";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  freeUsers: number;
  totalTools: number;
  premiumTools: number;
  totalRevenue: number;
}

const Analytics = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    totalTools: 0,
    premiumTools: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch user stats
      const { data: users, error: usersError } = await supabase
        .from('user_profiles')
        .select('plan');

      if (usersError) throw usersError;

      // Fetch tool stats
      const { data: tools, error: toolsError } = await supabase
        .from('tools')
        .select('is_premium');

      if (toolsError) throw toolsError;

      // Calculate stats
      const totalUsers = users?.length || 0;
      const premiumUsers = users?.filter(u => u.plan !== 'free').length || 0;
      const freeUsers = users?.filter(u => u.plan === 'free').length || 0;
      const totalTools = tools?.length || 0;
      const premiumTools = tools?.filter(t => t.is_premium).length || 0;

      // Calculate revenue (mock calculation - you can customize this)
      const proUsers = users?.filter(u => u.plan === 'pro').length || 0;
      const yearlyUsers = users?.filter(u => u.plan === 'yearly').length || 0;
      const lifetimeUsers = users?.filter(u => u.plan === 'lifetime').length || 0;
      
      const totalRevenue = (proUsers * 29) + (yearlyUsers * 199) + (lifetimeUsers * 399);

      setStats({
        totalUsers,
        activeUsers: totalUsers, // You can add logic to track active users
        premiumUsers,
        freeUsers,
        totalTools,
        premiumTools,
        totalRevenue,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, subtitle, color }: any) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <h3 className="text-3xl font-bold mb-1">{value}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full bg-${color}-500/10`}>
          <Icon className={`w-8 h-8 text-${color}-500`} />
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Analytics & Reports</h2>
        <p className="text-muted-foreground">Track your platform's performance and growth</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active`}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Premium Users"
          value={stats.premiumUsers}
          subtitle={`${stats.freeUsers} free users`}
          color="purple"
        />
        <StatCard
          icon={Zap}
          label="Total Tools"
          value={stats.totalTools}
          subtitle={`${stats.premiumTools} premium`}
          color="amber"
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="Estimated"
          color="green"
        />
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            User Plan Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Free Users</span>
                <span className="text-sm font-medium">{stats.freeUsers}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${(stats.freeUsers / stats.totalUsers) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Premium Users</span>
                <span className="text-sm font-medium">{stats.premiumUsers}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${(stats.premiumUsers / stats.totalUsers) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            Tool Distribution
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Free Tools</span>
                <span className="text-sm font-medium">{stats.totalTools - stats.premiumTools}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${((stats.totalTools - stats.premiumTools) / stats.totalTools) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Premium Tools</span>
                <span className="text-sm font-medium">{stats.premiumTools}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${(stats.premiumTools / stats.totalTools) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
