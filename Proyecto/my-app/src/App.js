import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm/LoginForm';
import Dashboard from './Dashboard/Dashboard';
import Akino from './akino/akino';
import Cuestionario from './akino-cuestionario/akino-cuestionario';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/akino" element={<Akino />} />
                <Route path="/akino-cuestionario" element={<Cuestionario />} />
            </Routes>
        </Router>
    );
}

export default App;
