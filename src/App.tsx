import {BrowserRouter as Router, useLocation} from 'react-router-dom';
import './App.css';
import AppRoutes from './utils/routes';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserGroup, faUserPlus, faRightFromBracket, faCopy } from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import notifSound from "./assets/notifSound.mp3"
import useStoreFriendRequests from "./utils/store/useStoreFriendRequests";
import {useEffect} from 'react';
import Toast from './components/Toast';
import ToastManager from "./components/ToastManager"
import {Friends, useFriendsStore} from "./utils/store/useStoreFriends";
import { Message, useMessageStore} from './utils/store/useStoreMessages';
import { toast } from 'react-toastify';
import useStoreUser from './utils/store/useStoreUser';

function App() {
    return (
        <Router>
            <AppContent/>
        </Router>
    );
}

function AppContent() {
    const location = useLocation();
    const url = window.location.href;
    const id = url.split("/").pop();
    const {fetchFriendRequests} = useStoreFriendRequests();
    const {user} = useStoreUser();
    const { addMessage} = useMessageStore();
    const { getFriendById, fetchAllFriends } = useFriendsStore();

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/notifications', {withCredentials: true});

        eventSource.addEventListener('message-received', (event) => {
            const data : Message = JSON.parse(event.data);
            const friendMessage : Friends | undefined = getFriendById(data.emitterId);
            const messageToast = () => (
                <Link style={{color: "rgb(55,27,88,100)"}} to={`/chat/${friendMessage?.userId}`}>
                    <h2>{friendMessage?.username}</h2>
                    {data.content.length > 50 ? 
                      <p className='notif' style={{maxWidth:"300px", color: "black"}}>{data.content.substring(0,50) + "..."}</p> :
                      <p className='notif' style={{maxWidth:"300px", color: "black"}}>{data.content.substring(0,50)}</p>
                    }
                </Link>
            );
            if (id !== data.emitterId) {
                new Audio(notifSound).play();
                toast(messageToast);
            }
            addMessage(data, id);
        });

        eventSource.addEventListener('friend-request-received', (event) => {
            new Audio(notifSound).play();
            const data = JSON.parse(event.data);
            console.log(data);
            Toast.notify("Vous avez reçu une demande d'ami");
            fetchFriendRequests();
        });

        eventSource.addEventListener('friend-request-accepted', (event) => {
            const data = JSON.parse(event.data);
            Toast.notify("Votre demande d'ami a été acceptée", {type: "info"});
            console.log(data);
            fetchAllFriends();
        });

        return () => {
            eventSource.close();
        };
    }, [fetchAllFriends,getFriendById,fetchFriendRequests, addMessage, id]);

    function copyMyIdToClipboard() {
      navigator.clipboard.writeText(user!.id);
      Toast.notify("Identifiant copié", {type: "info"});
    }

    return (
        <>
            <ToastManager/>
            <div className='main'>
                <nav>
                    <a href="/">DiscordRemake</a>
                    {location.pathname !== '/login' && location.pathname !== '/signup' && (
                        <div className="nav-icons">
                            <a onClick={copyMyIdToClipboard} style={{cursor:"pointer"}}>
                              <FontAwesomeIcon icon={faCopy} />
                            </a>
                            <Link to={'/friends/requests'}>
                                <FontAwesomeIcon icon={faUserGroup} />
                            </Link>
                            <Link to={'/friends'}>
                                <FontAwesomeIcon icon={faUserPlus} />
                            </Link>
                            <Link to={'/logout'}>
                                <FontAwesomeIcon icon={faRightFromBracket} />
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
