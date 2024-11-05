import { create } from 'zustand';

interface LoginState {
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

const useStoreLogin = create<LoginState>((set) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    return {
        isLoggedIn,
        login: () => {
            localStorage.setItem("isLoggedIn", "true");
            set({ isLoggedIn: true });
        },
        logout: () => {
            localStorage.removeItem("isLoggedIn");
            set({ isLoggedIn: false });
        }
    };
});

export default useStoreLogin;