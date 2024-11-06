import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Chat from '../components/home/Chat';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route path="/chat/:id" element={<Chat />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;