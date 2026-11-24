"use client";

import { createContext, useContext } from "react";

export interface ContextUser {
  id?: string;
  name?: string | null;
  email?: string | null;
}

const UserContext = createContext<{ user: ContextUser | null }>({
  user: null,
});

export function UserProvider({
  user,
  children,
}: {
  user: ContextUser | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
