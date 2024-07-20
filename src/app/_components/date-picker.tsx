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
          selected={query?.rules[ruleIndex]?.value}
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

  async function handleDateChange() {
    switch (unit) {
      case "hours":
        setDate({
          from: subHours(new Date(), data),
          to: new Date(),
        });
        break;
      case "days":
        setDate({
          from: subDays(new Date(), data),
          to: new Date(),
        });
        break;
      case "weeks":
        setDate({
          from: subWeeks(new Date(), data),
          to: new Date(),
        });
        break;
      case "months":
        setDate({
          from: subMonths(new Date(), data),
          to: new Date(),
        });
        break;
    }
  }

  useEffect(() => {
    handleDateChange();
  }, [unit, data]);

  useEffect(() => {
    setRuleValue(
      ruleIndex,
      date?.from
        ? `${date?.from?.toISOString()},${date?.to?.toISOString()}`
        : undefined,
    );
  }, [date]);

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
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex w-1/2 gap-2 p-2">
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
          <Calendar
            initialFocus
            mode="range"
            selected={date}
            onSelect={(e) => {
              setDate(e);
              if (e?.from && e.to) {
                setData(
                  differenceInDays(
                    e?.from > e.to ? e.from : e.to,
                    e?.from < e.to ? e.from : e.to,
                  ),
                );
              } else {
                setData(0);
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
