"use server";
import { User, Profile } from "@/types/index";
const { sanitize } = require("perfect-express-sanitizer");

interface QueryObject {
  sql: string;
  params: any[];
}

export async function getRecords(query?: string): Promise<(User & Profile)[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`;

  try {
    // Set query to empty string if not provided
    const sanitizedQuery = query ? JSON.parse(query) : { sql: '', params: [] };
    const formattedQuery = formatQuery(sanitizedQuery);

    const options = { xss: true, noSql: true, sql: true, level: 3 };
    const sanitizedInput = sanitize.prepareSanitize(formattedQuery, options);

    // Fetch data from the API
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: query ? formattedQuery : '' }),
    });
    console.log(sanitizedInput);

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

// Format query by replacing placeholders with actual values
function formatQuery(queryObj: QueryObject) {
  let { sql, params } = queryObj;

  // Replace placeholders with actual values from params
  // Assumes that params are properly escaped
  for (let i = 0; i < params.length; i++) {
    let paramPlaceholder = `$${i + 1}`;
    let paramValue = escapeLiteral(params[i]);

    // Replace each placeholder with the corresponding parameter value
    sql = sql.replace(paramPlaceholder, paramValue);
  }

  return sql;
}


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

