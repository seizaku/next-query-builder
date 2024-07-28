import { Field } from "react-querybuilder";

// This contains all the fields that can be queried

const user: Field[] = [
  {
    tab: "user",
    name: "name",
    label: "Name",
    datatype: "text",
    inputType: "text",
  },
  {
    tab: "user",
    name: "email",
    label: "Email",
    datatype: "text",
    inputType: "text",
  },
  {
    tab: "user",
    name: "DATE(updated_at)",
    label: "Updated",
    datatype: "date",
    inputType: "date",
  },
  {
    tab: "user",
    name: "DATE(created_at)",
    label: "Created",
    datatype: "date",
    inputType: "date",
  },
];

const profile: Field[] = [
  {
    tab: "profile",
    name: "avatar",
    label: "AvatarURL",
    datatype: "text",
    inputType: "text",
  },
  {
    tab: "profile",
    name: "company",
    label: "Company",
    datatype: "text",
    inputType: "text",
  },
  {
    tab: "profile",
    name: "age",
    label: "Age",
    datatype: "number",
    inputType: "number",
  },
  {
    tab: "profile",
    name: "sex",
    label: "Sex",
    datatype: "text",
    inputType: "text",
  },
  {
    tab: "profile",
    name: "zip_code",
    label: "Zip Code",
    datatype: "text",
    inputType: "text",
  },
  {
    tab: "profile",
    name: "country",
    label: "Country",
    datatype: "text",
    inputType: "text",
  },
  {
    tab: "profile",
    name: "state",
    label: "State",
    datatype: "text",
    inputType: "text",
  },
];

export const fields: Field[] = [...user, ...profile];
