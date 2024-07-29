import { create } from "zustand";
import { Field, RuleType } from "react-querybuilder";
import { fields } from "@/config/fields";
import { getOperators } from "@/config/operators";
import { RuleGroupType } from "@/types";

type Combinator = "and" | "or";

type QueryStoreProps = {
  query: RuleGroupType;
  recentField?: Field;
  clearAll: () => void;
  setQueryRules: (query: Array<RuleType | RuleGroupType>) => void;
  addRule: (fieldName: string, groupIndex: number[]) => void;
  addGroup: (groupIndex: number[]) => void;
  setCombinator: (combinator: Combinator, groupIndex: number[]) => void;
  setGroupCombinator: (combinator: Combinator, groupIndex: number[]) => void;
  setRuleField: (fieldName: string, groupIndex: number[]) => void;
  setRuleOperator: (operator: string, groupIndex: number[]) => void;
  setRuleValue: (value: any, groupIndex: number[]) => void;
  deleteRule: (groupIndex: number[]) => void;
};

// Type guard to check if an item is a RuleType
export const isRuleType = (item: RuleType | RuleGroupType): item is RuleType => {
  return (item as RuleType)?.field !== undefined;
};

// Type guard to check if an item is a RuleGroupType
export const isRuleGroupType = (item: RuleType | RuleGroupType): item is RuleGroupType => {
  return (item as RuleGroupType)?.combinator !== undefined;
};

// Create a Zustand store for managing query builder state
export const QueryBuilderStore = create<QueryStoreProps>((set, get) => ({
  // Default query state
  query: {
    rules: [{ combinator: "and", rules: [] }],
  },

  // Set the entire query rules
  setQueryRules: (rules) => {
    set({ query: { ...get().query, rules } });
  },

  // Clear all rules and reset the query
  clearAll: () => {
    set({ query: { rules: [{ combinator: "and", rules: [] }] } });
  },

  // Add a new rule to a specific group
  addRule: (fieldName, groupIndex) => {
    const { query } = get();
    const operator = getOperators(fieldName)[0].name;
    const group = query.rules[groupIndex[0]];

    if (isRuleGroupType(group)) {
      group.rules.push({ field: fieldName, operator, value: "" });
      set({ query, recentField: fields.find((field) => field.name === fieldName) });
    }
  },

  // Add a new group of rules to the query
  addGroup: (groupIndex) => {
    const { query } = get();
    const newGroup: RuleGroupType = { combinator: "and", rules: [], groupCombinator: "and" };

    if (groupIndex?.length === 0) {
      query.rules.push(newGroup);
    }

    set({ query });
  },

  // Set the combinator (AND/OR) for a group or the top-level query
  setCombinator: (combinator, groupIndex) => {
    const { query } = get();
    const group = query.rules[groupIndex[0]];

    if (isRuleGroupType(group)) {
      group.combinator = combinator;
      set({ query });
    }
  },

  // Set the group combinator
  setGroupCombinator: (combinator, groupIndex) => {
    const { query } = get();
    const group = query.rules[groupIndex[0]];

    if (isRuleGroupType(group)) {
      group.groupCombinator = combinator;
      set({ query });
    }
  },

  // Set the field for a specific rule
  setRuleField: (fieldName, groupIndex) => {
    const { query } = get();
    const operator = getOperators(fieldName)[0].name;
    const group = query.rules[groupIndex[0]];

    if (isRuleGroupType(group)) {
      group.rules[groupIndex[1]] = { field: fieldName, operator, value: undefined };
      set({ query, recentField: fields.find((field) => field.name === fieldName) });
    }
  },

  // Set the operator for a specific rule
  setRuleOperator: (operator, groupIndex) => {
    const { query } = get();
    const group = query.rules[groupIndex[0]];

    if (isRuleGroupType(group) && groupIndex.length === 2) {
      const ruleIndex = groupIndex[1];
      if (isRuleType(group.rules[ruleIndex])) {
        group.rules[ruleIndex] = { ...group.rules[ruleIndex], operator };
        set({ query });
        }
    }
  },

  // Set the value for a specific rule
  setRuleValue: (value, groupIndex) => {
    const { query } = get();
    const group = query.rules[groupIndex[0]];

    if (isRuleGroupType(group) && groupIndex.length === 2) {
      const ruleIndex = groupIndex[1];
      if (isRuleType(group.rules[ruleIndex])) {
        group.rules[ruleIndex] = { ...group.rules[ruleIndex], value };
        set({ query });
        }
    }
  },

  // Delete a specific rule
  deleteRule: (groupIndex) => {
    const { query } = get();

    if (groupIndex.length === 2) {
      const updatedQuery = { ...query, rules: [...query.rules] };
      const group = updatedQuery.rules[groupIndex[0]];

      if (isRuleGroupType(group)) {
        const updatedGroup = { ...group, rules: [...group.rules] };
        updatedGroup.rules.splice(groupIndex[1], 1);
        updatedQuery.rules[groupIndex[0]] = updatedGroup;
        set({ query: updatedQuery });
        }
    }
  },
}));
