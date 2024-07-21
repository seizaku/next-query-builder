import { formatQuery } from "react-querybuilder";
import { create } from "zustand";
import { QueryBuilderStore } from "./query-builder-store";
import { User } from "@/app/_components/columns";

type UserStoreProps = {
  users?: any;
  queryResults: User[];
  loading?: boolean;
  setLoading: (value: boolean) => void;
  getUserData: () => Promise<void>;
  setUserData: (data: any) => void;
};

/**
 * Zustand store for managing user data state.
 */
export const UserDataStore = create<UserStoreProps>((set, get) => ({
  users: [],
  queryResults: [],
  loading: true,

  /**
   * Sets the loading state.
   * @param value - The loading state to set.
   */
  setLoading: (value: boolean) => {
    set({ loading: value });
  },

  /**
   * Fetches user data based on the current query in the QueryBuilderStore.
   */
  getUserData: async () => {
    try {
      set({ loading: true });
      
      // Format the current query into JSON format
      const query = QueryBuilderStore.getState().query;
      if (query.rules.find((rule) => rule.value == '')) return;

      const jsonQuery = formatQuery(query, "json");

      // Fetch user data from the API using the formatted query
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users?query=${encodeURIComponent(jsonQuery)}`,
      );

      // Handle unsuccessful response
      if (!res.ok) {
        set({ queryResults: [] });
        return;
      }

      // Parse and set the fetched user data
      const users = (await res.json()).data;
      set({ queryResults: users });
      set({ loading: false });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw error;
    }
  },

  /**
   * Sets the user data.
   * @param data - The user data to set.
   */
  setUserData: (data) => {
    set({ users: data });
  },
}));
