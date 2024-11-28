import './LoginForm.css';

function LoginForm() {
    return (
        <div className='Wrapper'>
            <article>
                <h1>Login</h1>
                <form>
                    <label>
                        <p>Usuario</p>
                        <input type="text" name="usuario" />
                    </label>
                    <label>
                        <p>Contraseña:</p>
                        <input type="password" name="contraseña" />
                    </label>
                    <button type="submit">Iniciar sesión</button>
                </form>
            </article>
        </div>
    );
    }

export default LoginForm;