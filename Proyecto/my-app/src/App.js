import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm/LoginForm';
import Dashboard from './Dashboard/Dashboard';
import Akino from './akino/akino';
import ProtectedRoute from './ProtectedRouete/ProtectedRoute';
import Cuestionario from './akino-cuestionario/akino-cuestionario';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/akino" element={
                    <ProtectedRoute>
                        <Akino />
                    </ProtectedRoute>
                } />
                <Route path="/akino-cuestionario" element={
                    <ProtectedRoute>
                        <Cuestionario />
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
