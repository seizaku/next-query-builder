import { CustomQueryBuilder } from "./_components/query-builder/QueryBuilder";
import { GroupControl } from "./_components/query-builder/GroupControl";
import { getRecords } from "@/server/actions/get-records";
import { Users } from "./_components/Users";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getRecords();

  return (
    <main className="min-h-screen p-8 sm:px-24">
      <section>
        <h1 className="py-2 text-xl font-bold">Users</h1>
        <h6 className="mb-4 text-xs font-medium text-muted-foreground">
          {data.length} Users
        </h6>
        <CustomQueryBuilder />
      </section>
      <GroupControl />
      <section className="mt-6">
        <Users initialData={data} />
      </section>
    </main>
  );
}
