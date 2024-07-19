import { create } from "zustand";

type UserStoreProps = {
  users?: any;
  setUserData: (data: any) => void;
};

export const UserDataStore = create<UserStoreProps>((set, get) => ({
  users: undefined,
  setUserData: (data) => {
    set({users: data})
  }
}));
