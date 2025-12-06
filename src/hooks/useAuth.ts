import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    loggedIn: boolean;
    role?: string;
    setLoggedIn: (value: boolean) => void;
    setRole: (role?: string) => void;
    _hasHydrated: boolean; // NEW
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            loggedIn: false,
            role: undefined,
            _hasHydrated: false,

            setLoggedIn: (value) => set({ loggedIn: value }),
            setRole: (role) => set({ role }),

        }),
        {
            name: "auth-storage",

            // Zustand hydration callback
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state._hasHydrated = true;
                }
            },
        }
    )
);
