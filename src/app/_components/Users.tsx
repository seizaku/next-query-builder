"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { getRecords } from "@/server/actions/get-records";
import { DataTable } from "./datatable/DataTable";
import { columns } from "./datatable/Columns";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { UserStore } from "@/lib/stores/user-store";
import { formatQuery } from "react-querybuilder";
import { parseRules } from "@/lib/helpers/parse-rules";

import { User, Profile } from "@/types/index";

export function Users({ initialData }: { initialData: Array<User & Profile> }) {
  const { setUserData } = UserStore();
  const { query } = QueryBuilderStore();

  const { isPending, data, mutate } = useMutation({
    mutationFn: getRecords,
  });

  useEffect(() => {
    const formattedQuery = JSON.stringify(
      formatQuery(parseRules(query as any) as any, {
        format: "parameterized",
      }),
    );
    mutate(formattedQuery);
  }, [JSON.stringify(query.rules)]);

  // Set initial record on first server side fetch
  useEffect(() => {
    setUserData(initialData);
  }, [initialData, setUserData]);

  return (
    <DataTable
      isPending={isPending}
      columns={columns}
      data={data || initialData || []}
    />
  );
}
