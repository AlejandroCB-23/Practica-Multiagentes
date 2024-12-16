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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
    
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                body: formData
            });
    
            if (response.ok) {
                const data = await response.json();
    
                // Guarda el token y el rol en el almacenamiento local
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('role', data.role); // Aquí guardas el rol del usuario
                setError('');
                navigate('/dashboard');
            } else {
                setError('Usuario o contraseña incorrectos.');
            }
        } catch (error) {
            setError('Error al conectar con el servidor.');
        }
    };
    

    return (
        <div className="Wrapper-Login">
            <article className="article-Login">
                <h1>Login</h1>
                <form className="form-Login" onSubmit={handleSubmit}>
                    <div className="input-wrapper-Login">
                        <img src={userIcon} alt="User Icon" />
                        <input
                            type="text"
                            name="user"
                            placeholder="Nombre de Usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-wrapper-Login">
                        <img src={passwordIcon} alt="Password Icon" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit" className="button-Login">Login</button>
                </form>
            </article>
        </div>
    );
}

export default LoginForm;