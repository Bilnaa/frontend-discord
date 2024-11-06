import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './utils/routes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import notifSound from "./assets/notifSound.mp3"
import useStoreFriendRequests from "./utils/store/useStoreFriendRequests";
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import ToastManager from "./components/ToastManager"


function App() {

  const {fetchFriendRequests} = useStoreFriendRequests();

  useEffect(() => {
    console.log('eventSource ouvert')
    const eventSource = new EventSource('http://localhost:3000/notifications', {withCredentials: true});

    eventSource.addEventListener('friend-request-received', (event) => {
      new Audio(notifSound).play()
      const data = JSON.parse(event.data);
      toast("Nouvelle demande d'ami")
      fetchFriendRequests()
      console.log(data);
    });

    return () => {
      eventSource.close();
      console.log('eventSource fermé', eventSource);
    };
  }, []);
  return (
    <Router>
      <ToastManager/>
      <div className='main'>
        <nav style={{height:"10vh", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px"}}>
          <a href="/">DiscordRemake</a>
          <div className="nav-icons">
            <Link to={'/friends/requests'}>
              <FontAwesomeIcon icon={faUserGroup} />
            </Link>
            <Link to={'/friends'}>
              <FontAwesomeIcon icon={faUserPlus} />
            </Link>
          </div>
        </nav>
        <AppRoutes />
      </div>

    </Router>

  );
}

export default App;
