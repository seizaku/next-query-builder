"use client";
import { Input } from "@/components/ui/input";
import { QueryBuilderStore } from "@/lib/stores/query-store";

export function NumberField({ groupIndex }: { groupIndex: number[] }) {
  const { setRuleValue } = QueryBuilderStore();
  return (
    <Input
      type="number"
      onBlur={(e) => setRuleValue(e.currentTarget.value, groupIndex)}
      className="w-fit"
    />
  );
}
