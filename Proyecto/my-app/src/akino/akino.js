import React from 'react';
import './akino.css';
import logo from '../assets/logo.jpg';
import warningIcon from '../assets/warning.png';
import {useNavigate} from 'react-router-dom';

function Akino() {
    const handleBackClick = () => {
        window.history.back();  // Regresa a la página anterior
    };

    const navigate = useNavigate();

    return (
        <div className="div-akino">
            <header className='header-akino'>
                <img src={logo} className='logo'/>
                <h1>AKINO</h1>
                <button className="button-back" onClick={handleBackClick}>Volver al Dashboard</button>
            </header>
            
            <div className="content-section">
                <h1>¿Te consideras un adicto? ¡Compruebalo ahora!</h1>
                <button onClick={() => navigate('/akino-cuestionario')} className="button-akinator">
                    Comenzar
                </button>
                <article>
                <div className="warning-container">
                    <img src={warningIcon} alt="Icono de advertencia" className="warning-icon" />
                    <p>
                        ¡AVERTENCIA! Este test no es un diagnóstico médico, si tienes dudas acerca de tu salud mental, te recomendamos acudir con un profesional.
                    </p>
                </div>
                </article>
            </div>
        </div>
    );
}

export default Akino;