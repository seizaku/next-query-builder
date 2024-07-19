"use client";

import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
import { useEffect } from "react";
import { formatQuery } from "react-querybuilder";

export function Query() {
  const { query } = QueryBuilderStore();

  useEffect(() => {
    console.log(formatQuery(query, "sql"));
  }, [query]);

  return (
    <section className="mb-4 rounded-xl border p-4">
      <h1 className="text-sm font-semibold">SQL Query:</h1>
      <p className="mt-2 text-sm">{formatQuery(query, "sql")}</p>
    </section>
  );
}
