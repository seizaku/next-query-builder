"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  differenceInDays,
  subDays,
  subHours,
  subMonths,
  subWeeks,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { DateRange } from "react-day-picker";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getRuleValue } from "@/lib/helpers/rules";
import { RuleGroupType } from "@/types";

export function DateRangeField({
  rule,
  groupIndex,
}: {
  rule: RuleGroupType;
  groupIndex: number[];
}) {
  const { query, setRuleValue } = QueryBuilderStore();
  // Set default date range to 7 days
  const [unit, setUnit] = useState<"hours" | "days" | "weeks" | "months">(
    "days",
  );
  const [data, setData] = useState(7);
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  async function handleDateChange() {
    switch (unit) {
      case "hours":
        rule.operator !== "next"
          ? setDate({
              from: subHours(new Date(), data),
              to: new Date(),
            })
          : setDate({
              from: new Date(),
              to: addHours(new Date(), data),
            });
        break;
      case "days":
        rule.operator !== "next"
          ? setDate({
              from: subDays(new Date(), data),
              to: new Date(),
            })
          : setDate({
              from: new Date(),
              to: addDays(new Date(), data),
            });
        break;
      case "weeks":
        rule.operator !== "next"
          ? setDate({
              from: subWeeks(new Date(), data),
              to: new Date(),
            })
          : setDate({
              from: new Date(),
              to: addWeeks(new Date(), data),
            });
        break;
      case "months":
        rule.operator !== "next"
          ? setDate({
              from: subMonths(new Date(), data),
              to: new Date(),
            })
          : setDate({
              from: new Date(),
              to: addMonths(new Date(), data),
            });
        break;
    }
  }

  useEffect(() => {
    if (rule.operator !== "notBetween" && rule.operator !== "between") {
      handleDateChange();
    }
  }, [unit, data]);

  useEffect(() => {
    setRuleValue(
      `${
        date?.from
          ?.toISOString()
          .slice(0, date.from?.toISOString().indexOf("T")) ||
        subDays(new Date(), 7)
      },${
        date?.to?.toISOString().slice(0, date.to?.toISOString().indexOf("T")) ||
        subDays(new Date(), 7)
      }`,
      groupIndex,
    );
  }, [date]);

  useEffect(() => {
    const updateDate = () => {
      if (rule.operator == "next") {
        setDate({
          from: new Date(),
          to: addDays(new Date(), 7),
        });
        handleDateChange();
      }
    };
    updateDate();
  }, []);

  const isBetween = ["between", "notBetween"].includes(rule.operator!);
  const isLast = ["last", "notLast", "beforeLast"].includes(rule.operator!);
  const isNext = ["next"].includes(rule.operator!);

  return (
    <div className={cn("grid gap-2")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {getRuleValue(query, groupIndex)?.includes(",")
              ? getRuleValue(query, groupIndex)?.split(",").join(" - ")
              : getRuleValue(query, groupIndex) || "Pick a Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("p-0", isBetween ? "w-auto" : "w-64")}
          align="start"
        >
          {!isBetween && (
            <div className="flex w-full gap-2 p-2">
              <Input
                type="number"
                value={data}
                min={0}
                onChange={(e) => {
                  setData(parseInt(e.currentTarget.value) || 0);
                  handleDateChange();
                }}
              />
              <Select
                onValueChange={(value) => {
                  setUnit(value as "hours" | "days" | "weeks" | "months");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Days" defaultValue={"days"} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Calendar
            disabled={
              isNext
                ? { before: new Date() }
                : isLast
                  ? { after: new Date() }
                  : undefined
            }
            initialFocus
            mode="range"
            selected={date}
            onSelect={(e) => {
              setDate(e);
              if (e?.from && e?.to) {
                setData(
                  differenceInDays(
                    e?.from > e.to ? e.from : e.to,
                    e?.from < e.to ? e.from : e.to,
                  ),
                );
              } else {
                setData(1);
              }
            }}
            numberOfMonths={isBetween ? 2 : 1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
