import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Users, DollarSign, Zap, TrendingUp, Activity, Eye, MousePointer } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface Stats {
  totalUsers: number;
  activeUsers: number;
  premiumUsers: number;
  freeUsers: number;
  totalTools: number;
  premiumTools: number;
  freeTools: number;
  totalRevenue: number;
  conversionRate: number;
}

interface ToolUsage {
  name: string;
  usage: number;
  category: string;
}

interface UserGrowth {
  date: string;
  users: number;
  premium: number;
}

const Analytics = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    freeUsers: 0,
    totalTools: 0,
    premiumTools: 0,
    freeTools: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userGrowth, setUserGrowth] = useState<UserGrowth[]>([]);
  const [popularTools, setPopularTools] = useState<ToolUsage[]>([]);
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
        .select('*');

      if (toolsError) throw toolsError;

      // Calculate stats
      const totalUsers = users?.length || 0;
      const premiumUsers = users?.filter(u => u.plan !== 'free').length || 0;
      const freeUsers = users?.filter(u => u.plan === 'free').length || 0;
      const totalTools = tools?.length || 0;
      const premiumTools = tools?.filter(t => t.is_premium).length || 0;
      const freeTools = tools?.filter(t => !t.is_premium).length || 0;

      // Calculate revenue
      const proUsers = users?.filter(u => u.plan === 'pro').length || 0;
      const yearlyUsers = users?.filter(u => u.plan === 'yearly').length || 0;
      const lifetimeUsers = users?.filter(u => u.plan === 'lifetime').length || 0;
      
      const totalRevenue = (proUsers * 29) + (yearlyUsers * 199) + (lifetimeUsers * 399);
      const conversionRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;

      setStats({
        totalUsers,
        activeUsers: totalUsers,
        premiumUsers,
        freeUsers,
        totalTools,
        premiumTools,
        freeTools,
        totalRevenue,
        conversionRate,
      });

      // Generate mock user growth data (last 7 days)
      const growthData: UserGrowth[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        growthData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          users: Math.floor(totalUsers * (0.7 + (Math.random() * 0.3))),
          premium: Math.floor(premiumUsers * (0.7 + (Math.random() * 0.3))),
        });
      }
      setUserGrowth(growthData);

      // Get popular tools (mock data - you can track actual usage)
      const toolUsage: ToolUsage[] = tools?.slice(0, 5).map((tool, index) => ({
        name: tool.name,
        usage: Math.floor(Math.random() * 1000) + 100,
        category: tool.category,
      })) || [];
      setPopularTools(toolUsage.sort((a, b) => b.usage - a.usage));
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
          subtitle={`${stats.conversionRate.toFixed(1)}% conversion rate`}
          color="purple"
        />
        <StatCard
          icon={Zap}
          label="Total Tools"
          value={stats.totalTools}
          subtitle={`${stats.freeTools} free, ${stats.premiumTools} premium`}
          color="amber"
        />
        <StatCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          subtitle="Estimated MRR"
          color="green"
        />
      </div>

      {/* User Growth Chart */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          User Growth Trend (Last 7 Days)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              name="Total Users"
            />
            <Line 
              type="monotone" 
              dataKey="premium" 
              stroke="hsl(var(--chart-2))" 
              strokeWidth={2}
              name="Premium Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Popular Tools */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Most Popular AI Tools
        </h3>
        <div className="space-y-4">
          {popularTools.map((tool, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{tool.name}</span>
                  <span className="text-xs text-muted-foreground">({tool.category})</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${(tool.usage / popularTools[0].usage) * 100}%` }}
                  />
                </div>
              </div>
              <div className="ml-4 text-sm font-medium flex items-center gap-1">
                <MousePointer className="w-4 h-4" />
                {tool.usage}
              </div>
            </div>
          ))}
        </div>
      </Card>

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
                <span className="text-sm font-medium">{stats.freeTools}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${stats.totalTools > 0 ? (stats.freeTools / stats.totalTools) * 100 : 0}%` }}
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
                  style={{ width: `${stats.totalTools > 0 ? (stats.premiumTools / stats.totalTools) * 100 : 0}%` }}
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
