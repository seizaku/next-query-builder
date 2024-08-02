"use client";

import { QueryBuilderStore } from "@/lib/stores/query-store";
import { RuleGroupCombinator, Rule, RulePanel } from "@/components";
import { cn } from "@/lib/utils";
import { RuleGroupType } from "@/types";

export function QueryBuilder() {
  const { query } = QueryBuilderStore();

  return query.rules?.map((rule, groupIndex) => {
    return (
      <section
        key={`group-${groupIndex}`}
        className={cn(
          "border-t-none relative rounded-xl border p-4",
          ruleGroupClassName(query, groupIndex),
        )}
      >
        <RuleGroupCombinator groupIndex={groupIndex} rule={rule} />
        <h1 className="p-2 text-xs font-bold uppercase text-muted-foreground">
          All Users
        </h1>
        <div className="flex flex-col px-6">
          {rule.rules?.map((innerRule, index) => (
            <Rule
              key={groupIndex}
              groupIndex={groupIndex}
              index={index}
              rule={innerRule}
            />
          ))}
          <RulePanel groupIndex={[groupIndex]} />
        </div>
      </section>
    );
  });
}

const ruleGroupClassName = (query: RuleGroupType, groupIndex: number) => {
  const rule = query?.rules?.[groupIndex];
  const rules = query?.rules ?? [];
  const nextGroupCombinatorIsOr =
    (rules[groupIndex + 1] as any)?.groupCombinator === "or";
  const isNotLastElement = rules.length - 1 !== groupIndex;

  return cn(
    "relative rounded-xl rounded-t-none border p-4",
    isNotLastElement && "rounded-b-none",
    (rule?.groupCombinator === "or" || groupIndex === 0) && "rounded-t-xl",
    rule?.groupCombinator === "or" && "mt-14 border-t",
    nextGroupCombinatorIsOr && "rounded-b-xl",
  );
};
