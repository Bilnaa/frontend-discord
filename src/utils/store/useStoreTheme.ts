import { create } from 'zustand';
import { lightTheme, darkTheme } from '../themes';

interface UseTheme {
    theme: typeof lightTheme | typeof darkTheme;
    changeTheme: () => void;
}

export const useStoreTheme = create<UseTheme>((set) => ({
    theme: (localStorage.getItem('theme') === 'light' ? lightTheme : darkTheme),
    changeTheme: () => {
        set((state) => {
            const newTheme = state.theme === lightTheme ? darkTheme : lightTheme;
            localStorage.setItem('theme', newTheme === darkTheme ? 'dark' : 'light');
            return { theme: newTheme };
        });
    },
}));
