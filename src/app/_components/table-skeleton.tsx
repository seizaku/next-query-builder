import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { columns } from "./columns";

export function TableLoadingSkeleton() {
  return (
    <>
      {Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]).map(() => (
        <TableRow>
          <TableCell colSpan={columns.length} className="text-center">
            <Skeleton className="h-8 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
