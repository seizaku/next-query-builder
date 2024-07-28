import { create } from "zustand";
import { User, Profile } from "@/types/index";

type UserStoreProps = {
  users?: Array<User & Profile>;
  refetch: () => void;
  setRefetchCallback: (callback: () => void) => void;
  setUserData: (data: Array<User & Profile>) => void;
};

/**
 * Zustand store for managing user data state.
 */
export const UserStore = create<UserStoreProps>((set, get) => ({
  users: [],
  refetch: () => {},
  setRefetchCallback: (callback) => {
    set({ refetch: callback })
  },
  setUserData: (data) => {
    set({ users: data });
  },
}));
