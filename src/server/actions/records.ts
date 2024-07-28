import { User, Profile } from "@/types/index";

export async function getRecords(query?: string): Promise<(User & Profile)[]> {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`);

    if (query) {
      url.searchParams.append('q', query);
    }

    const res = await fetch(url.toString(), {
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