import { RulePanel } from "./rule-panel";
import { RuleCombinator } from "./rule-combinator";
import { RuleOperator } from "./rule-operator";
import { RuleValue } from "./rule-value";
import { RuleDelete } from "./rule-delete";
import { RuleGroupType } from "@/types";

interface Rule {
  rule: RuleGroupType;
  index: number;
  groupIndex: number;
}
// Combponent for individual rules
export function Rule({ rule, index, groupIndex }: Rule) {
  return (
    <div className="grid w-full grid-cols-1 items-center gap-2 sm:flex sm:flex-wrap">
      {/* Display 'where' for the first rule, otherwise show a combinator */}
      {index == 0 ? (
        <span className="mr-2 w-12 text-end text-sm font-semibold text-muted-foreground">
          where
        </span>
      ) : (
        <RuleCombinator groupIndex={[groupIndex]} />
      )}

      {/* Render field selector popover, operators, input value, and delete button */}
      <RulePanel rule={rule} groupIndex={[groupIndex, index]} />
      <RuleOperator rule={rule} groupIndex={[groupIndex, index]} />
      <RuleValue rule={rule} groupIndex={[groupIndex, index]} />
      <RuleDelete groupIndex={[groupIndex, index]} />
    </div>
  );
}
