import { ColumnDef } from "@tanstack/react-table";
import { Part } from "@/types/database";

export const partColumns: ColumnDef<Part>[] = [
  { accessorKey: "english_name", header: "Name" },
  { accessorKey: "oem_number", header: "OEM Number" },
  { accessorKey: "part_category", header: "Category" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "quantity", header: "Qty" },
];
