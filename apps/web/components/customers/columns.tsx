import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/database";

export const customerColumns: ColumnDef<Customer>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "customer_type", header: "Type" },
  { accessorKey: "country", header: "Country" },
];
