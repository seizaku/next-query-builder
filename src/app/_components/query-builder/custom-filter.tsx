"use client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  FrameIcon,
  CalendarIcon,
  LetterCaseCapitalizeIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RuleType } from "react-querybuilder";
import { fields } from "@/config/fields";
import { cn } from "@/lib/utils";
import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
import { useState } from "react";

export const CustomFilterControl = ({
  rule,
  ruleIndex,
  groupIndex,
}: {
  rule?: RuleType;
  ruleIndex?: number;
  groupIndex?: number[];
}) => {
  const [open, setOpen] = useState(false);
  const { addRule, setRuleField, recentField } = QueryBuilderStore();
  const field = fields.find((fld) => fld.name === rule?.field);
  const [search, setSearch] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={field ? "outline" : "ghost"} className="my-2 w-fit">
          {field ? (
            field.label
          ) : (
            <>
              <PlusIcon className="mr-2 h-5" />
              Filter
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "max-h-[430px] w-[520px] rounded-xl",
          field ? "ml-48" : "ml-32",
        )}
      >
        <div className="flex gap-2">
          <div className="relative w-full">
            <Input
              className="rounded-lg bg-muted pl-10"
              onChange={(e) =>
                setSearch(e.currentTarget.value.trim().toLowerCase())
              }
              placeholder="Search"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2 h-5 w-5" />
          </div>
        </div>
        <div className="divided-x mt-4 flex">
          <div className="min-w-28">
            <Button
              variant={"ghost"}
              className="w-full justify-start text-xs font-semibold"
            >
              <LetterCaseCapitalizeIcon className="mr-2 h-3" />
              All
            </Button>
            <Button
              variant={"ghost"}
              className="w-full justify-start text-xs font-semibold"
            >
              <PersonIcon className="mr-2 h-3" />
              User
            </Button>
          </div>
          <ScrollArea className="ml-2 max-h-[320px] w-full border-l px-2">
            <div className="mt-2.5 px-2">
              <h1 className="text-xs font-bold">Recents</h1>
              <div className="py-2">
                {recentField ? (
                  <Button
                    onClick={() => {
                      if (rule) {
                        setRuleField(ruleIndex!, recentField.name, groupIndex);
                      } else {
                        addRule(recentField.name, groupIndex);
                      }
                      setOpen(false);
                    }}
                    variant={"ghost"}
                    className="w-full justify-start text-xs font-medium"
                  >
                    {recentField.datatype == "text" ? (
                      <LetterCaseCapitalizeIcon className="mr-2 h-5" />
                    ) : recentField.datatype == "number" ? (
                      <FrameIcon className="mr-2 h-5" />
                    ) : (
                      <CalendarIcon className="mr-2 h-5" />
                    )}
                    {recentField.label}
                  </Button>
                ) : (
                  <p className="text-xs">No recents yet.</p>
                )}
              </div>
            </div>
            <hr />
            <div className="mt-4 px-2">
              <h1 className="text-xs font-bold">All User Properties</h1>
              <div className="py-2">
                {fields
                  ?.filter((item) =>
                    item.name.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((item) => (
                    <Button
                      onClick={() => {
                        if (rule) {
                          setRuleField(ruleIndex!, item.name, groupIndex);
                        } else {
                          addRule(item.name, groupIndex);
                        }
                        setOpen(false);
                      }}
                      key={`filter-item-${item.name}`}
                      variant={"ghost"}
                      className={cn(
                        "w-full justify-start text-xs font-semibold",
                        field?.name == item.name ? "bg-muted" : "",
                      )}
                    >
                      {item.datatype == "text" ? (
                        <LetterCaseCapitalizeIcon className="mr-2 h-5" />
                      ) : item.datatype == "number" ? (
                        <FrameIcon className="mr-2 h-5" />
                      ) : (
                        <CalendarIcon className="mr-2 h-5" />
                      )}
                      {item.label}
                    </Button>
                  ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
