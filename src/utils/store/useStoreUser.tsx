import { create } from "zustand";

interface User {
    id: string;
    username: string;
}

interface UserState {
    user: User | null;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useStoreUser = create<UserState>((set) => {
    const user = localStorage.getItem("user");
    return {
        id: 0,
        user: user ? JSON.parse(user) : null,
        setUser: (user) => {
            localStorage.setItem("user", JSON.stringify(user));
            set({ user });
        },
        clearUser: () => {
            localStorage.removeItem("user");
            set({ user: null });
        }
    };
});

export default useStoreUser;