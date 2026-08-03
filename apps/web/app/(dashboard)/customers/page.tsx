import { DataTable } from "@/components/tables/data-table";
import { customerColumns } from "@/components/customers/columns";
import { SearchBar } from "@/components/search/search-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button asChild><Link href="/dashboard/customers/new"><Plus className="mr-2 h-4 w-4" />New Customer</Link></Button>
      </div>
      <SearchBar />
      <DataTable columns={customerColumns} />
    </div>
  );
}
