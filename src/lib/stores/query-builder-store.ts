import { create } from "zustand";
import { UserDataStore } from "./user-data-store";
import { Field, RuleType } from "react-querybuilder";
import { fields } from "@/config/fields";
import { getOperators } from "../helpers/get-operators";

export type RuleGroupType = {
  combinator: "and" | "or";
  rules: Array<RuleType | RuleGroupType>;
};

type Query = RuleGroupType;

type QueryStoreProps = {
  query: Query;
  recentField?: Field;
  clearAll: () => void;
  setQueryRules: (query: Array<RuleType | RuleGroupType>) => void;
  addRule: (fieldName: string, groupIndex?: number[] | undefined) => void;
  addGroup: (groupIndex?: number[] | undefined) => void;
  setCombinator: (
    combinator: "and" | "or",
    groupIndex?: number[] | undefined,
  ) => void;
  setRuleField: (
    index: number,
    fieldName: string,
    groupIndex?: number[] | undefined,
  ) => void;
  setRuleOperator: (
    index: number,
    operator: string,
    groupIndex?: number[] | undefined,
  ) => void;
  setRuleValue: (
    index: number,
    value: string | undefined,
    groupIndex?: number[] | undefined,
  ) => void;
  deleteRule: (index: number, groupIndex?: number[] | undefined) => void;
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
    combinator: "and",
    rules: [],
  },

  // Set the entire query rules
  setQueryRules: (rules) => {
    set({
      query: {
        ...get().query,
        rules,
      },
    });
  },

  // Clear all rules and reset the query
  clearAll: () => {
    set({
      query: {
        combinator: "and",
        rules: [],
      },
    });
  },

  // Add a new rule to the query
  addRule: (fieldName, groupIndex) => {
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;

    // Add rule to the top-level rules if no groupIndex is provided
    if (!groupIndex?.length) {
      query.rules.push({ field: fieldName, operator, value: "" });
      set({
        query,
        recentField: fields.find((field) => field.name === fieldName),
      });
      return;
    }

    // Add rule to a specific group
    const group = query.rules[groupIndex[0]];
    if (isRuleGroupType(group)) {
      group.rules.push({ field: fieldName, operator, value: "" });
      set({
        query,
        recentField: fields.find((field) => field.name === fieldName),
      });
    }
  },

  // Add a new group of rules to the query
  addGroup: (groupIndex) => {
    const query = get().query;
    const newGroup: RuleGroupType = { combinator: "and", rules: [] };

    // Add group to the top-level rules if groupIndex is empty
    if (groupIndex?.length === 0) {
      query.rules.push(newGroup);
    }

    set({ query });
  },

  // Set the combinator (AND/OR) for a group or the top-level query
  setCombinator: (combinator, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    // Set combinator for the top-level query if no groupIndex is provided
    if (!groupIndex?.length) {
      query.combinator = combinator;
      set({ query });
      getUserData();
      return;
    }

    // Set combinator for a specific group
    const group = query.rules[groupIndex[0]];
    if (isRuleGroupType(group)) {
      group.combinator = combinator;
      set({ query });
      getUserData();
      return;
    }
  },

  // Set the field for a specific rule
  setRuleField: (index, fieldName, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;

    // Set field for a rule at the top level if no groupIndex is provided
    if (!groupIndex?.length) {
      query.rules[index] = { field: fieldName, operator, value: undefined };
      set({
        query,
        recentField: fields.find((field) => field.name === fieldName),
      });
      getUserData();
      return;
    }

    // Set field for a rule within a group
    const group = query.rules[groupIndex[0]];
    if (isRuleGroupType(group)) {
      group.rules[groupIndex[1]] = {
        field: fieldName,
        operator,
        value: undefined,
      };
      set({
        query,
        recentField: fields.find((field) => field.name === fieldName),
      });
      getUserData();
      return;
    }
  },

  // Set the operator for a specific rule
  setRuleOperator: (index, operator, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    // Handle operator update for a rule at the top level
    if (!groupIndex?.length && isRuleType(query.rules[index])) {
      query.rules[index] = {
        ...query.rules[index],
        operator,
        value: undefined,
      };
      set({ query });
      getUserData();
      return;
    }

    // Handle operator update for a rule within a group
    if (groupIndex?.length !== 2) return;

    const group = query.rules[groupIndex[0]];
    if (!isRuleGroupType(group)) return;
    const ruleIndex = groupIndex[1];
    if (isRuleType(group.rules[ruleIndex])) {
      group.rules[ruleIndex] = {
        ...group.rules[ruleIndex],
        operator,
        value: undefined,
      };
      set({ query });
      getUserData();
    }
  },

  // Set the value for a specific rule
  setRuleValue: (index, value, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    // Update value for a rule at the top level
    if (
      !groupIndex?.length &&
      isRuleType(query.rules[index]) &&
      query.rules[index].value !== value
    ) {
      query.rules[index].value = value;
      set({ query });
      getUserData();
      return;
    }

    // Update value for a rule within a group
    if (groupIndex?.length !== 2) return;

    const group = query.rules[groupIndex[0]];
    if (!isRuleGroupType(group)) return;
    const ruleIndex = groupIndex[1];
    if (isRuleType(group.rules[ruleIndex])) {
      group.rules[ruleIndex] = {
        ...group.rules[ruleIndex],
        value: value,
      };
      set({ query });
      getUserData();
    }
  },

  // Delete a specific rule
  deleteRule: (index, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    // Delete rule from top-level rules
    if (!groupIndex?.length && isRuleType(query.rules[index])) {
      query.rules.splice(index, 1);
      set({ query });
      getUserData();
      return;
    }

    // Delete rule from a specific group
    if (groupIndex?.length !== 2) return;
    const group = query.rules[groupIndex[0]];
    if (!isRuleGroupType(group)) return;
    const ruleIndex = groupIndex[1];
    if (isRuleType(group.rules[ruleIndex])) {
      group.rules.splice(ruleIndex, 1);
      set({ query });
      getUserData();
    }
  },
}));
