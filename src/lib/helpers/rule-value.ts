import { RuleGroupType } from "@/types";
import { isRuleGroupType, isRuleType } from "../stores/query-store";
import { RuleType } from "react-querybuilder";

export const getQueryValue = (
  query: any,
  groupIndex: number[],
) => {
  if (
    isRuleGroupType(query?.rules[groupIndex[0]]) &&
    ((query?.rules[groupIndex[0]] as RuleGroupType).rules[groupIndex[1]] as RuleType)?.value
  ) {
    return query.rules[groupIndex[0]].rules[groupIndex[1]]?.value;
  }

  return null;
};
