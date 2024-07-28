import { Pencil1Icon, PersonIcon } from "@radix-ui/react-icons";

export type Tab = {
  name: string;
  value: string;
  icon?: React.ReactNode;
};

// These tabs will group the fields with values equal to the tab prop and display them in the FieldSelectorPopover component.

export const tabs: Tab[] = [
  {
    name: "All",
    value: "*",
  },
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
