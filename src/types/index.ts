import { RuleType } from "react-querybuilder";

export type User = {
  id: number;
  email: string;
  name?: string;
  createdAt: Date;
  updated_at: Date;
};

export type Profile = {
  avatar: string;
  company: string;
  zipCode: string;
  country: string;
  state: string;
  city: string;
  age: number;
  sex: string;
  userId: number;
  user: User;
};

export type RuleGroupType = {
  combinator?: "and" | "or";
  rules: Array<RuleType | RuleGroupType>;
  groupCombinator?: "and" | "or";
};