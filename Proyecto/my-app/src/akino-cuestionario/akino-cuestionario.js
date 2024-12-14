import React, {useState, useEffect} from 'react';
import './akino-cuestionario.css';
import logo from '../assets/logo.jpg';
import warningIcon from '../assets/warning.png';
import snoopDog from '../assets/snoop_dog.png';
import {useNavigate} from 'react-router-dom';
import clickSound from '../assets/snoop-aah-sound.mp3';
import LoadingGif from './LoadingGif';
import adiccion1 from '../assets/addiction-resolution/marijuana.jpg';

function getAdiccion(answers) {
    /*devuelve la adiccion obtenida traves del las
    repuestas del usuario y al uso del llm para la respuesta*/
    return "Marijuana"; // valor provisional
}


function getAdiccionImage(adiccion) {
    /*
    devuelve la imagen de la adiccion obtenida
    adiccion : String
    */
    return adiccion1; // valor provisional
}

function Cuestionario() {
    const navigate = useNavigate();

    // evento cuando haga click en volver al dashboard
    const handleBackDashboard = () => {
        navigate('/dashboard');
    };

    // evento para reproducir el sonido del click
    const playClickSound = () => {
        const audio = new Audio(clickSound); // Crea una nueva instancia de Audio
        audio.play(); // Reproduce el sonido
    };

    /*
    Preguntas de prueba para el cuestionario
    alomejor sería lo suyo tener un json con las preguntas
    para no tener un array grande de preguntas en el codigo
    */
    const questions = [
        {
            question: "¿Te consideras un adicto al trabajo?",
            options: ["Sí", "No", "A veces"],
        },
        {
            question: "¿Te cuesta desconectar del trabajo?",
            options: ["Sí", "No", "A veces"],
        },
        {
            question: "¿Te sientes culpable cuando no trabajas?",
            options: ["Sí", "No", "A veces"],
        }
    ];
    
    // Definicion de variables de estado
    const total_questions = questions.length; // Número total de preguntas
    const [contador, setContador] = useState(1); // Contador de preguntas

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]); // guarda las preguntas y respuestas del usuario
    const [isTimeUp, setIsTimeUp] = useState(false); // Estado para controlar si el tiempo ha pasado del timer


    // Función para manejar la selección de la respuesta
    const handleAnswerSelect = (answer) => {
        playClickSound();
        // Guarda la respuesta del usuario
        setAnswers([...answers, { question: questions[currentQuestionIndex].question, answer }]);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setContador(contador + 1);
    };

    // temporizador de 5 seg para mostrar complejidad (queda wapo)
    useEffect(() => {
        // Solo se activa cuando se termine el cuestionario
        if (currentQuestionIndex >= total_questions - 1) {
          const timer = setTimeout(() => {
            setIsTimeUp(true); // Cuando el temporizador termine, cambia el estado
          }, 5000); // Espera 5 segundos antes de ejecutar la acción
    
          // Limpiar el temporizador si el componente se desmonta antes de que termine
          return () => clearTimeout(timer);
        }
      }, [currentQuestionIndex]); // El efecto se ejecutará cuando cambie currentQuestionIndex

    return (
        <div className="div-akino">
            {/*Cabecera de la página*/}
            <header className='header-akino'>
                <img src={logo} className='logo'/>
                <h1>AKINO</h1>
                <button className="button-back" onClick={handleBackDashboard}>Volver al Dashboard</button>
            </header>
            
            {/*Contenido de la página
                - La imagen del colegón
                - El cuestionario
            */}
            <div className="content-section">
                <div className='snoop-dog-container'>
                    <img src={snoopDog} alt="Snoop Dog" className="snoop-dog" />
                    {/*Cuestionario*/}
                    <div className="question-container">
                        {currentQuestionIndex <= total_questions - 1 ? ( // Si el cuestionario no ha terminado, muestra las preguntas
                            <div className="options-container">

                                <h2> {/* Muestra la pregunta actual */}
                                    {contador}/{total_questions} - {questions[currentQuestionIndex]?.question}
                                </h2>
                                
                                {/* Muestra las opciones de respuesta */}
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
                        ) : ( // Si el cuestionario ha terminado, muestra los resultados
                            isTimeUp ? (
                                (() => {
                                    console.log(answers); //Inspeccionar -> Console para ver las respuestas guardadas
                                    let adiccion = getAdiccion(answers);
                                    let imagen = getAdiccionImage(adiccion);
                                    return (
                                        <div>
                                            <p>La adicción que podrías tener es:</p>
                                            <img src={imagen} className='adiction-image' ></img>
                                            <p>{adiccion}</p>
                                        </div>
                                    );
                                })()
                            ) : (
                            // Si el tiempo no ha terminado, muestra un mensaje o espera antes de mostrar los resultados
                                <LoadingGif />
                            )
                        )}
                    </div>
                </div>

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

export default Cuestionario;