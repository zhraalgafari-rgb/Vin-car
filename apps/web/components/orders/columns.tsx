import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/database";

export const orderColumns: ColumnDef<Order>[] = [
  { accessorKey: "order_number", header: "Order #" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "priority", header: "Priority" },
  { accessorKey: "created_at", header: "Created" },
];
