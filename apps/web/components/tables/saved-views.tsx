import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Trash2 } from "lucide-react";

interface SavedView {
  id: string;
  name: string;
  filters: Record<string, any>;
  sort: Record<string, string>;
}

export function SavedViews() {
  const [views, setViews] = useState<SavedView[]>([]);
  const [newViewName, setNewViewName] = useState("");
  const [showSave, setShowSave] = useState(false);

  const handleSave = () => {
    if (!newViewName.trim()) return;
    setViews([...views, { id: Date.now().toString(), name: newViewName, filters: {}, sort: {} }]);
    setNewViewName("");
    setShowSave(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Views</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {views.map((view) => (
            <div key={view.id} className="flex items-center justify-between p-2 border rounded">
              <span className="text-sm">{view.name}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">Load</Button>
                <Button variant="ghost" size="sm"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
          {showSave ? (
            <div className="flex gap-2">
              <Input placeholder="View name" value={newViewName} onChange={(e) => setNewViewName(e.target.value)} />
              <Button size="sm" onClick={handleSave}>Save</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowSave(true)}>
              <Plus className="h-4 w-4 mr-1" /> New View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
