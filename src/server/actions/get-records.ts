"use server";
import { User, Profile } from "@/types/index";
var sanitize = require('sqlstring');

interface QueryObject {
  sql: string;
  params: any[];
}

export async function getRecords(query?: string): Promise<(User & Profile)[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`;

  try {
    // Set query to empty string if not provided
    const parsedQuery = query ? JSON.parse(query) : { sql: '', params: [] };
    const sanitizedQuery = sanitize.format(parsedQuery?.sql, [...parsedQuery?.params]);

    // Fetch data from the API
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: sanitizedQuery }),
    });

    if (!res.ok) {
      return [];
    }
    
    const data = await res.json();
    
    return data;
  } catch (error) {
    return [];
  }
}
