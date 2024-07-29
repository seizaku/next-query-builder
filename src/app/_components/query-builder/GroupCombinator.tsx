import { Button } from "@/components/ui/button";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { cn } from "@/lib/utils";

export function GroupCombinator({
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
