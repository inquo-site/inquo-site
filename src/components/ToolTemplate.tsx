import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Copy, Download, RefreshCw, Sparkles } from "lucide-react";

interface ToolTemplateProps {
  title: string;
  description: string;
  placeholder: string;
  toolType: string;
}

const ToolTemplate = ({ title, description, placeholder, toolType }: ToolTemplateProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to process",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-tool", {
        body: { prompt: input, toolType },
      });

      if (error) throw error;

      setOutput(data.result);
      toast({
        title: "Success!",
        description: "Content generated successfully",
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate content",
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="min-h-[300px] p-4 bg-background/50 rounded-lg border overflow-auto">
              {output ? (
                <div className="formatted-output space-y-4">
                  {output.split('\n\n').map((paragraph, idx) => {
                    // Check if paragraph contains question/input context
                    if (paragraph.toLowerCase().includes('question:') || 
                        paragraph.toLowerCase().includes('input:') ||
                        paragraph.toLowerCase().includes('prompt:')) {
                      return (
                        <div key={idx} className="p-3 bg-secondary/30 rounded-lg border-l-4 border-secondary">
                          <p className="text-foreground font-medium whitespace-pre-wrap">{paragraph}</p>
                        </div>
                      );
                    }
                    
                    // Format the paragraph with highlighted text
                    const formattedText = paragraph.split('\n').map((line, lineIdx) => {
                      // Check for bold patterns like **text** or __text__
                      let processedLine = line
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>')
                        .replace(/__(.*?)__/g, '<strong class="font-bold text-primary">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                        .replace(/_(.*?)_/g, '<em class="italic">$1</em>');
                      
                      // Highlight numbered points (1. 2. 3. etc)
                      if (/^\d+\./.test(line.trim())) {
                        return (
                          <div key={lineIdx} className="ml-4 mb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-semibold" dangerouslySetInnerHTML={{ __html: processedLine }} />
                          </div>
                        );
                      }
                      
                      // Highlight bullet points
                      if (/^[-•]/.test(line.trim())) {
                        return (
                          <div key={lineIdx} className="ml-4 mb-2">
                            <span className="text-blue-600 dark:text-blue-400" dangerouslySetInnerHTML={{ __html: processedLine }} />
                          </div>
                        );
                      }
                      
                      return (
                        <span key={lineIdx} className="text-blue-600 dark:text-blue-400 block mb-1" dangerouslySetInnerHTML={{ __html: processedLine }} />
                      );
                    });
                    
                    return (
                      <div key={idx} className="paragraph-block">
                        {formattedText}
                      </div>
                    );
                  })}
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
