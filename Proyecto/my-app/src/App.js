import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm/LoginForm';
import Dashboard from './Dashboard/Dashboard';
import Akino from './akino/akino';
import ProtectedRoute from './ProtectedRouete/ProtectedRoute';

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
            </Routes>
        </Router>
    );
}

export default App;
