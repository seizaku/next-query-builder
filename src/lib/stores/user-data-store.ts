import { RuleGroupType } from "react-querybuilder";
import { create } from "zustand";
import { fields, getOperators } from "@/app/(root)/_components/query-builder";
import { User } from "@/app/(root)/_components/columns";

type UserStoreProps = {
  users?: User[];
  setUserData: (data: User[]) => void;
};

export const QueryBuilderStore = create<UserStoreProps>((set, get) => ({
  users: undefined,
  setUserData: (data) => {
    set({users: data})
  }
}));
