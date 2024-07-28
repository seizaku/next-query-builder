// app/api/[[...rest]]/route.ts

import { NextPostgrest } from "next-postgrest";

export const { GET, POST, PUT, DELETE, PATCH } = NextPostgrest({
  url: process.env.POSTGREST_URL || "http://localhost:3333",
  basePath: "/api",
});