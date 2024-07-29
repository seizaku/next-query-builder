"use client";

import { isRuleGroupType, RuleType } from "react-querybuilder";
import { FieldSelectorPopover } from "./FieldSelectorPopover";
import { isRuleType, QueryBuilderStore } from "@/lib/stores/query-store";
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
  DateValueEditor,
  DateRangeValueEditor,
} from "./custom-inputs/DateValueEditor";
import { cn } from "@/lib/utils";
import { NumberValueEditor } from "./custom-inputs/NumberValueEditor";
import { TextValueEditor } from "./custom-inputs/TextValueEditor";
import { fields } from "@/config/fields";
import { getOperators } from "@/config/operators";
import { useEffect } from "react";

// Function to render individual rules
const renderRule = (rule: any, index: number, groupIndex: number) => {
  return (
    <div key={`field-${index}`} className="flex flex-wrap items-center gap-2">
      {/* Display 'where' for the first rule, otherwise show a combinator */}
      {index == 0 ? (
        <span className="mr-2 w-12 text-end text-sm font-semibold text-muted-foreground">
          where
        </span>
      ) : (
        <RuleCombinator groupIndex={[groupIndex]} />
      )}
      {/* Render filter control, operators, input value, and delete button */}
      <FieldSelectorPopover rule={rule} groupIndex={[groupIndex, index]} />
      <RuleOperators rule={rule} groupIndex={[groupIndex, index]} />
      <RuleInputValue rule={rule} groupIndex={[groupIndex, index]} />
      <RuleDeleteButton groupIndex={[groupIndex, index]} />
    </div>
  );
};

// Main CustomQueryBuilder component
export function CustomQueryBuilder() {
  const { query, setGroupCombinator } = QueryBuilderStore();

  return (
    <>
      {query?.rules.filter(isRuleGroupType).map((rule, groupIndex) => {
        const isNotLastElement = query?.rules.length - 1 != groupIndex;
        const nextGroupCombinatorIsOr =
          (query.rules[groupIndex + 1] as any)?.groupCombinator === "or";

        const getBorderRadiusClass = () =>
          cn(
            "border-t-none relative rounded-xl rounded-t-none border p-4",
            isNotLastElement && "rounded-b-none",
            "groupCombinator" in rule &&
              rule.groupCombinator == "or" &&
              "mt-14 rounded-t-xl border-t",
            groupIndex == 0 && "rounded-t-xl",
          );

        const getCombinatorClass = () =>
          "groupCombinator" in rule && rule.groupCombinator === "or"
            ? "mt-14 rounded-t-xl border-t"
            : "";

        const getButtonClass = () =>
          "groupCombinator" in rule && rule.groupCombinator === "or"
            ? "secondary"
            : "default";

        const getButtonPositionClass = () =>
          "groupCombinator" in rule && rule.groupCombinator === "or"
            ? "-top-12"
            : "-top-4";

        return (
          <div
            key={`group-${groupIndex}`}
            className={cn(
              "border-t-none relative rounded-xl border p-4",
              getBorderRadiusClass(),
              getCombinatorClass(),
              nextGroupCombinatorIsOr && "rounded-b-xl",
            )}
          >
            {"groupCombinator" in rule && (
              <div
                className={cn(
                  "absolute left-0 flex w-full justify-center",
                  getButtonPositionClass(),
                )}
              >
                <Button
                  onClick={() =>
                    setGroupCombinator(
                      rule.groupCombinator === "or" ? "and" : "or",
                      [groupIndex],
                    )
                  }
                  variant={getButtonClass()}
                >
                  {rule.groupCombinator?.toUpperCase()}
                </Button>
              </div>
            )}
            <h1 className="p-2 text-xs font-bold uppercase text-muted-foreground">
              All Users
            </h1>
            <div className="flex flex-col px-6">
              {"rules" in rule &&
                rule.rules
                  ?.filter((item) => "field" in item)
                  .map((innerRule, index) =>
                    renderRule(innerRule, index, groupIndex),
                  )}
              <FieldSelectorPopover groupIndex={[groupIndex]} />
            </div>
          </div>
        );
      })}
    </>
  );
}

// Component for selecting rule combinator (AND/OR)
export function RuleCombinator({ groupIndex }: { groupIndex: number[] }) {
  const { query, setCombinator } = QueryBuilderStore();

  return (
    <Select
      onValueChange={(combinator: "and" | "or") =>
        setCombinator(combinator, groupIndex)
      }
    >
      <SelectTrigger
        showIcon={false}
        className="w-14 justify-end border-0 text-end text-sm font-semibold text-muted-foreground shadow-none hover:bg-muted"
      >
        <SelectValue
          placeholder={(query.rules[groupIndex[0]] as any)?.combinator}
          defaultValue={(query.rules[groupIndex[0]] as any)?.combinator}
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
  groupIndex,
}: {
  rule: RuleType;
  groupIndex: number[];
}) {
  const { setRuleOperator } = QueryBuilderStore();
  const operators = getOperators(rule.field);

  return (
    <Select
      onValueChange={(operator) => {
        setRuleOperator(operator, groupIndex);
      }}
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
          {operators.map((operator, index) => (
            <SelectItem
              key={`${operator.name}-${index}`}
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
  groupIndex,
}: {
  rule: RuleType;
  groupIndex: number[];
}) {
  const { setRuleValue } = QueryBuilderStore();
  const field = fields.find((fld) => fld.name === rule.field);

  switch (field?.datatype) {
    case "text":
      return <TextValueEditor rule={rule} groupIndex={groupIndex} />;
    case "number":
      const rangeOperators = ["between", "notBetween"];
      if (rangeOperators.includes(rule.operator)) {
        return <NumberValueEditor groupIndex={groupIndex} />;
      } else {
        return (
          <Input
            type="number"
            onBlur={(e) => setRuleValue(e.currentTarget.value, groupIndex)}
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
        return <DateRangeValueEditor rule={rule} groupIndex={groupIndex} />;
      } else {
        return <DateValueEditor rule={rule} groupIndex={groupIndex} />;
      }
  }
}

// Component for the delete button of a rule
export function RuleDeleteButton({ groupIndex }: { groupIndex: number[] }) {
  const { deleteRule } = QueryBuilderStore();

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={() => deleteRule(groupIndex)}
      className="group w-10 hover:bg-red-50 dark:hover:bg-red-500/5"
    >
      <TrashIcon className="h-5 w-5 text-muted-foreground group-hover:text-red-500" />
    </Button>
  );
}
