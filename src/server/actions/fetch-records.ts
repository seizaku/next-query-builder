"use server";
import { User, Profile } from "@/types/index";
var sanitize = require('sqlstring');

interface QueryObject {
  sql: string;
  params: any[];
}

export async function fetchRecords(query?: string): Promise<(User & Profile)[]> {
  try {
    let parsedQuery: QueryObject = { sql: '', params: [] };
    if (query) {
      parsedQuery = JSON.parse(query);
    }
    
    const sanitizedQuery = sanitize.format(parsedQuery.sql, parsedQuery.params);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: sanitizedQuery }),
    });

    if (!res.ok) {
      console.error('Failed to fetch records:', res.statusText);
      return [];
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching records:', error);
    return [];
  }
}