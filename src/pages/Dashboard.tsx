import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, Code2, Palette, TrendingUp, GraduationCap, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "writing", name: "Writing & Content", icon: Sparkles, color: "text-blue-500" },
    { id: "coding", name: "Coding & Dev", icon: Code2, color: "text-green-500" },
    { id: "design", name: "Design & Creative", icon: Palette, color: "text-purple-500" },
    { id: "marketing", name: "Marketing", icon: TrendingUp, color: "text-orange-500" },
    { id: "education", name: "Education", icon: GraduationCap, color: "text-pink-500" },
    { id: "productivity", name: "Productivity", icon: Zap, color: "text-yellow-500" },
  ];

  const tools = [
    { id: 1, name: "Blog Generator", category: "writing", description: "Generate engaging blog posts in seconds" },
    { id: 2, name: "Code Generator", category: "coding", description: "Write code in multiple languages" },
    { id: 3, name: "Grammar Fixer", category: "writing", description: "Fix grammar and improve writing" },
    { id: 4, name: "Image Generator", category: "design", description: "Create AI-powered images" },
    { id: 5, name: "Ad Copy Writer", category: "marketing", description: "Write compelling ad copy" },
    { id: 6, name: "Text Summarizer", category: "productivity", description: "Summarize long documents" },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Tools Dashboard</h1>
          <p className="text-muted-foreground">Select a tool to get started</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="glass-card p-4 cursor-pointer hover:scale-105 transition-transform"
              >
                <category.icon className={`w-8 h-8 mb-2 ${category.color}`} />
                <h3 className="font-semibold text-sm">{category.name}</h3>
              </Card>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Featured Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} to={`/tool/${tool.id}`}>
                <Card className="glass-card p-6 cursor-pointer hover:scale-105 transition-transform h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold">{tool.name}</h3>
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>
                  <Button variant="outline" className="w-full">
                    Try Now
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-12 glass-card p-8 text-center rounded-2xl">
          <h2 className="text-2xl font-bold mb-2">Ready for More?</h2>
          <p className="text-muted-foreground mb-6">
            Upgrade to Pro for unlimited access to all 50+ tools
          </p>
          <Link to="/pricing">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Upgrade to Pro
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
