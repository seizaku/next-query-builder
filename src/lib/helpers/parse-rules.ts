import { customOperators } from "@/config/operators";
import { RuleGroupType } from "@/types";
import { RuleType } from "react-querybuilder";


const betweenOperators: any = (rules: (RuleGroupType | RuleType)[]) => {
  return rules.map((item) => {
    if ("rules" in item) {
      return { ...item, rules: betweenOperators(item.rules) };
    }
    if (
      "operator" in item &&
      customOperators.date.some((x) => x.value === item.operator)
    ) {
      return { ...item, operator: "between" };
    }
    return item;
  });
};

const groupCombinators: any = (rules: (RuleGroupType | RuleType)[]) => {
  let result: any = [];

  rules.forEach((item, index) => {
    if ('groupCombinator' in item) {
      result.push(item.groupCombinator as any);
    }
    result.push(item);
  });

  return result;
};



export function parseRules(query: RuleGroupType) {
  let rules = query.rules;
  rules = betweenOperators(rules);
  rules = groupCombinators(rules);

  return { ...query, rules };
};