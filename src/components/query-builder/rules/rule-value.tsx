import { fields } from "@/components/index";
import { NumberField } from "./editor/number-field";
import { RangedNumberField } from "./editor/number-range-field";
import { TextField } from "./editor/text-field";
import { DateField } from "./editor/date-field";
import { DateRangeField } from "./editor/date-range-field";
import { RuleGroupType } from "@/types";

interface RuleValue {
  rule: RuleGroupType;
  groupIndex: number[];
}

export function RuleValue({ rule, groupIndex }: RuleValue) {
  const field = fields.find((fld) => fld.name === rule.field);

  switch (field?.datatype) {
    case "text":
      return <TextField rule={rule} groupIndex={groupIndex} />;
    case "number":
      const rangeOperators = ["between", "notBetween"];
      if (rangeOperators.includes(rule.operator!)) {
        return <RangedNumberField groupIndex={groupIndex} />;
      } else {
        return <NumberField groupIndex={groupIndex} />;
      }
    case "date":
      const dateRangeOperators = [
        "between",
        "notBetween",
        "last",
        "notLast",
        "beforeLast",
        "next",
      ];
      if (dateRangeOperators.includes(rule.operator!)) {
        return <DateRangeField rule={rule} groupIndex={groupIndex} />;
      } else {
        return <DateField groupIndex={groupIndex} />;
      }
  }
}
