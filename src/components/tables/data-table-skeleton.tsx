import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { columns } from "./data-table-columns";

export function DataTableSkeleton() {
  return Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).map((value) => (
    <TableRow key={`skeleton-${value}`}>
      <TableCell colSpan={columns.length} className="text-center">
        <Skeleton className="h-8 w-full" />
      </TableCell>
    </TableRow>
  ));
}
