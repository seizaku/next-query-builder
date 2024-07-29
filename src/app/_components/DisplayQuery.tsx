"use client";

import { parseRules } from "@/lib/helpers/parse-rules";
import { QueryBuilderStore } from "@/lib/stores/query-store";
import { formatQuery } from "react-querybuilder";

export function Query() {
  const { query } = QueryBuilderStore();

  return (
    <section className="mb-4 rounded-xl border p-4">
      <h1 className="text-sm font-semibold">SQL Query:</h1>
      <pre className="mt-4 text-wrap">
        <p className="mt-2 rounded-xl bg-muted p-4 text-sm">
          {JSON.stringify(
            formatQuery(parseRules(query) as any as any, {
              format: "parameterized",
              paramPrefix: "$",
              numberedParams: true,
            }),
          )}
        </p>
      </pre>
      <pre className="mt-4 text-wrap">
        <p className="mt-2 rounded-xl bg-muted p-4 text-sm">
          {formatQuery(query as any, "json")}
        </p>
      </pre>
    </section>
  );
}
