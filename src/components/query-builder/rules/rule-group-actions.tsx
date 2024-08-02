"use client";
import { Button } from "@/components/ui/button";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { PlusIcon } from "@radix-ui/react-icons";

export function RuleGroupActions() {
  const { query, addGroup, clearAll } = QueryBuilderStore();
  return (
    <section className="flex w-full justify-start gap-2 py-2">
      {query.rules.length > 0 && (
        <Button onClick={() => addGroup([])} variant={"ghost"}>
          <PlusIcon className="mr-2 h-5" />
          Group
        </Button>
      )}
      {query.rules.length && (
        <Button onClick={clearAll} variant={"secondary"}>
          Clear all
        </Button>
      )}
    </section>
  );
}
