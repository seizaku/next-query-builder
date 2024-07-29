
interface QueryObject {
  sql: string;
  params: any[];
}

// Format query
export function sanitizeQuery(queryObj: QueryObject) {
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
export function escapeLiteral(str: string) {
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

