import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm/LoginForm';
import Dashboard from './Dashboard/Dashboard';
import Akino from './akino/akino';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/akino" element={<Akino />} />
            </Routes>
        </Router>
    );
}

export default App;
