import { Input } from "@/components/ui/input";
import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
import { useEffect, useState } from "react";

export function CustomNumberRangeInput({
  ruleIndex,
  groupIndex,
}: {
  ruleIndex: number;
  groupIndex?: number[];
}) {
  const { setRuleValue } = QueryBuilderStore();
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  useEffect(() => {
    setRuleValue(ruleIndex, `${from}-${to}`, groupIndex);
  }, [from, to]);

  return (
    <>
      <Input
        defaultValue={from}
        type="number"
        onBlur={(e) => setFrom(parseInt(e.currentTarget.value))}
        className="w-24"
      />
      <span className="px-2 text-sm font-medium">and</span>
      <Input
        defaultValue={to}
        type="number"
        onBlur={(e) => setTo(parseInt(e.currentTarget.value))}
        className="w-24"
      />
    </>
  );
}
