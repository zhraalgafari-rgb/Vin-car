import { DataTable } from "@/components/tables/data-table";
import { supplierColumns } from "@/components/suppliers/columns";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function SuppliersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <Button asChild><Link href="/dashboard/suppliers/new"><Plus className="mr-2 h-4 w-4" />New Supplier</Link></Button>
      </div>
      <SearchBar />
      <DataTable columns={supplierColumns} />
    </div>
  );
}
