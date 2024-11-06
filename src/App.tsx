import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import AppRoutes from './utils/routes';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className='main'>
        <nav style={{height:"10vh", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px"}}>
          <a href="/">DiscordRemake</a>
          <div className="nav-icons">
            <Link to={'/friends'}>
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
