import { create } from "zustand";
import { fields, getOperators } from "@/app/_components/query-builder";

type QueryStoreProps = {
  query?: any;
  addRule: (fieldName: string) => void;
  setCombinator: (combinator: "and" | "or") => void;
  setRuleField: (index: number, fieldName: string) => void;
  setRuleOperator: (index: number, operator: string) => void;
  setRuleValue: (index: number, value: string) => void;
  deleteRule: (index: number) => void;
};

export const QueryBuilderStore = create<QueryStoreProps>((set, get) => ({
  query: {
    combinator: "and",
    rules: [],
  },
  addRule: (fieldName) => {
    const field = fields.find((item) => item.name === fieldName);
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;
    switch (field?.inputType) {
      case "text":
        query.rules.push({ field: fieldName, operator, value: "" });
        break;
    }
    set({
      query,
    });
  },
  setCombinator: (combinator) => {
    const query = get().query;
    query.combinator = combinator;
    set({
      query,
    });
  },
  setRuleField: (index, fieldName) => {
    const query = get().query;
    const operator = getOperators(fieldName)[0].name;
    query.rules[index] = { field: fieldName, operator, value: "" };
    set({
      query,
    });
  },
  setRuleOperator: (index, operator) => {
    const query = get().query;
    query.rules[index].operator = operator;
    set({
      query,
    });
  },
  setRuleValue: (index, value) => {
    const query = get().query;
    query.rules[index].value = value;
    set({
      query,
    });
  },
  deleteRule: (index: number) => {
    const query = get().query;
    query.rules.splice(index, 1);
    set({
      query,
    });
  },
}));
