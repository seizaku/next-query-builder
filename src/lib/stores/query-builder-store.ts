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
  addRule: (fieldName: string, groupIndex?: number[]) => void;
  addGroup: (groupIndex?: number[]) => void;
  setCombinator: (combinator: "and" | "or", groupIndex?: number[]) => void;
  setRuleField: (
    index: number,
    fieldName: string,
    groupIndex?: number[],
  ) => void;
  setRuleOperator: (
    index: number,
    operator: string,
    groupIndex?: number[],
  ) => void;
  setRuleValue: (
    index: number,
    value: string | undefined,
    groupIndex?: number[],
  ) => void;
  deleteRule: (index: number, groupIndex?: number[]) => void;
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

export const QueryBuilderStore = create<QueryStoreProps>((set, get) => ({
  query: {
    combinator: "and",
    rules: [],
  },

  addRule: (fieldName, groupIndex) => {
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;

    if (!groupIndex?.length) {
      query.rules.push({ field: fieldName, operator, value: "" });
      set({
        query,
        recentField: fields.find((field) => field.name === fieldName),
      });
      return;
    }

    const group = query.rules[groupIndex[0]];
    if (isRuleGroupType(group)) {
      group.rules.push({ field: fieldName, operator, value: "" });
      set({
        query,
        recentField: fields.find((field) => field.name === fieldName),
      });
    }
  },

  addGroup: (groupIndex) => {
    const query = get().query;
    const newGroup: RuleGroupType = { combinator: "and", rules: [] };

    if (groupIndex?.length === 0) {
      query.rules.push(newGroup);
    }

    set({ query });
  },

  setCombinator: (combinator, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    if (!groupIndex?.length) {
      query.combinator = combinator;
      set({ query });
      getUserData();
      return;
    }

    const group = query.rules[groupIndex[0]];
    if (isRuleGroupType(group)) {
      group.combinator = combinator;
      set({ query });
      getUserData();
      return;
    }
  },

  setRuleField: (index, fieldName, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;

    if (!groupIndex?.length) {
      query.rules[index] = { field: fieldName, operator, value: undefined };
      set({
        query,
        recentField: fields.find((field) => field.name === fieldName),
      });
      getUserData();
      return;
    }

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

  setRuleOperator: (index, operator, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    // Handle direct rule update
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

  setRuleValue: (index, value, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    if (!groupIndex?.length && isRuleType(query.rules[index]) && query.rules[index].value !== value) {
      query.rules[index].value = value;
      set({ query });
      getUserData();
      return;
    }

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

  deleteRule: (index, groupIndex) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;

    if (!groupIndex?.length && isRuleType(query.rules[index])) {
      query.rules.splice(index, 1);
      set({ query });
      getUserData();
      return;
    }

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
