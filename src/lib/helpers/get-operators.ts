import { defaultOperators } from "react-querybuilder";
import { fields } from "@/config/fields";

// Customize operators for each type; otherwise, return the default
export function getOperators(fieldName: string) {
  // Find the field name and get the input type
  const field = fields.find((fld) => fld.name === fieldName);
  switch (field?.datatype) {
    case "text":
      return [
        { name: "=", label: "Is" },
        { name: "!=", label: "Is not" },
        { name: "contains", label: "Contains" },
        { name: "doesNotContain", label: "Does not contain" },
        { name: "notNull", label: "Is set" },
        { name: "null", label: "Is not set" },
      ];
    case "number":
      return [
        { name: "=", label: "Equals" },
        { name: "!=", label: "Not Equal" },
        { name: ">", label: "Greater than" },
        { name: ">=", label: "Greater than or equal to" },
        { name: "<", label: "Less than" },
        { name: "<=", label: "Less than or equal to" },
        { name: "between", label: "Between" },
        { name: "notBetween", label: "Not between" },
      ];
    case "date":
      return [
        { name: "last", label: "Last" },
        { name: "notLast", label: "Not in the last" },
        { name: "between", label: "Between" },
        { name: "notBetween", label: "Not between" },
        { name: "=", label: "On" },
        { name: "!=", label: "Not on" },
        { name: "beforeLast", label: "Before the last" },
        { name: "<", label: "Before" },
        { name: "since", label: "Since" },
        { name: "next", label: "In the next" },
      ];
  }
  return defaultOperators;
}