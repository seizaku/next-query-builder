import { UserDataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { User } from "./_components/columns";
import { Button } from "@/components/ui/button";
import { CustomQueryBuilder } from "./_components/query-builder";
import { Query } from "./_components/query";

async function fetchData() {
  const res = await fetch(process.env.NEXT_PUBLIC_API_HOST + "/api/users");

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json() as Promise<{ data: User[] }>;
}

export default async function Home() {
  const user = await fetchData();

  return (
    <main className="min-h-screen p-8 sm:p-24">
      <Query />
      <section>
        <h1 className="py-2 text-xl font-bold">Users</h1>
        <h6 className="mb-4 text-xs font-medium text-muted-foreground">
          {user.data.length} Total Users
        </h6>
        <CustomQueryBuilder />
      </section>
      <section className="mt-6">
        <UserDataTable columns={columns} data={user.data} />
      </section>
    </main>
  );
}
