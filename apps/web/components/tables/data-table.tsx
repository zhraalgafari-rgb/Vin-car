import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableProps {
  columns: any[];
  data?: any[];
}

export function DataTable({ columns, data = [] }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col: any) => (
              <TableHead key={col.accessorKey}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">No data</TableCell></TableRow>
          ) : (
            data.map((row: any, i: number) => (
              <TableRow key={i}>
                {columns.map((col: any) => (
                  <TableCell key={col.accessorKey}>{row[col.accessorKey]}</TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
