import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  is_premium: boolean;
  credits_cost: number;
  display_order: number;
  route_path: string;
}

const ToolManagement = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setTools(data || []);
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

  const handleSaveTool = async () => {
    if (!editingTool) return;

    try {
      const { error } = editingTool.id
        ? await supabase
            .from('tools')
            .update(editingTool)
            .eq('id', editingTool.id)
        : await supabase.from('tools').insert([editingTool]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Tool ${editingTool.id ? 'updated' : 'created'} successfully`,
      });
      
      setIsDialogOpen(false);
      setEditingTool(null);
      fetchTools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool deleted successfully",
      });
      fetchTools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePremium = async (tool: Tool) => {
    try {
      const { error } = await supabase
        .from('tools')
        .update({ is_premium: !tool.is_premium })
        .eq('id', tool.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tool status updated",
      });
      fetchTools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Tool Management</h2>
          <p className="text-muted-foreground">Manage AI tools and their settings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTool({} as Tool)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Tool
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTool?.id ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tool Name</Label>
                <Input
                  value={editingTool?.name || ''}
                  onChange={(e) => setEditingTool({ ...editingTool!, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editingTool?.description || ''}
                  onChange={(e) => setEditingTool({ ...editingTool!, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Input
                    value={editingTool?.category || ''}
                    onChange={(e) => setEditingTool({ ...editingTool!, category: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Route Path</Label>
                  <Input
                    value={editingTool?.route_path || ''}
                    onChange={(e) => setEditingTool({ ...editingTool!, route_path: e.target.value })}
                    placeholder="/tool/example"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Credits Cost</Label>
                  <Input
                    type="number"
                    value={editingTool?.credits_cost || 1}
                    onChange={(e) => setEditingTool({ ...editingTool!, credits_cost: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={editingTool?.display_order || 0}
                    onChange={(e) => setEditingTool({ ...editingTool!, display_order: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editingTool?.is_premium || false}
                  onCheckedChange={(checked) => setEditingTool({ ...editingTool!, is_premium: checked })}
                />
                <Label>Premium Tool</Label>
              </div>
              <Button onClick={handleSaveTool} className="w-full">
                Save Tool
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        {loading ? (
          <div className="text-center py-8">Loading tools...</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools.map((tool) => (
                  <TableRow key={tool.id}>
                    <TableCell className="font-medium">{tool.name}</TableCell>
                    <TableCell>{tool.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={tool.is_premium}
                          onCheckedChange={() => togglePremium(tool)}
                        />
                        <Badge variant={tool.is_premium ? "default" : "secondary"}>
                          {tool.is_premium ? "Premium" : "Free"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{tool.credits_cost}</TableCell>
                    <TableCell>{tool.display_order}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingTool(tool);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTool(tool.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ToolManagement;
