import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ToolTemplate from "@/components/ToolTemplate";
import { Loader2 } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  tool_type: string | null;
}


const DynamicTool = () => {
  const { toolType } = useParams<{ toolType: string }>();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTool = async () => {
      if (!toolType) {
        setLoading(false);
        return;
      }

      try {
        // First try exact tool_type match
        const { data: byToolType } = await supabase
          .from('tools')
          .select('id, name, description, tool_type')
          .eq('tool_type', toolType)
          .limit(1);

        if (byToolType && byToolType.length > 0) {
          setTool(byToolType[0]);
          setLoading(false);
          return;
        }

        // Try matching by route_path
        const { data: byRoute } = await supabase
          .from('tools')
          .select('id, name, description, tool_type')
          .or(`route_path.eq./tool/${toolType},route_path.eq./tools/${toolType}`)
          .limit(1);

        if (byRoute && byRoute.length > 0) {
          setTool(byRoute[0]);
          setLoading(false);
          return;
        }

        // Fallback: try matching by name derived from slug (handle kebab-case)
        const nameGuess = decodeURIComponent(toolType)
          .replace(/-/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        const { data: byName } = await supabase
          .from('tools')
          .select('id, name, description, tool_type')
          .ilike('name', `%${nameGuess}%`)
          .limit(1);
        
        if (byName && byName.length > 0) {
          setTool(byName[0]);
        } else {
          setTool(null);
        }

      } catch (error: any) {
        console.error('Error fetching tool:', error);
        toast({
          title: "Error",
          description: "Failed to load tool information",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTool();
  }, [toolType, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!tool) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ToolTemplate
      title={tool.name}
      description={tool.description}
      placeholder={`Enter your ${tool.name.toLowerCase()} prompt here...`}
      toolType={tool.tool_type || (toolType as string)}
    />
  );
};

export default DynamicTool;
