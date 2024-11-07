import { Outlet, useNavigate } from "react-router-dom";
import FriendList from "../components/home/FriendList";
// import { Friends, useFriendsStore } from "../utils/store/useStoreFriends";
// import { useEffect } from "react";

const Home = () => {
  // const navigate = useNavigate();
  // const { friends } = useFriendsStore();
  // const lastFriend : Friends = friends[0];

  // useEffect(() => {
  //   console.log(lastFriend.userId);
  //   navigate("/chat/" + lastFriend?.userId)
  // }, [])
  
  

  return (
    <div style={{height:"90vh", display:"flex"}}>
      <FriendList/>
      <Outlet />
    </div>
  );
}

export default Home;