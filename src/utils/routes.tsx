import { Routes, Route,Navigate} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import useStoreLogin from './store/useStoreLogin';
import useStoreUser from './store/useStoreUser';

const Logout = () => {
  const { logout } = useStoreLogin();
  const { clearUser } = useStoreUser();

  logout();
  clearUser();
  return <Navigate to="/login" />;
}

const useAuthenticated = (element : JSX.Element) => {
  const { isLoggedIn } = useStoreLogin();
  return (
    isLoggedIn ? element : <Navigate to="/login" />
  )
}
const AppRoutes = () => {

  return (
    <Routes>
      <Route path="/" element={useAuthenticated(<Home />)} />
      <Route path="/login" element={<Login />} />
      <Route path="/logout" element={<Logout />} />
      <Route path='/signup' element={<SignUp />}/>
      <Route path="*" element={<h1>404 - Page not found</h1>} />
    </Routes>
  );
};

export default AppRoutes;