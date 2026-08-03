import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface OEMLookupProps {
  onFound?: (oemNumber: string) => void;
}

export function OEMLookup({ onFound }: OEMLookupProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const supabase = (await import("@/lib/supabase/client")).createClient();
      const { data, error } = await supabase
        .from("parts")
        .select("id, english_name, arabic_name, oem_number, alternative_oem_numbers, brands, part_category")
        .or(`oem_number.ilike.%${query}%,alternative_oem_numbers.cs.{${query}}`)
        .limit(10);

      if (error) throw error;
      setResults(data ?? []);
    } catch (error) {
      console.error("OEM lookup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by OEM number..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result: any) => (
              <div key={result.id} className="p-2 border rounded hover:bg-accent cursor-pointer" onClick={() => onFound?.(result.oem_number)}>
                <p className="font-medium text-sm">{result.english_name}</p>
                <p className="text-xs text-muted-foreground">OEM: {result.oem_number} • {result.part_category}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
