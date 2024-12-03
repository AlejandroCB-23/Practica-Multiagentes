import './LoginForm.css';
import userIcon from '../assets/user.svg';
import passwordIcon from '../assets/password.svg';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    //NOTE: Test user authentication function
    //TOFIX: Replace this function with a real authentication function
    const authenticateUser = (username, password) => {
        const mockUser = {
            username: 'admin',
            password: '1234'
        };
        return username === mockUser.username && password === mockUser.password;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (authenticateUser(username, password)) {
            setError('');
            navigate('/dashboard');
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="Wrapper">
            <article>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper">
                        <img src={userIcon} alt="User Icon" />
                        <input
                            type="text"
                            name="user"
                            placeholder="Nombre de Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-wrapper">
                        <img src={passwordIcon} alt="Password Icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Iniciar sesión</button>
                </form>
            </article>
        </div>
    );
}

export default LoginForm;
