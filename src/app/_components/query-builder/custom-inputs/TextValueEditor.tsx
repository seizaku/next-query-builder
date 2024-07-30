import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox"; // Import ShadcnUI Checkbox component
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { UserStore } from "@/lib/stores/user-store";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { RuleType } from "react-querybuilder";
import { getRuleValue } from "@/lib/helpers/rules";

export function TextValueEditor({
  rule,
  groupIndex,
}: {
  rule: RuleType;
  groupIndex: number[];
}) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [open, setOpen] = useState(true);
  const [search, setSearchValue] = useState("");
  const { users } = UserStore();
  const { query, setRuleValue } = QueryBuilderStore();

  function handleSelect(item: any) {
    let newValue: string;
    if (typeof item === "string") {
      newValue = item;
    } else {
      newValue = item[rule.field]?.toString();
    }

    // Toggle selection
    setSelectedValues((prevValues) =>
      prevValues.includes(newValue)
        ? prevValues.filter((value) => value !== newValue)
        : [...prevValues, newValue],
    );
  }

  const data = users?.filter((item: any) => {
    return item[rule.field]?.toLowerCase()?.includes(search?.toLowerCase());
  });

  function applySelection() {
    // Update the rule value with the selected values
    if (!data?.length && !selectedValues.some((item) => item == search)) {
      setSelectedValues((prev) => [...prev, search]);
    }
    setRuleValue(selectedValues, groupIndex);
    setOpen(false);
  }

  useEffect(() => {
    // Reset selected values if the rule operator changes
    setSelectedValues([]);
  }, [rule.operator]);

  const display =
    rule.operator === "null" || rule.operator === "notNull"
      ? "hidden"
      : "block";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "my-2 w-fit max-w-full overflow-hidden text-ellipsis",
            display,
          )}
        >
          {getRuleValue(query, groupIndex)?.join(", ") ?? "Select values"}
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
              {rule.field === "sex" ? (
                <>
                  <Button
                    onClick={() => handleSelect("Male")}
                    variant={"ghost"}
                    className="w-full justify-start text-xs font-medium"
                  >
                    <Checkbox
                      checked={selectedValues.includes("Male")}
                      onCheckedChange={() => handleSelect("Male")}
                    />
                    <span className="ml-2">Male</span>
                  </Button>
                  <Button
                    onClick={() => handleSelect("Female")}
                    variant={"ghost"}
                    className="w-full justify-start text-xs font-medium"
                  >
                    <Checkbox
                      checked={selectedValues.includes("Female")}
                      onCheckedChange={() => handleSelect("Female")}
                    />
                    <span className="ml-2">Female</span>
                  </Button>
                </>
              ) : (
                <>
                  {data?.map((item: any, index: number) => (
                    <Button
                      key={`select-${index}`}
                      onClick={() => handleSelect(item)}
                      variant={"ghost"}
                      className="w-full justify-start text-xs font-medium"
                    >
                      <Checkbox
                        checked={selectedValues.includes(
                          item[rule.field]?.toString() || "",
                        )}
                        onCheckedChange={() => handleSelect(item)}
                      />
                      <span className="ml-2">{item[rule.field]}</span>
                    </Button>
                  ))}
                  {!data?.length && (
                    <Button
                      onClick={() => handleSelect(search)}
                      variant={"ghost"}
                      className="w-full justify-start text-xs font-medium"
                    >
                      <Checkbox
                        checked={selectedValues.includes(search)}
                        onCheckedChange={() => handleSelect(search)}
                      />
                      <span className="ml-2">{`Specify: ${search}`}</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
          <Button
            disabled={!selectedValues.length}
            onClick={applySelection}
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
