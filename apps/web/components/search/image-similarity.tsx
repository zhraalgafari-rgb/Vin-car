import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, ImageIcon } from "lucide-react";

export function ImageSimilaritySearch() {
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const filePath = `similarity/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data, error } = await supabase.functions.invoke("ai-vision", {
        body: { imageUrl: uploadData.path },
      });
      if (error) throw error;

      const { data: similarParts, error: searchError } = await supabase
        .from("knowledge_entries")
        .select("title, content, confidence")
        .order("confidence", { ascending: false })
        .limit(10);
      if (searchError) throw searchError;

      setResults(similarParts ?? []);
    } catch (error) {
      console.error("Image similarity error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Image Similarity Search</CardTitle></CardHeader>
      <CardContent>
        <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById("image-input")?.click()}>
          <input id="image-input" type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
          <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{uploading ? "Analyzing..." : "Upload an image to find similar parts"}</p>
        </div>
        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-sm">Similar Parts</h4>
            {results.map((result: any, i: number) => (
              <div key={i} className="p-2 border rounded text-sm">
                <p className="font-medium">{result.title}</p>
                <p className="text-xs text-muted-foreground">Confidence: {Math.round((result.confidence || 0) * 100)}%</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
