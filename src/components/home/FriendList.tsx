import { useEffect, useState } from "react";
import { Friends, useFriendsStore } from "../../utils/store/useStoreFriends";
import axios from "axios";
import { Link } from "react-router-dom";

function FriendList() {
  const { friends, setFriends } = useFriendsStore();
  let rendered = false;

  useEffect(() => {
    const fetchFriends = async () => {
      await axios.get("http://localhost:3000/social/friends", { withCredentials: true })
      .then((response) => {
        setFriends(response.data)
      })
      .catch((error) => {
        console.error(error);
      });
    };
    
    if (rendered == false) {
      fetchFriends();
      rendered = true;
    }
  }, []);
  

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