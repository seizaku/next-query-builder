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


## Screenshots

![App Screenshot](https://gcdnb.pbrd.co/images/gvcq8QaZ4Dp8.png?o=1)


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```env
# PostgreSQL database password
POSTGRES_PASSWORD='password'

# PGAdmin credentials
PGADMIN_DEFAULT_EMAIL='postgres@pgadmin.com'
PGADMIN_DEFAULT_PASSWORD='postgres'

# PostgREST URL
POSTGREST_URL='http://127.0.0.1:3333'
```
