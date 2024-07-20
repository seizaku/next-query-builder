"use client";

import prisma from "@/lib/db/client";
import { QueryBuilderStore } from "@/lib/stores/query-builder-store";
import { useEffect } from "react";
import { formatQuery } from "react-querybuilder";
import { User } from "./columns";
import { UserDataStore } from "@/lib/stores/user-data-store";

export function Query() {
  const { query } = QueryBuilderStore();

  return (
    <section className="mb-4 rounded-xl border p-4">
      <h1 className="text-sm font-semibold">SQL Query:</h1>
      <pre>
        <p className="mt-2 rounded-xl bg-muted p-4 text-sm">
          {formatQuery(query, "json")}
        </p>
      </pre>
    </section>
  );
}
