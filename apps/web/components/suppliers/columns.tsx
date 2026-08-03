import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/types/database";

export const supplierColumns: ColumnDef<Supplier>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "reliability_score", header: "Reliability" },
  { accessorKey: "performance_rating", header: "Rating" },
];
