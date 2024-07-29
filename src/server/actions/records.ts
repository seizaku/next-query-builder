import { User, Profile } from "@/types/index";

interface QueryObject {
  sql: string;
  params: any[];
}

export async function getRecords(query?: string): Promise<(User & Profile)[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query ? sanitizeQuery(JSON.parse(query)) : '',
      }),
      cache: 'no-cache'
    });

    if (!res.ok) {
      console.error(`Error fetching users: ${res.statusText} (Status Code: ${res.status})`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

// Format query
function sanitizeQuery(queryObj: QueryObject) {
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

