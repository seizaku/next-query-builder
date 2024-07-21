"use client";
import { RuleType } from "react-querybuilder";
import { CustomFilterControl } from "./custom-filter";
import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
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
import { MagnifyingGlassIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { UserDataStore } from "@/lib/stores/user-data-store";
import { CustomDatePicker, CustomDateRangePicker } from "./date-picker";
import { fields } from "@/config/fields";
import { getOperators } from "@/lib/helpers/get-operators";
import { cn } from "@/lib/utils";

// Custom query builder
export function CustomQueryBuilder() {
  const { query } = QueryBuilderStore();

  return (
    <div className="rounded-xl border p-4">
      <h1 className="p-2 text-xs font-bold uppercase text-muted-foreground">
        All Users
      </h1>
      <div className="flex flex-col px-6">
        {query?.rules.map((rule: RuleType, index: number) => {
          return (
            // Display each query rule
            <div key={`field-${index}`} className="flex items-center gap-2">
              {index == 0 ? (
                <span className="mr-2 w-12 text-end text-sm font-semibold text-muted-foreground">
                  where
                </span>
              ) : (
                <RuleCombinator />
              )}
              <CustomFilterControl rule={rule} ruleIndex={index} />
              <RuleOperators rule={rule} ruleIndex={index} />
              <RuleInputValue rule={rule} ruleIndex={index} />
              <RuleDeleteButton ruleIndex={index} />
            </div>
          );
        })}
        <CustomFilterControl />
      </div>
    </div>
  );
}

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

export function RuleOperators({
  rule,
  ruleIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
}) {
  const { setRuleOperator } = QueryBuilderStore();
  const operators = getOperators(rule.field);

  return (
    <Select onValueChange={(operator) => setRuleOperator(ruleIndex, operator)}>
      <SelectTrigger
        showIcon={false}
        className="w-fit transition-transform ease-in-out hover:border-foreground"
      >
        <SelectValue
          // Display capitalized
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

// Continue on this

export function RuleInputValue({
  rule,
  ruleIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
}) {
  const { setRuleValue } = QueryBuilderStore();
  const field = fields.find((fld) => fld.name === rule.field);

  switch (field?.datatype) {
    case "text":
      return <CustomSelectValue rule={rule} ruleIndex={ruleIndex} />;
    case "number":
      const rangeOperators = ["between", "notBetween"];
      if (rangeOperators.includes(rule.operator)) {
        return <CustomNumberRange ruleIndex={ruleIndex} />;
      } else {
        return (
          <Input
            onBlur={(e) => setRuleValue(ruleIndex, e.currentTarget.value)}
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
        return <CustomDateRangePicker rule={rule} ruleIndex={ruleIndex} />;
      } else {
        return <CustomDatePicker rule={rule} ruleIndex={ruleIndex} />;
      }
  }
}

export function CustomSelectValue({
  rule,
  ruleIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(true);
  const [search, setSearchValue] = useState("");
  const { users } = UserDataStore();
  const { setRuleValue } = QueryBuilderStore();

  function handleSelect(item: any) {
    if (typeof item == "string") {
      setValue(item);
      setRuleValue(ruleIndex, item);
      setOpen(false);
      return;
    } else {
      setValue(
        item[rule.field]?.toString() ||
          item["profile"]?.[rule.field.split(".")?.[1]] ||
          "",
      );
      setRuleValue(
        ruleIndex,
        item[rule.field]?.toString() ||
          item["profile"]?.[rule.field.split(".")?.[1]] ||
          "",
      );
      setOpen(false);
    }
  }

  useEffect(() => {
    setValue("");
  }, [rule.operator]);

  const display =
    rule.operator == "null" || rule.operator == "notNull" ? "hidden" : "block";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("my-2 w-fit", display)}>
          {!!value.length ? value : "Select value"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={"relative ml-48 max-h-[430px] w-[300px] rounded-xl"}
      >
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              onChange={(e) => setSearchValue(e.currentTarget.value)}
              className="rounded-lg pl-10"
              placeholder="Search"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5" />
          </div>
        </div>
        <div className="divided-x mt-2 flex pb-12">
          <ScrollArea className="max-h-[320px] w-full">
            <div className="pt-2">
              {/* If the current field selected is Sex, show only two values */}
              {rule.field == "profile.sex" ? (
                <>
                  <Button
                    onClick={() => {
                      handleSelect("Male");
                      setOpen(false);
                    }}
                    variant={"ghost"}
                    className="w-full justify-start text-xs font-medium"
                  >
                    Male
                  </Button>
                  <Button
                    onClick={() => {
                      handleSelect("Female");
                      setOpen(false);
                    }}
                    variant={"ghost"}
                    className="w-full justify-start text-xs font-medium"
                  >
                    Female
                  </Button>
                </>
              ) : (
                users
                  ?.filter((item: any) => {
                    return (
                      item[rule.field]
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase()) ||
                      item["profile"]?.[rule.field.split(".")?.[1]]
                        ?.toLowerCase()
                        ?.includes(search?.toLowerCase())
                    );
                  })
                  .map((item: any) => (
                    <Button
                      key={item.id} // Ensure each Button has a unique key
                      onClick={() => {
                        handleSelect(item);
                        setOpen(false);
                      }}
                      variant={"ghost"}
                      className="w-full justify-start text-xs font-medium"
                    >
                      {item[rule.field] ||
                        item["profile"]?.[rule.field.split(".")?.[1]] ||
                        ""}
                    </Button>
                  ))
              )}
            </div>
          </ScrollArea>
          <Button
            // Set current value state
            onClick={() => {
              handleSelect(search);
              setOpen(false);
            }}
            size={"lg"}
            className="absolute bottom-0 left-0 w-full rounded-b-xl rounded-t-none"
          >
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function RuleDeleteButton({ ruleIndex }: { ruleIndex: number }) {
  const { deleteRule } = QueryBuilderStore();

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={() => deleteRule(ruleIndex)}
      className="group w-10"
    >
      <TrashIcon className="h-5 w-5 text-muted-foreground group-hover:text-red-500" />
    </Button>
  );
}

export function CustomNumberRange({ ruleIndex }: { ruleIndex: number }) {
  const { setRuleValue } = QueryBuilderStore();
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  useEffect(() => {
    setRuleValue(ruleIndex, `${from}-${to}`);
  }, [from, to]);

  return (
    <>
      <Input
        defaultValue={from}
        type="number"
        onBlur={(e) => setFrom(parseInt(e.currentTarget.value))}
        className="w-24"
      />
      <span className="px-2 text-sm font-medium">and</span>
      <Input
        defaultValue={to}
        type="number"
        onBlur={(e) => setTo(parseInt(e.currentTarget.value))}
        className="w-24"
      />
    </>
  );
}
