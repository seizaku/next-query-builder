import { create } from "zustand";
import { Field, RuleType } from "react-querybuilder";
import { fields } from "@/components/query-builder/fields-config";
import { getOperators } from "@/components/query-builder/operators";
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
export const isRuleType = (
  item: RuleType | RuleGroupType,
): item is RuleType => {
  return (item as RuleType).field !== undefined;
};

// Type guard to check if an item is a RuleGroupType
export const isRuleGroupType = (
  item: RuleType | RuleGroupType,
): item is RuleGroupType => {
  return (item as RuleGroupType).combinator !== undefined;
};

// Create a Zustand store for managing query builder state
export const QueryBuilderStore = create<QueryStoreProps>((set, get) => ({
  query: {
    rules: [{ combinator: "and", rules: [] }],
  },

  setQueryRules: (rules) => {
    set((state) => ({ query: { ...state.query, rules } }));
  },

  clearAll: () => {
    set({ query: { rules: [{ combinator: "and", rules: [] }] } });
  },

  addRule: (fieldName, groupIndex) => {
    const { query } = get();
    const operator = getOperators(fieldName)[0].name;
    const group = query.rules![groupIndex[0]];

    group.rules!.push({ field: fieldName, operator, value: "" });

    set({
      query: { ...query },
      recentField: fields.find((field) => field.name === fieldName),
    });
  },

  addGroup: (groupIndex) => {
    const { query } = get();
    query.rules!.push({ combinator: "and", rules: [], groupCombinator: "and" });
    set({ query: { ...query } });
  },

  setCombinator: (combinator, groupIndex) => {
    const { query } = get();
    const group = query.rules![groupIndex[0]];
    group.combinator = combinator;
    set({ query: { ...query } });
  },

  setGroupCombinator: (combinator, groupIndex) => {
    const { query } = get();
    const group = query.rules![groupIndex[0]];
    group.groupCombinator = combinator;
    set({ query: { ...query } });
  },

  setRuleField: (fieldName, groupIndex) => {
    const { query } = get();
    const operator = getOperators(fieldName)[0].name;
    const group = query.rules![groupIndex[0]];

    group.rules![groupIndex[1]] = {
      field: fieldName,
      operator,
      value: "",
    };

    set({
      query: { ...query },
      recentField: fields.find((field) => field.name === fieldName),
    });
  },

  setRuleOperator: (operator, groupIndex) => {
    const { query } = get();
    const group = query.rules![groupIndex[0]];
    const ruleIndex = groupIndex[1];

    group.rules![ruleIndex] = { ...group.rules![ruleIndex], operator };
    set({ query: { ...query } });
  },

  setRuleValue: (value, groupIndex) => {
    const { query } = get();
    const group = query.rules![groupIndex[0]];
    const ruleIndex = groupIndex[1];

    group.rules![ruleIndex] = { ...group.rules![ruleIndex], value };
    set({ query: { ...query } });
  },

  deleteRule: (groupIndex) => {
    const { query } = get();
    if (groupIndex.length === 2) {
      const group = query.rules![groupIndex[0]];
      group.rules!.splice(groupIndex[1], 1);

      set({
        query: { ...query },
      });
    }
  },
}));
