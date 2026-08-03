import { useSearch } from "@/hooks/use-search";

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const { data, isLoading, error } = useSearch(query);

  if (isLoading) return <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (error) return <div className="text-destructive p-4">Search error</div>;
  if (!data || data.length === 0) return <div className="text-muted-foreground p-4">No results found</div>;

  return (
    <div className="space-y-4">
      {data.map((result: any) => (
        <div key={result.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-medium">{result.vin || result.name || result.english_name}</span>
            <span className="text-sm text-muted-foreground">{result.type}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
