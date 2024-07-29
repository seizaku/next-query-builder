"use client";
import { useQuery } from "@tanstack/react-query";
import { getRecords } from "@/server/actions/records";
import { DataTable } from "./datatable/DataTable";
import { columns } from "./datatable/Columns";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { formatQuery, RuleType } from "react-querybuilder";
import { UserStore } from "@/lib/stores/user-store";
import { useEffect } from "react";
import { User, Profile } from "@/types/index";
import { parseRules } from "@/lib/helpers/parse-rules";

export function Users({ initialData }: { initialData: Array<User & Profile> }) {
  const { setUserData, setRefetchCallback } = UserStore();
  const { query } = QueryBuilderStore();

  useEffect(() => {
    setUserData(initialData);
  }, [initialData, setUserData]);

  const { isRefetching, data, refetch } = useQuery({
    queryKey: ["user_profiles", query],
    queryFn: () =>
      getRecords(
        JSON.stringify(
          formatQuery(parseRules(query) as any as any, {
            format: "parameterized",
            paramPrefix: "$",
            numberedParams: true,
          }),
        ),
      ),
    initialData,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setRefetchCallback(refetch);
  }, [refetch, setRefetchCallback]);

  return <DataTable isPending={isRefetching} columns={columns} data={data} />;
}