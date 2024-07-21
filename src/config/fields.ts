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
