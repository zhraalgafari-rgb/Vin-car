import { DataTable } from "@/components/tables/data-table";
import { vinColumns } from "@/components/vins/columns";
import { SearchBar } from "@/components/search/search-bar";
import { VinFilters } from "@/components/vins/vin-filters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function VinsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">VIN Records</h1>
        <Button asChild>
          <Link href="/dashboard/vins/new">
            <Plus className="mr-2 h-4 w-4" />
            New VIN
          </Link>
        </Button>
      </div>
      <div className="flex gap-4">
        <SearchBar />
        <VinFilters />
      </div>
      <DataTable columns={vinColumns} />
    </div>
  );
}
