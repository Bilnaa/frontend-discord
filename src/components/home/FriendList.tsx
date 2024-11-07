import { useEffect } from "react";
import { Friends, useFriendsStore } from "../../utils/store/useStoreFriends";
import { Link } from "react-router-dom";

function FriendList() {
  const { friends, fetchAllFriends } = useFriendsStore();

    useEffect(() => {
        fetchAllFriends();
    }, [fetchAllFriends]);
  

  return (
    <div className="friend-list-container">
      <h2>Friends</h2>
      <div style={{display:"flex", flexDirection: "column"}}>
        {friends.map((friend: Friends) => <Link key={friend.userId} to={`/chat/${friend.userId}`}>{friend.username}</Link>)}
      </div>
    </div>
  )
}

export default FriendList;