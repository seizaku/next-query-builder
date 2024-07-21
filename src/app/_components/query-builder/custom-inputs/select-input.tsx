import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
import { UserDataStore } from "@/lib/stores/user-data-store";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { RuleType } from "react-querybuilder";

export function CustomSelectInput({
  rule,
  ruleIndex,
  groupIndex,
}: {
  rule: RuleType;
  ruleIndex: number;
  groupIndex?: number[];
}) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(true);
  const [search, setSearchValue] = useState("");
  const { users } = UserDataStore();
  const { setRuleValue } = QueryBuilderStore();

  function handleSelect(item: any) {
    if (typeof item == "string") {
      setValue(item);
      setRuleValue(ruleIndex, item, groupIndex ?? undefined);
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
        groupIndex ?? undefined,
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
