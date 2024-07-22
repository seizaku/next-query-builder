import { create } from "zustand";
import { UserDataStore } from "./user-data-store";
import { Field, RuleType } from "react-querybuilder";
import { fields } from "@/config/fields";
import { getOperators } from "../helpers/get-operators";

export type RuleGroupType = {
  combinator: "and" | "or";
  rules: Array<RuleType | RuleGroupType>;
  groupCombinator?: "and" | "or";
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
    isGroupCombinator?: boolean,
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
  // Default value
  query: {
    combinator: "and",
    rules: [],
    groupCombinator: "and",
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
        groupCombinator: "and"
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
    const newGroup: RuleGroupType = {
      combinator: "and",
      rules: [],
      groupCombinator: "and",
    };

    // Add group to the top-level rules if groupIndex is empty
    if (groupIndex?.length === 0) {
      query.rules.push(newGroup);
    }

    set({ query });
  },

  // Set the combinator (AND/OR) for a group or the top-level query
  setCombinator: (combinator, groupIndex, isGroupCombinator = false) => {
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
      if (isGroupCombinator) {
        console.log("TRIGGERED", combinator, groupIndex, isGroupCombinator);
        group.groupCombinator = combinator;
        set({ query });
      } else {
        group.combinator = combinator;
        set({ query });
      }
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
    console.log("DELETE ATTEMPT", index, groupIndex);
    const { getUserData } = UserDataStore.getState();
    const { query } = get();
    
    // Clone the query to ensure immutability
    let updatedQuery = { ...query, rules: [...query.rules] };
  
    // Delete rule from top-level rules
    if (groupIndex === undefined || groupIndex === null) {
      if (isRuleType(updatedQuery.rules[index])) {
        console.log("Deleting top-level rule at index:", index);
        updatedQuery.rules.splice(index, 1);
  
        // Check if there are any remaining top-level rules
        if (!updatedQuery.rules.some((item) => "field" in item)) {
          console.log("All top-level rules deleted, clearing all groups.");
          // Call the clearAll function to remove all groups
          get().clearAll();
        } else {
          // Update state with remaining rules
          set({ query: updatedQuery });
        }
  
        getUserData();
        return;
      }
    }
  
    console.log("Processing group rules deletion with", groupIndex);
  
    // Delete rule from a specific group
    if (Array.isArray(groupIndex) && groupIndex.length === 2) {
      const groupIndex0 = groupIndex[0];
      const ruleIndex = groupIndex[1];
  
      // Ensure we are operating on the correct group
      if (groupIndex0 < updatedQuery.rules.length) {
        const group = updatedQuery.rules[groupIndex0];
        if (isRuleGroupType(group) && ruleIndex < group.rules.length && isRuleType(group.rules[ruleIndex])) {
          console.log("Deleting rule at groupIndex:", groupIndex, "ruleIndex:", ruleIndex);
  
          // Clone the group to ensure immutability
          const updatedGroup = { ...group, rules: [...group.rules] };
          updatedGroup.rules.splice(ruleIndex, 1);
  
          // Replace the updated group in the top-level rules
          updatedQuery.rules[groupIndex0] = updatedGroup;
          set({ query: updatedQuery });
          getUserData();
        } else {
          console.warn("Invalid ruleIndex or group:", groupIndex0, ruleIndex);
        }
      } else {
        console.warn("Invalid groupIndex0:", groupIndex0);
      }
    } else {
      console.warn("Invalid groupIndex format:", groupIndex);
    }
  }
  
}));
