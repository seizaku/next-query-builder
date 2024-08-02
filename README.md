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
   │   │       └── user-store.ts     
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

