import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Download } from "lucide-react";
import { useState } from "react";

interface BulkActionsProps {
  selectedIds: string[];
  onDelete: (ids: string[]) => void;
  onEdit: (ids: string[]) => void;
}

export function BulkActions({ selectedIds, onDelete, onEdit }: BulkActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} items?`)) return;
    setIsDeleting(true);
    await onDelete(selectedIds);
    setIsDeleting(false);
  };

  return (
    <div className="flex items-center gap-2 p-2 border rounded bg-accent">
      <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
      <Button variant="ghost" size="sm" onClick={() => onEdit(selectedIds)}>
        <Edit2 className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button variant="ghost" size="sm" onClick={handleDelete} disabled={isDeleting}>
        <Trash2 className="h-4 w-4 mr-1" /> {isDeleting ? "Deleting..." : "Delete"}
      </Button>
    </div>
  );
}
