import { Input } from "@/components/ui/input";
import { getQueryValue } from "@/lib/helpers/rule-value";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { useEffect, useState } from "react";

export function NumberValueEditor({ groupIndex }: { groupIndex: number[] }) {
  const { query, setRuleValue } = QueryBuilderStore();
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  useEffect(() => {
    setRuleValue(`${from},${to}`, groupIndex);
  }, [from, to]);

  return (
    <>
      <Input
        defaultValue={getQueryValue(query, groupIndex)}
        type="number"
        onBlur={(e) => setFrom(parseInt(e.currentTarget.value))}
        className="w-24"
      />
      <span className="px-2 text-sm font-medium">and</span>
      <Input
        defaultValue={getQueryValue(query, groupIndex)}
        type="number"
        onBlur={(e) => setTo(parseInt(e.currentTarget.value))}
        className="w-24"
      />
    </>
  );
}
