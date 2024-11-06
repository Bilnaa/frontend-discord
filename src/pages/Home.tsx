import { Outlet } from "react-router-dom";
import FriendList from "../components/home/FriendList";

const Home = () => {
  return (
    <div style={{height:"90vh", display:"flex"}}>
      <FriendList/>
      <Outlet />
    </div>
  );
}

export default Home;