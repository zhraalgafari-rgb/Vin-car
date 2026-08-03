import { ColumnDef } from "@tanstack/react-table";
import { VinRecord } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const vinColumns: ColumnDef<VinRecord>[] = [
  { accessorKey: "vin", header: ({ column }) => <Button variant="ghost" onClick={() => column.toggleSorting()}>VIN <ArrowUpDown className="ml-2 h-4 w-4" /></Button> },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "model", header: "Model" },
  { accessorKey: "production_year", header: "Year" },
  { accessorKey: "market", header: "Market" },
  { accessorKey: "created_at", header: "Created" },
];
