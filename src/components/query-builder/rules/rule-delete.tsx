import { Button } from "@/components/ui/button";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { TrashIcon } from "@radix-ui/react-icons";

export function RuleDelete({ groupIndex }: { groupIndex: number[] }) {
  const { deleteRule } = QueryBuilderStore();

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={() => deleteRule(groupIndex)}
      className="group w-10 hover:bg-red-50 dark:hover:bg-red-500/5"
    >
      <TrashIcon className="h-5 w-5 text-muted-foreground group-hover:text-red-500" />
    </Button>
  );
}
