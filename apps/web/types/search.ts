export interface SearchResult {
  id: string;
  type: "vin" | "part" | "supplier" | "customer" | "order" | "document";
  title: string;
  description: string;
  score: number;
  url: string;
}

export interface SearchFilters {
  query: string;
  type?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface SearchState {
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  loading: boolean;
  error: string | null;
}
