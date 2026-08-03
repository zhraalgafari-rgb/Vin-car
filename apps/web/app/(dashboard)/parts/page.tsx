import { DataTable } from "@/components/tables/data-table";
import { partColumns } from "@/components/parts/columns";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function PartsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Parts Library</h1>
        <Button asChild><Link href="/dashboard/parts/new"><Plus className="mr-2 h-4 w-4" />New Part</Link></Button>
      </div>
      <SearchBar />
      <DataTable columns={partColumns} />
    </div>
  );
}
