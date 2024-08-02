import { QueryBuilder, RuleGroupActions, Records } from "@/components";
import { fetchRecords } from "@/server/actions/fetch-records";

export default async function Home() {
  const data = await fetchRecords();

  return (
    <main className="grid min-h-screen grid-cols-1 gap-4 p-8 sm:px-24">
      <section>
        <h1 className="py-2 text-xl font-bold">Users</h1>
        <h6 className="mb-4 text-xs font-medium text-muted-foreground">
          {data.length} Users
        </h6>
        <QueryBuilder />
      </section>
      <RuleGroupActions />
      <Records initialData={data} />
    </main>
  );
}
