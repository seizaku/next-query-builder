import { RuleGroupType } from "@/types";
import { isRuleGroupType } from "../stores/query-store";
import { RuleType } from "react-querybuilder";
import { customOperators } from "@/components/query-builder/operators";

export const getRuleValue = (
  query: any,
  groupIndex: number[],
) => {
  if (
    isRuleGroupType(query?.rules[groupIndex[0]]) &&
    ((query?.rules[groupIndex[0]] as RuleGroupType).rules?.[groupIndex[1]] as RuleType)?.value
  ) {
    return query.rules[groupIndex[0]].rules[groupIndex[1]]?.value;
  }

  return null;
};

// Parse and transform query rules
export function parseRules(query: RuleGroupType): RuleGroupType {
  const updatedRules = insertGroupCombinators(updateDateOperators(query.rules!));
  return { ...query, rules: updatedRules };
}

// Update date operators included in customOperators to 'between'
const updateDateOperators = (rules: (RuleGroupType | RuleType)[]): (RuleGroupType | RuleType)[] => {
  return rules.map((item) => {
    if ('rules' in item) {
      return { ...item, rules: updateDateOperators(item.rules!) };
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