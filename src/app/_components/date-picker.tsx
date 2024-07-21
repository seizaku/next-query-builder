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
  format,
  subDays,
  subHours,
  subMonths,
  subWeeks,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { RuleType } from "react-querybuilder";
import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
import { DateRange } from "react-day-picker";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function CustomDatePicker({
  rule,
  ruleIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
}) {
  const { query, setRuleValue } = QueryBuilderStore();
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    if (date) {
      setRuleValue(ruleIndex, date.toISOString());
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !query?.rules[ruleIndex].value && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {query?.rules[ruleIndex].value ? (
            format(query?.rules[ruleIndex]?.value, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(value) => setDate(value!)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function CustomDateRangePicker({
  rule,
  ruleIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
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
  console.log(date);

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
    handleDateChange();
  }, [unit, data]);

  useEffect(() => {
    setRuleValue(ruleIndex, `${date?.from},${date?.to}`);
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

  const isBetween = ["between", "notBetween"].includes(rule.operator);
  const isLast = ["last", "notLast", "beforeLast"].includes(rule.operator);
  const isNext = ["next"].includes(rule.operator);

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
            {query?.rules[ruleIndex].value && date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
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
