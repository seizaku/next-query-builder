import { create } from "zustand";
import { UserDataStore } from "./user-data-store";
import { Field, RuleType } from "react-querybuilder";
import { fields } from "@/config/fields";
import { getOperators } from "../helpers/get-operators";

type Query = {
  combinator: "and" | "or";
  rules: RuleType[];
};

type QueryStoreProps = {
  query: Query;
  recentField?: Field;
  addRule: (fieldName: string) => void;
  addGroup: () => void;
  setCombinator: (combinator: "and" | "or") => void;
  setRuleField: (index: number, fieldName: string) => void;
  setRuleOperator: (index: number, operator: string) => void;
  setRuleValue: (index: number, value: string | undefined) => void;
  deleteRule: (index: number) => void;
};

/**
 * Zustand store for managing query builder state.
 */
export const QueryBuilderStore = create<QueryStoreProps>((set, get) => ({
  query: {
    combinator: "and",
    rules: [],
  },
  
  /**
   * Adds a new rule to the query with the specified field name.
   * @param fieldName - The name of the field to add.
   */
  addRule: (fieldName) => {
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;
    query.rules.push({ field: fieldName, operator, value: "" });
    set({ query, recentField: fields.find((field) => field.name==fieldName) });
  },

  addGroup: (groupIndex = []) => {
    // const query = get().query;
    // const newGroup: RuleGroupType = { combinator: "and", rules: [] };

    // if (groupIndex.length === 0) {
    //   query.rules.push(newGroup);
    // } else {
    //   updateGroup(query, groupIndex, (group) => {
    //     group.rules.push(newGroup);
    //   });
    // }

    // set({ query });
  },

  /**
   * Sets the combinator (AND/OR) for the query.
   * @param combinator - The combinator to set.
   */
  setCombinator: (combinator) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;
    query.combinator = combinator;
    set({ query });
    getUserData();
  },
  
  /**
   * Sets the field for a specific rule at the given index.
   * @param index - The index of the rule to update.
   * @param fieldName - The name of the field to set.
   */
  setRuleField: (index, fieldName) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;
    query.rules[index] = { field: fieldName, operator, value: undefined };
    set({ query, recentField: fields.find((field) => field.name==fieldName) });
    getUserData();
  },
  
  /**
   * Sets the operator for a specific rule at the given index.
   * @param index - The index of the rule to update.
   * @param operator - The operator to set.
   */
  setRuleOperator: (index, operator) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;
    query.rules[index].operator = operator;
    query.rules[index].value = undefined;
    set({ query });
    getUserData();
  },
  
  /**
   * Sets the value for a specific rule at the given index.
   * @param index - The index of the rule to update.
   * @param value - The value to set.
   */
  setRuleValue: (index, value) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;
    if (query.rules[index].value !== value) {
      query.rules[index].value = value;
      set({ query });
    }
    getUserData();
  },
  
  /**
   * Deletes a rule from the query at the given index.
   * @param index - The index of the rule to delete.
   */
  deleteRule: (index: number) => {
    const { getUserData } = UserDataStore.getState();
    const query = get().query;
    query.rules.splice(index, 1);
    set({ query });
    getUserData();
  },
}));
