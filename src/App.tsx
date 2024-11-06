import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import './App.css';
import AppRoutes from './utils/routes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import notifSound from "./assets/notifSound.mp3"
import useStoreFriendRequests from "./utils/store/useStoreFriendRequests";
import { useEffect } from 'react';
import Toast from './components/Toast';
import ToastManager from "./components/ToastManager"
import { useFriendsStore } from "./utils/store/useStoreFriends";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const { fetchFriendRequests } = useStoreFriendRequests();

  useEffect(() => {
    console.log('eventSource ouvert')
    const eventSource = new EventSource('http://localhost:3000/notifications', {withCredentials: true});

    eventSource.addEventListener('friend-request-received', (event) => {
      new Audio(notifSound).play()
      const data = JSON.parse(event.data);
      Toast.notify("Vous avez reçu une demande d'ami")
      fetchFriendRequests()
      console.log('friend-request-received', data);
    });

    eventSource.addEventListener('friend-request-accepted', (event) => {
      const data = JSON.parse(event.data);
      Toast.notify("Votre demande d'ami a été acceptée",{type: "info"})
        const { fetchAllFriends } = useFriendsStore.getState();
        fetchAllFriends();
      console.log('friend-request-accepted', data);
    });

    return () => {
      eventSource.close();
      console.log('eventSource fermé');
    };
  }, [fetchFriendRequests]);

  return (
    <>
      <ToastManager />
      <div className='main'>
        <nav style={{ height: "10vh", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
          <a href="/">DiscordRemake</a>
          {location.pathname !== '/login' && location.pathname !== '/signup' && (
            <div className="nav-icons">
              <Link to={'/friends/requests'}>
                <FontAwesomeIcon icon={faUserGroup} />
              </Link>
              <Link to={'/friends'}>
                <FontAwesomeIcon icon={faUserPlus} />
              </Link>
            </div>
          )}
        </nav>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
