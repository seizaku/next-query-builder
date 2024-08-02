# Next.js Custom Query Builder

This repository contains a Next.js project featuring a custom query builder. It provides an intuitive interface for managing complex queries with dynamic filters, date pickers, and search features.

You can see a live demo at https://seizaku-query-builder.vercel.app/

## Project Structure
   ```
   .
   ├── postgres
   │   └── init.sql
   ├── src
   │   ├── app
   │   │   ├── favicon.ico
   │   │   ├── layout.tsx
   │   │   └── page.tsx
   │   │
   │   ├── components
   │   │   ├── query-builder
   │   │   │   ├── rules
   │   │   │   │   ├── editor 
   │   │   │   │   │   ├── date-field.tsx
   │   │   │   │   │   ├── date-range-field.tsx
   │   │   │   │   │   ├── number-field.tsx
   │   │   │   │   │   ├── number-range-field.tsx
   │   │   │   │   │   └── text-field.tsx
   │   │   │   │   │
   │   │   │   │   ├── rule-combinator.tsx
   │   │   │   │   ├── rule-delete.tsx
   │   │   │   │   ├── rule-group-actions.tsx
   │   │   │   │   ├── rule-operator.tsx
   │   │   │   │   ├── rule-panel.tsx
   │   │   │   │   ├── rule-value.tsx
   │   │   │   │   └── rule.tsx
   │   │   │   │
   │   │   │   ├── fields-config.ts
   │   │   │   ├── operators.ts
   │   │   │   ├── query-builder.tsx
   │   │   │   └── panel-tabs.tsx
   │   │   │
   │   │   └── records.tsx
   │   │
   │   ├── lib
   │   │   └── stores
   │   │       ├── query-store.ts
   │   │       └── record-store.ts     
   │   └── server
   │       └── actions
   │           └── fetch-records.ts 
   │               
   │  
   ├── .env.example
   └── docker-compose.yml
```

### Usage

| File/Folder                | Description                                                                                           |
|----------------------------|-------------------------------------------------------------------------------------------------------|
| **`fields-config.ts`**     | Maps and configures database fields for the query builder. Update to modify or add fields.|
| **`panel-tabs.tsx`**             | Defines and organizes fields into tabs for the rule panel.                                                  |
| **`init.sql`**             | Defines and populates the PostgreSQL database.                                                  |


`fetch-records.ts`
   ``` javascript
export async function fetchRecords(query?: string): Promise<(User & Profile)[]> {
  try {
    let parsedQuery: QueryObject = { sql: '', params: [] };
    if (query) {
      parsedQuery = JSON.parse(query);
    }
    
    const sanitizedQuery = sanitize.format(parsedQuery.sql, parsedQuery.params);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`, {
      cache: 'no-cache',
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
```

`init.sql`

Define Schema
   ``` sql
CREATE TYPE gender AS ENUM ('Male', 'Female');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    avatar VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    user_id INT UNIQUE NOT NULL,
    age INT NOT NULL,
    sex gender NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
        REFERENCES users (id)
);
```

Create view
   ``` sql
CREATE VIEW user_profiles AS
SELECT users.*, profiles.*
FROM users
JOIN profiles ON users.id = profiles.user_id;
```

Create RPC function (Sanitized Query Parameter)
``` sql
CREATE OR REPLACE FUNCTION query(q TEXT DEFAULT '')
RETURNS SETOF user_profiles AS $$
BEGIN
    IF q = '' THEN
        RETURN QUERY SELECT * FROM user_profiles;
    ELSE
        RETURN QUERY EXECUTE 'SELECT * FROM user_profiles WHERE ' || q;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

Prevent user from making changes to the database (SQL Injection)
``` sql
-- Create user role
CREATE ROLE "user" nologin;
-- Grant access to the schema
GRANT USAGE ON SCHEMA public TO "user";
-- Grant access to all tables in the schema
GRANT SELECT ON ALL TABLES IN SCHEMA public TO "user";
-- Optionally grant access to future tables in the schema
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO "user";
```

## Installation

To get a local copy up and running, follow these simple steps:

Clone the repository:
   ```sh
   git clone https://github.com/seizaku/next-query-builder.git
```

Install Dependencies
   ```sh
    npm install
```

Run the Development Server
   ```sh
    npm run dev
```

## Docker Compose

   ```sh
   docker-compose up -d
```

## Environment Variables

To run this project, you will need to copy paste the variables from .env.example to your .env file

## Screenshots

![App Screenshot](https://gcdnb.pbrd.co/images/gvcq8QaZ4Dp8.png?o=1)

    
## Authors

- [@seizaku](https://www.github.com/seizaku)


## License

[MIT](https://choosealicense.com/licenses/mit/)

