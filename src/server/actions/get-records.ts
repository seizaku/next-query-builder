"use server";
import { User, Profile } from "@/types/index";
var sanitize = require('sqlstring');

interface QueryObject {
  sql: string;
  params: any[];
}

export async function getRecords(query?: string): Promise<(User & Profile)[]> {
  try {
    let parsedQuery: QueryObject = { sql: '', params: [] };
    if (query) {
      try {
        parsedQuery = JSON.parse(query);
      } catch (parseError) {
        console.error('Failed to parse query:', parseError);
        return [];
      }
    }
    
    const sanitizedQuery = sanitize.format(parsedQuery?.sql, [...parsedQuery?.params]);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`, {
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

    if (typeof data === 'object' && data !== null) {
      return data;
    } else {
      console.error('Invalid JSON response:', data);
      return [];
    }

  } catch (error) {
    return [];
  }
}
