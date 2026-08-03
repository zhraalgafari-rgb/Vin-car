import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText, Image, FileSpreadsheet, Zip } from "lucide-react";
import { UploadZone } from "@/components/upload/upload-zone";

interface DocumentListProps {
  vinId: string;
}

export function DocumentList({ vinId }: DocumentListProps) {
  const supabase = createClient();
  const user = useUser();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents", vinId],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("vin_id", vinId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user && !!vinId,
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (fileType.includes("excel") || fileType.includes("spreadsheet")) return <FileSpreadsheet className="h-4 w-4" />;
    if (fileType === "application/pdf") return <FileText className="h-4 w-4" />;
    if (fileType.includes("zip")) return <Zip className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <UploadZone vinId={vinId} onUpload={(files) => console.log("Uploaded:", files)} />
        <div className="mt-4 space-y-2">
          {documents.map((doc: any) => (
            <div key={doc.id} className="flex items-center gap-3 p-2 border rounded-lg hover:bg-accent">
              {getFileIcon(doc.mime_type || doc.file_type)}
              <span className="flex-1 text-sm">{doc.file_name}</span>
              <span className="text-xs text-muted-foreground">{doc.file_type}</span>
            </div>
          ))}
          {documents.length === 0 && <p className="text-muted-foreground text-center py-4">No documents uploaded yet</p>}
        </div>
      </CardContent>
    </Card>
  );
}
