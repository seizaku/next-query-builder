import { RuleType } from "react-querybuilder";
import { FieldSelectorPopover } from "./FieldSelectorPopover";
import {
  RuleCombinator,
  RuleDeleteButton,
  RuleInputValue,
  RuleOperators,
} from "./QueryBuilder";

interface Rule {
  rule: RuleType;
  index: number;
  groupIndex: number;
}
// Combponent for individual rules
export function Rule({ rule, index, groupIndex }: Rule) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Display 'where' for the first rule, otherwise show a combinator */}
      {index == 0 ? (
        <span className="mr-2 w-12 text-end text-sm font-semibold text-muted-foreground">
          where
        </span>
      ) : (
        <RuleCombinator groupIndex={[groupIndex]} />
      )}

      {/* Render field selector popover, operators, input value, and delete button */}
      <FieldSelectorPopover rule={rule} groupIndex={[groupIndex, index]} />
      <RuleOperators rule={rule} groupIndex={[groupIndex, index]} />
      <RuleInputValue rule={rule} groupIndex={[groupIndex, index]} />
      <RuleDeleteButton groupIndex={[groupIndex, index]} />
    </div>
  );
}
