# Next.js Custom Query Builder

This is a Next.js project featuring a custom query builder. It provides an intuitive interface for managing complex queries with dynamic filters, date pickers, and search features.

You can see a live demo at https://seizaku-query-builder.vercel.app/
## Tech Stack

- Next.js - React framework for server-side rendering and static site generation.
- Prisma - ORM for database management.
- PostgreSQL - Relational database system.
- Hono - Backend framework for building APIs.
- TailwindCSS - Utility-first CSS framework for styling.
- ShadcnUI - Component library for building user interfaces.



## Installation

To get a local copy up and running, follow these simple steps:

Clone the repository:
   ```sh
   git clone https://github.com/seizaku/next-query-builder.git
```

Install Dependencies
   ```sh
    npm install
    yarn install
    pnpm install
    bun install
```

Run the Development Server
   ```sh
    npm run dev
    yarn dev 
    pnpm dev bun dev
```

Run Docker Compose
   ```sh
   docker-compose up
```


## Screenshots

![App Screenshot](https://gcdnb.pbrd.co/images/gvcq8QaZ4Dp8.png?o=1)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```env
Local Environment:

# PostgreSQL database password
POSTGRES_PASSWORD='password'

# PGAdmin credentials
PGADMIN_DEFAULT_EMAIL='postgres@pgadmin.com'
PGADMIN_DEFAULT_PASSWORD='postgres'

# PostgREST URL to be used by Next.js
POSTGREST_URL='http://127.0.0.1:8080'

# PostgREST config
PGRST_DB_URI="postgres://postgres:password@db:5432/postgres"
PGRST_DB_SCHEMA="public"
PGRST_DB_ANON_ROLE="user"
PORT=8080

# NextJS API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

```
