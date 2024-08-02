import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { cn } from "@/lib/utils";

// Component for selecting rule group combinator Ex. ((name = 'John') 'AND' (age = 50))

export function RuleGroupCombinator({
  rule,
  groupIndex,
}: {
  rule: any;
  groupIndex: number;
}) {
  const { setGroupCombinator } = QueryBuilderStore();

  const getButtonClass = () =>
    "groupCombinator" in rule && rule.groupCombinator === "or"
      ? "secondary"
      : "default";

  const getButtonPositionClass = () =>
    "groupCombinator" in rule && rule.groupCombinator === "or"
      ? "-top-12"
      : "-top-4";

  return (
    <>
      {"groupCombinator" in rule && (
        <div
          className={cn(
            "absolute left-0 flex w-full justify-center",
            getButtonPositionClass(),
          )}
        >
          <Button
            onClick={() =>
              setGroupCombinator(rule.groupCombinator === "or" ? "and" : "or", [
                groupIndex,
              ])
            }
            variant={getButtonClass()}
          >
            {rule.groupCombinator?.toUpperCase()}
          </Button>
        </div>
      )}
    </>
  );
}

// Component for selecting rule combinator Ex. ((name = 'John' AND age = 50))
export function RuleCombinator({ groupIndex }: { groupIndex: number[] }) {
  const { query, setCombinator } = QueryBuilderStore();

  return (
    <Select
      onValueChange={(combinator: "and" | "or") =>
        setCombinator(combinator, groupIndex)
      }
    >
      <SelectTrigger
        showIcon={false}
        className="w-14 justify-end border-0 text-end text-sm font-semibold text-muted-foreground shadow-none hover:bg-muted"
      >
        <SelectValue
          placeholder={(query.rules[groupIndex[0]] as any)?.combinator}
          defaultValue={(query.rules[groupIndex[0]] as any)?.combinator}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={"and"}>and</SelectItem>
          <SelectItem value={"or"}>or</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
