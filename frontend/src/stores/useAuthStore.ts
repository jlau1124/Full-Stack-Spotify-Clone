import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

interface AuthStore {
    userName: string;
    isAdmin: boolean;
    isLoading: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    userName: "",  // initialize
    isAdmin: false,
    isLoading: false,
    error: null,

    checkAdminStatus: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.get("/admin/check");

            // set isAdmin and userName from backend response
            set({ 
                isAdmin: response.data.admin,
                userName: response.data.userName || "" 
            });
        } catch (error: any) {
            set({
                isAdmin: false,
                error: error.response?.data?.message || "Failed to fetch admin status",
                userName: ""
            });
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => {
        set({ isAdmin: false, isLoading: false, error: null, userName: "" });
    }
}));
