import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOperators } from "@/components/query-builder/operators";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { RuleGroupType } from "@/types";

export function RuleOperator({
  rule,
  groupIndex,
}: {
  rule: RuleGroupType;
  groupIndex: number[];
}) {
  const { setRuleOperator } = QueryBuilderStore();
  const operators = getOperators(rule.field!);

  return (
    <Select
      onValueChange={(operator) => {
        setRuleOperator(operator, groupIndex);
      }}
    >
      <SelectTrigger
        showIcon={false}
        className="w-fit transition-transform ease-in-out hover:border-foreground"
      >
        <SelectValue
          placeholder={
            operators[0].label.charAt(0).toUpperCase() +
            operators[0].label.slice(1)
          }
          defaultValue={operators[0].name}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {operators.map((operator, index) => (
            <SelectItem
              key={`${operator.name}-${index}`}
              value={operator.name}
              className="capitalize"
            >
              {operator.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
