import './LoginForm.css';
import userIcon from '../assets/user.svg'
import passwordIcon from '../assets/password.svg'



function LoginForm() {
    return (
        <div className='Wrapper'>
            <article>
                <h1>Login</h1>
                <form>
                    <div className="input-wrapper">
                        <img src={userIcon} alt="User Icon" />
                        <input type="text" name="user" placeholder="Nombre de Usuario" required />
                    </div>

                    <div className="input-wrapper">
                        <img src={passwordIcon} alt="Password Icon" />
                        <input type="password" name="password" placeholder="Contraseña" required />
                    </div>
                    <button type="submit">Iniciar sesión</button>
                </form>
            </article>
        </div>
    );
    }

export default LoginForm;