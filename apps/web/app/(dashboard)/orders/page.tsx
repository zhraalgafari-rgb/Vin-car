import { DataTable } from "@/components/tables/data-table";
import { orderColumns } from "@/components/orders/columns";
import { SearchBar } from "@/components/search/search-bar";
import { OrderWorkflow } from "@/components/orders/order-workflow";

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <SearchBar />
      <OrderWorkflow />
      <DataTable columns={orderColumns} />
    </div>
  );
}
