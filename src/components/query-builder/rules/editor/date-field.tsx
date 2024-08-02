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
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { getRuleValue } from "@/lib/helpers/rules";

export function DateField({ groupIndex }: { groupIndex: number[] }) {
  const { query, setRuleValue } = QueryBuilderStore();
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (date) {
      setRuleValue(
        addDays(date, 1)
          .toISOString()
          .slice(0, date.toISOString().indexOf("T")),
        groupIndex,
      );
    }
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getRuleValue(query, groupIndex) || "Pick a Date"}
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
