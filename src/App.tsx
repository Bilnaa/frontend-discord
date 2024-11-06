import {  BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './utils/routes';

function App() {
  return (
    <div className='main'>
      <nav style={{height:"10vh"}}>
        <a href="/">DiscordRemake</a>
      </nav>
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}

export default App;