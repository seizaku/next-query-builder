"use client"

import { defaultOperators } from "react-querybuilder";
import { fields } from "@/components/query-builder/fields-config";


export const customOperators = {
  date: [
    { name: "next", label: "In the next", value: "next" },
    { name: "beforeLast", label: "Before the last", value: "beforeLast" },
    { name: "last", label: "Last", value: "last" },
    { name: "notLast", label: "Not in the last", value: "notLast" },
  ]
}

// Customize operators for each type; otherwise, return the default
export function getOperators(fieldName: string) {
    // Find the field name and get the input type
  const field = fields.find((fld) => fld.name === fieldName);

  switch (field?.datatype || 'text') {
    case "text":
    return [
        { name: "in", label: "Is", value: "in" },
        { name: "notIn", label: "Is not", value: "notIn" },
        { name: "contains", label: "Contains", value: "contains" },
        { name: "doesNotContain", label: "Does not contain", value: "doesNotContain" },
        { name: "notNull", label: "Is set", value: "notNull" },
        { name: "null", label: "Is not set", value: "null" },
      ];
    case "number":
      return [
        { name: "=", label: "Equals", value: "=" },
        { name: "!=", label: "Not Equal", value: "!=" },
        { name: ">", label: "Greater than", value: ">" },
        { name: ">=", label: "Greater than or equal to", value: ">=" },
        { name: "<", label: "Less than", value: "<" },
        { name: "<=", label: "Less than or equal to", value: "<=" },
        { name: "between", label: "Between", value: "between" },
        { name: "notBetween", label: "Not between", value: "notBetween" },
      ];
    case "date":
      return [
        { name: "between", label: "Between", value: "between" },
        { name: "notBetween", label: "Not between", value: "notBetween" },
        { name: "=", label: "On", value: "=" },
        { name: "!=", label: "Not on", value: "!=" },
        { name: "<", label: "Before", value: "<" },
        { name: ">", label: "Since", value: ">" },
        ...customOperators.date
      ];
    }
  return defaultOperators;
}
