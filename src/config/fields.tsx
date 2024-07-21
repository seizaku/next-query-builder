import { Pencil1Icon, PersonIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { Field } from "react-querybuilder";

// This contains all the fields that can be queried
export const fields: Field[] = [
  {
    name: "name",
    label: "Name",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "email",
    label: "Email",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "profile.avatar",
    label: "AvatarURL",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "profile.company",
    label: "Company",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "profile.age",
    label: "Age",
    datatype: "number",
    inputType: "number",
  },
  {
    name: "profile.sex",
    label: "Sex",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "profile.zipCode",
    label: "Zip Code",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "profile.country",
    label: "Country",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "profile.state",
    label: "State",
    datatype: "text",
    inputType: "text",
  },
  {
    name: "createdAt",
    label: "Created",
    datatype: "date",
    inputType: "date",
  },
  {
    name: "updatedAt",
    label: "Updated",
    datatype: "date",
    inputType: "date",
  },
];

export type Tab = {
  name: string;
  prefix: string;
  icon?: ReactNode;
};

export const tabs: Tab[] = [
  {
    name: "All",
    prefix: "*",
  },
  {
    name: "User",
    prefix: "",
    icon: <PersonIcon className="mr-2 h-3" />,
  },
  {
    name: "Profile",
    prefix: "profile",
    icon: <Pencil1Icon className="mr-2 h-3" />,
  },
];
