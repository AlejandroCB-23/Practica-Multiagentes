import React, { useState, useEffect } from 'react';
import './akino-cuestionario.css';
import logo from '../assets/logo.jpg';
import warningIcon from '../assets/warning.png';
import snoopDog from '../assets/snoop_dog.png';
import { useNavigate } from 'react-router-dom';
import clickSound from '../assets/snoop-aah-sound.mp3';
import LoadingGif from './LoadingGif'; 


async function getAdiccion(answers) {
    try {
        const response = await fetch('http://localhost:8000/get-response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ answers: answers }),
        });

        if (!response.ok) {
            throw new Error(`Failed to get response from the server. Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.response) {
            return data.response;
        } else {
            throw new Error('Invalid response format from the server');
        }
    } catch (error) {
        console.error('Error fetching addiction type:', error);
        return 'Unknown';
    }
}

function getAdiccionImage(adiccion) {
    const addictionImages = {
        'Alcohol': require('../assets/addiction-resolution/Alcohol.png'),
        'Tabaco': require('../assets/addiction-resolution/Tabaco.png'),
        'Marihuana': require('../assets/addiction-resolution/Marihuana.png'),
        'Cocaina': require('../assets/addiction-resolution/Cocaina.png'),
        'Heroina': require('../assets/addiction-resolution/Heroina.png'),
        'Metanfetamina': require('../assets/addiction-resolution/Metanfetamina.png'),
    };

    // Devuelve la imagen por defecto si no lo encuentra
    return addictionImages[adiccion] || require('../assets/addiction-resolution/unknown.png');
}

function Cuestionario() {
    const navigate = useNavigate();

    // Función para ir hacia el dashboard
    const handleBackDashboard = () => {
        navigate('/dashboard');
    };

    // Función para reproducir el sonido de click
    const playClickSound = () => {
        const audio = new Audio(clickSound);
        audio.play();
    };

    // Estados
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); 
    const [contador, setContador] = useState(1);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [addictionResult, setAddictionResult] = useState(null); 

    const fetchQuestions = async () => {
        setError('');
        setIsLoading(true); 

        const token = localStorage.getItem('token');
        if (!token) {
            setError('No hay sesión activa. Por favor inicie sesión.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/get-questions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.questions) {
                    setQuestions(data.questions); 
                } else {
                    throw new Error('No se encontraron preguntas');
                }
            } else {
                throw new Error('Error al obtener las preguntas');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('No se pudieron cargar las preguntas. Intenta nuevamente.');
        } finally {
            setIsLoading(false); 
        }
    };


    useEffect(() => {
        fetchQuestions();
    }, []); 


    const handleAnswerSelect = (answer) => {
        playClickSound();
        setAnswers([...answers, { question: questions[currentQuestionIndex].question, answer }]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setContador(contador + 1);
    };

    useEffect(() => {
        if (currentQuestionIndex >= questions.length) {
            const timer = setTimeout(async () => {
                setIsTimeUp(true); 
                const addiction = await getAdiccion(answers); 
                setAddictionResult(addiction); 
            }, 5000); 

            return () => clearTimeout(timer);
        }
    }, [currentQuestionIndex, questions.length, answers]);

    return (
        <div className="div-akino">
            <header className="header-akino">
                <img src={logo} className="logo" alt="Logo" />
                <h1>AKINO</h1>
                <button className="button-back" onClick={handleBackDashboard}>Volver al Dashboard</button>
            </header>

            <div className="content-section">
                <div className="snoop-dog-container">
                    <img src={snoopDog} alt="Snoop Dog" className="snoop-dog" />
                    <div className="question-container">
                        {isLoading ? (
                            <LoadingGif /> 
                        ) : error ? (
                            <div className="error-message">{error}</div> 
                        ) : currentQuestionIndex < questions.length ? (
                            <div className="options-container">
                                <h2>
                                    {contador}/{questions.length} - {questions[currentQuestionIndex]?.question}
                                </h2>
                                {questions[currentQuestionIndex]?.options.map((option, index) => (
                                    <button
                                        key={index}
                                        className="option-button"
                                        onClick={() => handleAnswerSelect(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            isTimeUp ? (
                                <div>
                                    <p>La adicción que podrías tener es:</p>
                                    <img src={getAdiccionImage(addictionResult)} className="adiction-image" alt="Adicción" />
                                    <p>{addictionResult}</p>
                                </div>
                            ) : (
                                <LoadingGif />
                            )
                        )}
                    </div>
                </div>

                <article>
                    <div className="warning-container">
                        <img src={warningIcon} alt="Warning Icon" className="warning-icon" />
                        <p>
                            ¡AVERTENCIA! Este test no es un diagnóstico médico, si tienes dudas acerca de tu salud, te recomendamos acudir con un profesional.
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}

export default Cuestionario;
