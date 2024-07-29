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
  FrameIcon,
  CalendarIcon,
  LetterCaseCapitalizeIcon,
} from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RuleType } from "react-querybuilder";
import { fields } from "@/config/fields";
import { tabs } from "@/config/tabs";
import { cn } from "@/lib/utils";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { useState, useMemo } from "react";

export const FieldSelectorPopover = ({
  rule,
  groupIndex,
}: {
  rule?: RuleType;
  groupIndex: number[];
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  const { addRule, setRuleField, recentField } = QueryBuilderStore();
  const field = useMemo(
    () => fields.find((fld) => fld.name === rule?.field),
    [rule?.field],
  );

  const handleTabClick = (tab: (typeof tabs)[0]) => setCurrentTab(tab);

  const filteredFields = useMemo(() => {
    return fields.filter((item) => {
      if (currentTab.value == "*") {
        return item.name.toLowerCase().includes(search.toLowerCase());
      }

      return item.tab == currentTab.value;
    });
  }, [currentTab.value, search]);

  const renderIcon = (datatype: string) => {
    switch (datatype) {
      case "text":
        return <LetterCaseCapitalizeIcon className="mr-2 h-5" />;
      case "number":
        return <FrameIcon className="mr-2 h-5" />;
      case "date":
        return <CalendarIcon className="mr-2 h-5" />;
      default:
        return null;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={field ? "outline" : "ghost"} className="my-2 w-fit">
          {field ? (
            field.label
          ) : (
            <>
              <PlusIcon className="mr-2 h-5" /> Filter
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
            {tabs.map((category) => (
              <Button
                key={category.name}
                variant={
                  currentTab.name === category.name ? "secondary" : "ghost"
                }
                className="w-full justify-start text-xs font-semibold"
                onClick={() => handleTabClick(category)}
              >
                {category.icon ?? (
                  <LetterCaseCapitalizeIcon className="mr-2 h-3" />
                )}
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
              </Button>
            ))}
          </div>
          <ScrollArea className="ml-2 h-[320px] w-full border-l px-2">
            <div className="mt-2.5 px-2">
              <h1 className="text-xs font-bold">Recents</h1>
              <div className="py-2">
                {recentField ? (
                  <Button
                    onClick={() => {
                      if (rule) {
                        setRuleField(recentField.name, groupIndex);
                      } else {
                        addRule(recentField.name, groupIndex);
                      }
                      setOpen(false);
                    }}
                    variant={"ghost"}
                    className="w-full justify-start text-xs font-medium"
                  >
                    {renderIcon(recentField.datatype as string)}
                    {recentField.label}
                  </Button>
                ) : (
                  <p className="text-xs">No recents yet.</p>
                )}
              </div>
            </div>
            <hr />
            <div className="mt-4 px-2">
              <h1 className="text-xs font-bold">
                {currentTab.name === "All"
                  ? "All Properties"
                  : `${currentTab.name.charAt(0).toUpperCase() + currentTab.name.slice(1)} Properties`}
              </h1>
              <div className="py-2">
                {filteredFields.map((item) => (
                  <Button
                    onClick={() => {
                      if (rule) {
                        setRuleField(item.name, groupIndex);
                      } else {
                        addRule(item.name, groupIndex);
                      }
                      setOpen(false);
                    }}
                    key={`filter-item-${item.name}`}
                    variant={"ghost"}
                    className={cn(
                      "w-full justify-start text-xs font-semibold",
                      field?.name === item.name ? "bg-muted" : "",
                    )}
                  >
                    {renderIcon(item.datatype as string)}
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
