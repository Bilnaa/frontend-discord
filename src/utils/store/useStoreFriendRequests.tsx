import { create } from "zustand";
import axios from "axios";
import { useFriendsStore } from "../../utils/store/useStoreFriends";

interface FriendRequest {
    id: string;
    senderId: string;
}

interface FriendRequestsState {
    friendRequests: FriendRequest[];
    fetchFriendRequests: () => Promise<void>;
    acceptFriendRequest: (requestId: string) => Promise<void>;
}

const useStoreFriendRequests = create<FriendRequestsState>((set) => ({
    friendRequests: [],

    fetchFriendRequests: async () => {
        try {
            const response = await axios.get(`${process.env.VITE_API_BASE_URL}/social/friend-requests/`, {
                withCredentials: true,
            });
            set({ friendRequests: response.data });
            console.log(response.data);
        } catch (error) {
            console.error("Impossible de récupérer les informations de l'utilisateur", error);
        }
    },

    acceptFriendRequest: async (requestId) => {
        try {
            await axios.post(`${process.env.VITE_API_BASE_URL}/social/friend-request/${requestId}/accept`, {}, {
                withCredentials: true,
            });
            set((state) => ({
                friendRequests: state.friendRequests.filter((request) => request.id !== requestId),
            }));
          const { fetchAllFriends } = useFriendsStore.getState();
          fetchAllFriends();

        } catch (error) {
            console.error("Erreur lors de l'acceptation de la demande d'ami", error);
        }
    },
}));

export default useStoreFriendRequests;
