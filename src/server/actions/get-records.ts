"use server";
import { User, Profile } from "@/types/index";
import { sanitizeQuery } from "@/lib/helpers/sanitize";

export async function getRecords(query?: string): Promise<(User & Profile)[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/rpc/query`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query ? sanitizeQuery(JSON.parse(query)) : "",
      }),
    });

    if (!res.ok) {
      console.error(
        `Error fetching users: ${res.statusText} (Status Code: ${res.status})`,
      );
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}
