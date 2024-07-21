"use client";
import { Button } from "@/components/ui/button";
import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
import { PlusIcon } from "@radix-ui/react-icons";

export function ControlRule() {
  const { addGroup } = QueryBuilderStore();
  return (
    <section className="flex justify-start py-2">
      <Button onClick={addGroup} variant={"ghost"}>
        <PlusIcon className="mr-2 h-5" />
        Group
      </Button>
    </section>
  );
}
