import axios from "axios";
import { create } from "zustand";

export interface Friends {
    userId: string;
    username: string;
    startedAt: string;
}

interface useFriends{
    friends: Friends[]
    setFriends : (friends : Friends[]) => void
    fetchAllFriends : () => void
    getFriendById : (friendId: string | undefined) => Friends | undefined
  }
  
  export const useFriendsStore = create<useFriends>((set, get) => ({
    friends: [],
    setFriends(friendData) {
        set((state) => ({
            friends: [...state.friends, ...friendData]
        }));
    },
    getFriendById(friendId) {
        if (!friendId) return undefined;
        return get().friends.find(friend => friend.userId === friendId);
    },
      fetchAllFriends: async () => {
          try {
              const response = await axios.get("http://localhost:3000/social/friends", { withCredentials: true });
              set({ friends: response.data });
          } catch (error) {
              console.error("Erreur lors du chargement des amis :", error);
          }
      }
  }))