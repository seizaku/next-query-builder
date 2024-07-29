import { customOperators } from "@/config/operators";
import { RuleGroupType } from "@/types";
import { RuleType } from "react-querybuilder";

// Update date operators to 'between'
const updateDateOperators = (rules: (RuleGroupType | RuleType)[]): (RuleGroupType | RuleType)[] => {
  return rules.map((item) => {
    if ('rules' in item) {
      return { ...item, rules: updateDateOperators(item.rules) };
    }
    if (
      'operator' in item &&
      customOperators.date.some((op) => op.value === item.operator)
    ) {
      return { ...item, operator: 'between' };
    }
    return item;
  });
};

// Insert group combinators between rules
const insertGroupCombinators = (rules: (RuleGroupType | RuleType)[]): (RuleGroupType | RuleType)[] => {
  const result: (RuleGroupType | RuleType)[] = [];
  
  rules.forEach((item) => {
    if ('groupCombinator' in item) {
      result.push(item.groupCombinator as any);
    }
    result.push(item);
  });

  return result;
};

// Parse and transform query rules
export function parseRules(query: RuleGroupType): RuleGroupType {
  const updatedRules = insertGroupCombinators(updateDateOperators(query.rules));
  return { ...query, rules: updatedRules };
}
