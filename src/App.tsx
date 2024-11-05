import { BrowserRouter as Router, Link } from 'react-router-dom';
import './App.css';
import AppRoutes from './utils/routes';

function App() {
  return (
    <Router>
      <div>
        <AppRoutes />
        <nav>
          <ul>
            <li>
              <Link to="/">Accueil</Link>
            </li>
          </ul>
        </nav>
      </div>
    </Router>
  );
}

export default App;