import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    username: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useStoreUser = create(
    persist<UserState>(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            clearUser: () => set({ user: null }),
        }),
        {
            name: "user-storage",
        }
    )
);

export default useStoreUser;