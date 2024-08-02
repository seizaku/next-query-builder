"use client";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchRecords } from "@/server/actions/fetch-records";
import { DataTable } from "@/components/tables/data-table";
import { columns } from "./tables/data-table-columns";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { UserStore } from "@/lib/stores/user-store";
import { formatQuery } from "react-querybuilder";
import { parseRules } from "@/lib/helpers/rules";

import { User, Profile } from "@/types/index";

export function Records({
  initialData,
}: {
  initialData: Array<User & Profile>;
}) {
  const { setUserData } = UserStore();
  const { query } = QueryBuilderStore();

  const { isPending, data, mutate } = useMutation({
    mutationFn: fetchRecords,
  });

  const refetch = () => {
    const checkEmptyValues = (array: any) =>
      "rules" in array &&
      array.rules.some(
        (y: any) =>
          "value" in y &&
          (y.value == "" || y.value == undefined || y.value == null),
      );

    const hasEmptyValues = query.rules.length
      ? query.rules.some((x) => checkEmptyValues(x))
      : true;

    if (hasEmptyValues) return;

    const formattedQuery = JSON.stringify(
      formatQuery(parseRules(query as any) as any, {
        format: "parameterized",
      }),
    );
    mutate(formattedQuery);
  };

  useEffect(() => {
    refetch();
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
