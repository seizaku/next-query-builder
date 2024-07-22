"use client";

// Import necessary components and hooks
import { isRuleGroupType, RuleType } from "react-querybuilder";
import { CustomFilterControl } from "./custom-filter";
import {
  isRuleType,
  QueryBuilderStore,
} from "@/lib/stores/query-builder-store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  CustomDateInput,
  CustomDateRangeInput,
} from "./custom-inputs/date-input";
import { cn } from "@/lib/utils";
import { CustomNumberRangeInput } from "./custom-inputs/number-input";
import { CustomSelectInput } from "./custom-inputs/select-input";
import { fields } from "@/config/fields";
import { getOperators } from "@/lib/helpers/get-operators";

// Function to render individual rules
const renderRule = (rule: any, index: number, groupIndex?: number) => {
  return (
    <div key={`field-${index}`} className="flex items-center gap-2">
      {/* Display 'where' for the first rule, otherwise show a combinator */}
      {index == 0 ? (
        <span className="mr-2 w-12 text-end text-sm font-semibold text-muted-foreground">
          where
        </span>
      ) : (
        <RuleCombinator />
      )}
      {/* Render filter control, operators, input value, and delete button */}
      <CustomFilterControl
        rule={rule}
        ruleIndex={index}
        groupIndex={groupIndex ? [groupIndex, index] : undefined}
      />
      <RuleOperators
        rule={rule}
        ruleIndex={index}
        groupIndex={groupIndex ? [groupIndex, index] : undefined}
      />
      <RuleInputValue
        rule={rule}
        ruleIndex={index}
        groupIndex={groupIndex ? [groupIndex, index] : undefined}
      />
      <RuleDeleteButton
        ruleIndex={index}
        groupIndex={groupIndex ? [groupIndex, index] : undefined}
      />
    </div>
  );
};

// Main CustomQueryBuilder component
export function CustomQueryBuilder() {
  const { query, setCombinator } = QueryBuilderStore();
  const hasGroupRule = query?.rules.some((item) => "combinator" in item);

  return (
    <>
      <div
        className={cn(
          "rounded-xl border p-4",
          hasGroupRule && "border-b-none rounded-b-none",
        )}
      >
        <h1 className="p-2 text-xs font-bold uppercase text-muted-foreground">
          All Users
        </h1>
        <div className="flex flex-col px-6">
          {/* Render rules that contain a 'field' */}
          {query?.rules.map((rule, index: number) => {
            if (isRuleType(rule)) {
              return renderRule(rule, index, undefined);
            }
          })}
          {/* Render additional filter control */}
          <CustomFilterControl />
        </div>
      </div>
      {query?.rules.map((rule, groupIndex: number) => {
        if (isRuleGroupType(rule)) {
          const isNotLastElement = query?.rules.length - 1 != groupIndex;
          return (
            <div
              key={rule.id}
              className={cn(
                "border-t-none relative rounded-xl rounded-t-none border p-4",
                isNotLastElement && "rounded-b-none",
                "groupCombinator" in rule &&
                  rule.groupCombinator == "or" &&
                  "mt-14 rounded-t-xl border-t",
              )}
            >
              {"groupCombinator" in rule && (
                <div
                  className={cn(
                    "absolute left-0 flex w-full justify-center",
                    "groupCombinator" in rule && rule.groupCombinator == "or"
                      ? "-top-12"
                      : "-top-4",
                  )}
                >
                  <Button
                    onClick={() =>
                      setCombinator(
                        rule.groupCombinator == "or" ? "and" : "or",
                        [groupIndex],
                        true,
                      )
                    }
                    variant={
                      rule.groupCombinator == "or" ? "secondary" : "default"
                    }
                  >
                    {rule.groupCombinator?.toUpperCase()}
                  </Button>
                </div>
              )}
              <h1 className="p-2 text-xs font-bold uppercase text-muted-foreground">
                All Users
              </h1>
              <div className="flex flex-col px-6">
                {/* Render rules within the group */}
                {rule
                  ?.rules!.filter((item) => "field" in item)
                  .map((rule, index: number) => {
                    return renderRule(rule, index, groupIndex);
                  })}
                {/* Render additional filter control for the group */}
                <CustomFilterControl groupIndex={[groupIndex]} />
              </div>
            </div>
          );
        }
      })}
    </>
  );
}

// Component for selecting rule combinator (AND/OR)
export function RuleCombinator() {
  const { query, setCombinator } = QueryBuilderStore();
  return (
    <Select
      onValueChange={(combinator: "and" | "or") => setCombinator(combinator)}
    >
      <SelectTrigger
        showIcon={false}
        className="w-14 justify-end border-0 text-end text-sm font-semibold text-muted-foreground shadow-none hover:bg-muted"
      >
        <SelectValue
          placeholder={query.combinator}
          defaultValue={query.combinator}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={"and"}>and</SelectItem>
          <SelectItem value={"or"}>or</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// Component for selecting rule operator
export function RuleOperators({
  rule,
  ruleIndex,
  groupIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
  groupIndex?: number[];
}) {
  const { setRuleOperator } = QueryBuilderStore();
  const operators = getOperators(rule.field);

  return (
    <Select
      onValueChange={(operator) =>
        setRuleOperator(ruleIndex, operator, groupIndex ?? undefined)
      }
    >
      <SelectTrigger
        showIcon={false}
        className="w-fit transition-transform ease-in-out hover:border-foreground"
      >
        <SelectValue
          placeholder={
            operators[0].label.charAt(0).toUpperCase() +
            operators[0].label.slice(1)
          }
          defaultValue={operators[0].name}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {operators.map((operator) => (
            <SelectItem
              key={operator.name}
              value={operator.name}
              className="capitalize"
            >
              {operator.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

// Component for rendering the input value based on field type
export function RuleInputValue({
  rule,
  ruleIndex,
  groupIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
  groupIndex?: number[];
}) {
  const { setRuleValue } = QueryBuilderStore();
  const field = fields.find((fld) => fld.name === rule.field);

  switch (field?.datatype) {
    case "text":
      return (
        <CustomSelectInput
          rule={rule}
          ruleIndex={ruleIndex}
          groupIndex={groupIndex}
        />
      );
    case "number":
      const rangeOperators = ["between", "notBetween"];
      if (rangeOperators.includes(rule.operator)) {
        return (
          <CustomNumberRangeInput
            ruleIndex={ruleIndex}
            groupIndex={groupIndex}
          />
        );
      } else {
        return (
          <Input
            type="number"
            onBlur={(e) =>
              setRuleValue(ruleIndex, e.currentTarget.value, groupIndex)
            }
            className="w-fit"
          />
        );
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
      if (dateRangeOperators.includes(rule.operator)) {
        return (
          <CustomDateRangeInput
            rule={rule}
            ruleIndex={ruleIndex}
            groupIndex={groupIndex}
          />
        );
      } else {
        return (
          <CustomDateInput
            rule={rule}
            ruleIndex={ruleIndex}
            groupIndex={groupIndex}
          />
        );
      }
  }
}

// Component for the delete button of a rule
export function RuleDeleteButton({
  ruleIndex,
  groupIndex,
}: {
  ruleIndex: number;
  groupIndex?: number[];
}) {
  const { deleteRule } = QueryBuilderStore();

  const deleteRule2 = (ruleIndex: any, groupIndex: any) => {
    console.log(ruleIndex, groupIndex);
    deleteRule(ruleIndex, groupIndex);
  };

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={() => deleteRule2(ruleIndex, groupIndex)}
      className="group w-10 hover:bg-red-50 dark:hover:bg-red-500/5"
    >
      <TrashIcon className="h-5 w-5 text-muted-foreground group-hover:text-red-500" />
    </Button>
  );
}
