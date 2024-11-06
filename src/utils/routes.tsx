import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from '../pages/Home';
import Chat from '../components/home/Chat';
import FriendRequests from '../components/FriendRequests'
import FriendRequestsList from '../components/FriendRequestsList'
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import useStoreLogin from './store/useStoreLogin';
import useStoreUser from './store/useStoreUser';
import axios from 'axios';

const Requestlogout = async () => {
  await axios.post("http://localhost:3000/auth/logout", { withCredentials: true })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error("Impossible de se déconnecter", error);
    });
};

const Logout = () => {
  const { logout } = useStoreLogin();
  const { clearUser } = useStoreUser();

  useEffect(() => {
    const performLogout = async () => {
      await Requestlogout();
      logout();
      clearUser();
    };

    performLogout();
  }, [logout, clearUser]);

  return <Navigate to="/login" />;
};

const useAuthenticated = (element: JSX.Element) => {
  const { isLoggedIn } = useStoreLogin();
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const useRedirectIfAuthenticated = (element: JSX.Element) => {
  const { isLoggedIn } = useStoreLogin();
  return isLoggedIn ? <Navigate to="/" /> : element;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={useAuthenticated(<Home />)}>
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/friends" element={<FriendRequests />} />
        <Route path="/friends/requests" element={<FriendRequestsList />} />
      </Route>
      <Route path="/login" element={useRedirectIfAuthenticated(<Login />)} />
      <Route path="/logout" element={<Logout />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;