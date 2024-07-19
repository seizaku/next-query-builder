"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";

export type User = {
  id: number;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
};

export type Profile = {
  avatar: string;
  company: string;
  zipCode: string;
  country: string;
  state: string;
  city: string;
  age: number;
  sex: string;
  userId: number;
  user: User;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "profile",
    accessorKey: "profile",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const profile = row.getValue("profile") as Profile;
      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback></AvatarFallback>
            <AvatarImage src={profile?.avatar} />
          </Avatar>
          {row.getValue("name")}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: (row) => {
      const date = new Date(`${row.getValue()}`);
      return <div>{moment(date).format("LL")}</div>;
    },
  },
  {
    accessorKey: "profile.age",
    header: "Age",
  },
  {
    accessorKey: "profile.sex",
    header: "Sex",
  },
  {
    accessorKey: "profile.zipCode",
    header: "Zip Code",
  },
  {
    accessorKey: "profile.country",
    header: "Country",
  },
  {
    accessorKey: "profile.city",
    header: "City",
  },
];
