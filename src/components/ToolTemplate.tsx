import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Download, RefreshCw, Sparkles, Lock, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ToolTemplateProps {
  title: string;
  description: string;
  placeholder: string;
  toolType: string;
  isFree?: boolean;
}

const ToolTemplate = ({ title, description, placeholder, toolType, isFree = true }: ToolTemplateProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const sanitizeOutput = (raw: string) => {
    if (!raw) return raw;
    const trimmed = raw.trim();
    if (trimmed.startsWith("```") && trimmed.endsWith("```")) {
      const lines = trimmed.split("\n");
      lines.shift();
      if (lines[lines.length - 1]?.trim() === "```") lines.pop();
      return lines.join("\n").trim();
    }
    return raw;
  };

  // Check if user can access this tool
  const canAccess = () => {
    if (isFree) return true;
    if (!user || !profile) return false;
    return ['pro', 'yearly', 'lifetime'].includes(profile.plan);
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }

    // For premium tools, require login
    if (!isFree && !user) {
      toast({
        title: "Premium feature",
        description: "Please sign up for a Pro or Business plan to use this tool",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setOutput("");
    setError(null);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {};
      if (session) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const { data, error: fnError } = await supabase.functions.invoke("ai-tool", {
        body: { prompt: input, toolType },
        headers
      });

      if (fnError) throw fnError;

      if (data?.error) {
        throw new Error(data.error);
      }

      setOutput(sanitizeOutput(data.result));
      toast({
        title: "Success!",
        description: "Content generated successfully",
      });
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessage = err.message || "Failed to generate content";
      setError(errorMessage);
      toast({
        title: "Generation failed",
        description: "Tool is loading, please try again in a moment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolType}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Show upgrade prompt for premium tools
  if (!canAccess()) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <Lock className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h2 className="text-2xl font-bold mb-2">Premium Tool</h2>
          <p className="text-muted-foreground mb-6">
            {title} is a premium tool. Upgrade to Pro or Business plan to unlock unlimited access.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-accent hover:bg-accent/90">
              <Link to="/pricing">View Plans</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Tools
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tools
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-accent" />
            {title}
          </h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-4">Input</h2>
            <Textarea
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[300px] mb-4"
            />
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </Card>

          {/* Output Section */}
          <Card className="glass-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Output</h2>
              {output && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="min-h-[300px] p-4 bg-background/50 rounded-lg border overflow-auto">
              {error ? (
                <div className="text-center py-8">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button variant="outline" onClick={handleGenerate}>
                    Try Again
                  </Button>
                </div>
              ) : output ? (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mb-4 text-foreground" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mb-3 text-foreground" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mb-2 text-foreground" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 text-foreground leading-relaxed" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-primary" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-2 text-foreground" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-foreground" {...props} />,
                      li: ({node, ...props}) => <li className="text-foreground" {...props} />,
                      code: ({node, inline, ...props}: any) => 
                        inline ? (
                          <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props} />
                        ) : (
                          <code className="block bg-secondary p-4 rounded-lg text-sm font-mono overflow-x-auto mb-4" {...props} />
                        ),
                      pre: ({node, ...props}) => <pre className="bg-secondary p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground" {...props} />,
                      a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
                    }}
                  >
                    {output}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  Your generated content will appear here...
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ToolTemplate;