/*  
This is component is for grouping fields into tabs in: 
./rules/rule-panel.tsx 
*/

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
