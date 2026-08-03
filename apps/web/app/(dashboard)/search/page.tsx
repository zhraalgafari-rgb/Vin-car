import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { SearchFilters } from "@/components/search/search-filters";

export default function SearchPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Search</h1>
      <SearchBar />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1"><SearchFilters /></div>
        <div className="lg:col-span-3"><SearchResults /></div>
      </div>
    </div>
  );
}
