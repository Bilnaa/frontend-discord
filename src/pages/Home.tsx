import { Outlet, useNavigate } from "react-router-dom";
import FriendList from "../components/home/FriendList";
// import { useFriendsStore } from "../utils/store/useStoreFriends";
// import { useEffect } from "react";

const Home = () => {

  // const { friends ,fetchAllFriends } = useFriendsStore();
  // const navigate = useNavigate();
  // const lastFriend = friends[0];

  // useEffect(() => {
  //   navigate(lastFriend.userId)
  // }, [])
  


  return (
    <div style={{height:"90vh", display:"flex"}}>
      <FriendList/>
      <Outlet />
    </div>
  );
}

export default Home;