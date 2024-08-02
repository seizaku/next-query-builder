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
import { cn } from "@/lib/utils";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { RuleGroupType } from "@/types";
import { fields } from "@/components";
import { useState, useMemo } from "react";
import { Pencil1Icon, PersonIcon } from "@radix-ui/react-icons";

export type Tab = {
  name: string;
  value: string;
  icon?: React.ReactNode;
};

export const tabs: Tab[] = [
  { name: "All", value: "*" },
  {
    name: "User",
    value: "user",
    icon: <PersonIcon className="mr-2 h-3" />,
  },
  {
    name: "Profile",
    value: "profile",
    icon: <Pencil1Icon className="mr-2 h-3" />,
  },
];

interface RulePanelProps {
  rule?: RuleGroupType;
  groupIndex: number[];
}

export const RulePanel = ({ rule, groupIndex }: RulePanelProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  const { addRule, setRuleField, recentField } = QueryBuilderStore();
  const field = useMemo(
    () => fields.find((fld) => fld.name === rule?.field),
    [rule?.field],
  );

  const handleTabClick = (tab: Tab) => setCurrentTab(tab);

  const filteredFields = useMemo(() => {
    return fields.filter((item) => {
      if (currentTab.value === "*") {
        return item.name.toLowerCase().includes(search.toLowerCase());
      }
      return item.tab === currentTab.value;
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
            {tabs.map((tab) => (
              <Button
                key={tab.name}
                variant={currentTab.name === tab.name ? "secondary" : "ghost"}
                className="w-full justify-start text-xs font-semibold"
                onClick={() => handleTabClick(tab)}
              >
                {tab.icon ?? <LetterCaseCapitalizeIcon className="mr-2 h-3" />}
                {tab.name.charAt(0).toUpperCase() + tab.name.slice(1)}
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
                    variant="ghost"
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
                    key={`filter-item-${item.name}`}
                    onClick={() => {
                      if (rule) {
                        setRuleField(item.name, groupIndex);
                      } else {
                        addRule(item.name, groupIndex);
                      }
                      setOpen(false);
                    }}
                    variant="ghost"
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
