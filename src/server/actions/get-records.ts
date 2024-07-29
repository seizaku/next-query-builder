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

    console.log( sanitizedQuery)
    if (!res.ok) {
      console.error(`Error fetching users: ${res.statusText} (Status Code: ${res.status})`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
}



// Prevent SQL injection
function escapeLiteral(str: string) {
  var hasBackslash = false;
  var escaped = "'";

  for (var i = 0; i < str.length; i++) {
    var c = str[i];
    if (c === "'") {
      escaped += c + c; // Escapes single quotes
    } else if (c === '\\') {
      escaped += c + c; // Escapes backslashes
      hasBackslash = true;
    } else {
      escaped += c;
    }
  }

  escaped += "'";

  if (hasBackslash === true) {
    escaped = ' E' + escaped; // Prefix with E for escape sequences if there are backslashes
  }

  return escaped;
}

