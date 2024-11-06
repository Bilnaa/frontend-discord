import { create } from "zustand";

export interface Friends {
    userId: string;
    username: string;
    startedAt: string;
}

interface useFriends{
    friends: Friends[]
    setFriends : (friends : Friends[]) => void
    fetchAllFriends : (friends : Friends[]) => void
    getFriendById : (friendId: string | undefined) => void
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
    fetchAllFriends(friendData) {
      set({
        friends: friendData,
      });
    },
  }))